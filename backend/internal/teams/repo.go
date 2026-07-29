package teams

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"regexp"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var bigInt10000 = big.NewInt(10000)

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

const teamColumns = `id, name, county, sport, category, disability_category, crest_color, follower_count, follow_code`

func scanTeam(row pgx.Row) (*Team, error) {
	var t Team
	var id uuid.UUID
	if err := row.Scan(&id, &t.Name, &t.County, &t.Sport, &t.Category, &t.DisabilityCategory, &t.CrestColor, &t.FollowerCount, &t.FollowCode); err != nil {
		return nil, err
	}
	t.ID = id.String()
	return &t, nil
}

func (r *Repository) Search(ctx context.Context, query, county, sport string) ([]Team, error) {
	sql := `SELECT ` + teamColumns + ` FROM teams WHERE
		($1 = '' OR name ILIKE '%'||$1||'%' OR county ILIKE '%'||$1||'%')
		AND ($2 = '' OR county = $2)
		AND ($3 = '' OR sport = $3)
		ORDER BY name`
	rows, err := r.pool.Query(ctx, sql, query, county, sport)
	if err != nil {
		return nil, fmt.Errorf("search teams: %w", err)
	}
	defer rows.Close()

	var out []Team
	for rows.Next() {
		t, err := scanTeam(rows)
		if err != nil {
			return nil, fmt.Errorf("scan team: %w", err)
		}
		out = append(out, *t)
	}
	return out, rows.Err()
}

func (r *Repository) GetByID(ctx context.Context, id uuid.UUID) (*Team, error) {
	row := r.pool.QueryRow(ctx, `SELECT `+teamColumns+` FROM teams WHERE id = $1`, id)
	t, err := scanTeam(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get team: %w", err)
	}
	return t, nil
}

func (r *Repository) Counties(ctx context.Context) ([]string, error) {
	rows, err := r.pool.Query(ctx, `SELECT DISTINCT county FROM teams ORDER BY county`)
	if err != nil {
		return nil, fmt.Errorf("list counties: %w", err)
	}
	defer rows.Close()

	var out []string
	for rows.Next() {
		var c string
		if err := rows.Scan(&c); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

var nonAlpha = regexp.MustCompile(`[^A-Z]`)

func generateFollowCode(name string) (string, error) {
	prefix := nonAlpha.ReplaceAllString(strings.ToUpper(name), "")
	if len(prefix) > 3 {
		prefix = prefix[:3]
	}
	for len(prefix) < 3 {
		prefix += "X"
	}
	n, err := rand.Int(rand.Reader, bigInt10000)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s%04d", prefix, n.Int64()), nil
}

type ownerCreate struct {
	Name               string
	County             string
	Sport              string
	Category           string
	DisabilityCategory *string
	CrestColor         string
}

func (r *Repository) Create(ctx context.Context, ownerAccountID uuid.UUID, in ownerCreate) (*Team, error) {
	var followCode string
	var lastErr error
	for attempt := 0; attempt < 5; attempt++ {
		code, err := generateFollowCode(in.Name)
		if err != nil {
			return nil, fmt.Errorf("generating follow code: %w", err)
		}
		row := r.pool.QueryRow(ctx,
			`INSERT INTO teams (name, county, sport, category, disability_category, crest_color, follow_code, owner_account_id)
			 VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING `+teamColumns,
			in.Name, in.County, in.Sport, in.Category, in.DisabilityCategory, in.CrestColor, code, ownerAccountID,
		)
		t, err := scanTeam(row)
		if err == nil {
			return t, nil
		}
		lastErr = err
		followCode = code
	}
	return nil, fmt.Errorf("creating team (last tried follow code %s): %w", followCode, lastErr)
}

type CreateInput = ownerCreate

func (r *Repository) GetByOwner(ctx context.Context, ownerAccountID uuid.UUID) (*Team, error) {
	row := r.pool.QueryRow(ctx, `SELECT `+teamColumns+` FROM teams WHERE owner_account_id = $1`, ownerAccountID)
	t, err := scanTeam(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get team by owner: %w", err)
	}
	return t, nil
}

func (r *Repository) IsOwner(ctx context.Context, teamID, accountID uuid.UUID) (bool, error) {
	var ok bool
	err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM teams WHERE id = $1 AND owner_account_id = $2)`, teamID, accountID).Scan(&ok)
	if err != nil {
		return false, fmt.Errorf("check team ownership: %w", err)
	}
	return ok, nil
}

func (r *Repository) Follow(ctx context.Context, accountID, teamID uuid.UUID) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin follow tx: %w", err)
	}
	defer tx.Rollback(ctx)

	tag, err := tx.Exec(ctx, `INSERT INTO team_follows (account_id, team_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, accountID, teamID)
	if err != nil {
		return fmt.Errorf("insert follow: %w", err)
	}
	if tag.RowsAffected() > 0 {
		if _, err := tx.Exec(ctx, `UPDATE teams SET follower_count = follower_count + 1 WHERE id = $1`, teamID); err != nil {
			return fmt.Errorf("increment follower count: %w", err)
		}
	}
	return tx.Commit(ctx)
}

func (r *Repository) Unfollow(ctx context.Context, accountID, teamID uuid.UUID) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin unfollow tx: %w", err)
	}
	defer tx.Rollback(ctx)

	tag, err := tx.Exec(ctx, `DELETE FROM team_follows WHERE account_id = $1 AND team_id = $2`, accountID, teamID)
	if err != nil {
		return fmt.Errorf("delete follow: %w", err)
	}
	if tag.RowsAffected() > 0 {
		if _, err := tx.Exec(ctx, `UPDATE teams SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = $1`, teamID); err != nil {
			return fmt.Errorf("decrement follower count: %w", err)
		}
	}
	return tx.Commit(ctx)
}

func (r *Repository) FollowMany(ctx context.Context, accountID uuid.UUID, teamIDs []uuid.UUID) error {
	for _, teamID := range teamIDs {
		if err := r.Follow(ctx, accountID, teamID); err != nil {
			return err
		}
	}
	return nil
}

func (r *Repository) ListFollowedIDs(ctx context.Context, accountID uuid.UUID) ([]string, error) {
	rows, err := r.pool.Query(ctx, `SELECT team_id FROM team_follows WHERE account_id = $1`, accountID)
	if err != nil {
		return nil, fmt.Errorf("list followed teams: %w", err)
	}
	defer rows.Close()

	out := []string{}
	for rows.Next() {
		var id uuid.UUID
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		out = append(out, id.String())
	}
	return out, rows.Err()
}

func scanPlayer(row pgx.Row) (*Player, error) {
	var p Player
	var id uuid.UUID
	if err := row.Scan(&id, &p.Name, &p.Position, &p.JerseyNumber); err != nil {
		return nil, err
	}
	p.ID = id.String()
	return &p, nil
}

func (r *Repository) ListPlayers(ctx context.Context, teamID uuid.UUID) ([]Player, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, position, jersey_number FROM players WHERE team_id = $1 ORDER BY name`, teamID)
	if err != nil {
		return nil, fmt.Errorf("list players: %w", err)
	}
	defer rows.Close()

	out := []Player{}
	for rows.Next() {
		p, err := scanPlayer(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *p)
	}
	return out, rows.Err()
}

func (r *Repository) AddPlayer(ctx context.Context, teamID uuid.UUID, name, position string, jerseyNumber *int) (*Player, error) {
	row := r.pool.QueryRow(ctx,
		`INSERT INTO players (team_id, name, position, jersey_number) VALUES ($1,$2,$3,$4) RETURNING id, name, position, jersey_number`,
		teamID, name, position, jerseyNumber,
	)
	return scanPlayer(row)
}

func (r *Repository) RemovePlayer(ctx context.Context, teamID, playerID uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM players WHERE id = $1 AND team_id = $2`, playerID, teamID)
	if err != nil {
		return fmt.Errorf("remove player: %w", err)
	}
	return nil
}
