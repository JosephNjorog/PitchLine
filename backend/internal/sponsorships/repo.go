package sponsorships

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

const columns = `id, account_id, target_type, target_team_id, target_player_id, target_label, amount, platform_fee_pct, platform_fee_amount, net_to_team_amount, created_at`

func scan(row pgx.Row) (*Sponsorship, error) {
	var s Sponsorship
	var id, accountID uuid.UUID
	var targetTeamID, targetPlayerID *uuid.UUID
	if err := row.Scan(&id, &accountID, &s.TargetType, &targetTeamID, &targetPlayerID, &s.TargetLabel, &s.Amount, &s.PlatformFeePct, &s.PlatformFeeAmount, &s.NetToTeamAmount, &s.CreatedAt); err != nil {
		return nil, err
	}
	s.ID = id.String()
	s.AccountID = accountID.String()
	if targetTeamID != nil {
		s.TargetID = targetTeamID.String()
	} else if targetPlayerID != nil {
		s.TargetID = targetPlayerID.String()
	}
	return &s, nil
}

// resolveTarget looks up the display label for a team or player target and
// confirms it exists before a sponsorship can be created against it.
func (r *Repository) resolveTarget(ctx context.Context, targetType string, targetID uuid.UUID) (string, error) {
	if targetType == "team" {
		var name string
		err := r.pool.QueryRow(ctx, `SELECT name FROM teams WHERE id = $1`, targetID).Scan(&name)
		if errors.Is(err, pgx.ErrNoRows) {
			return "", fmt.Errorf("team not found")
		}
		if err != nil {
			return "", fmt.Errorf("resolve team target: %w", err)
		}
		return name, nil
	}

	var athleteName, teamName string
	err := r.pool.QueryRow(ctx,
		`SELECT a.name, t.name FROM athletes a JOIN teams t ON t.id = a.team_id WHERE a.id = $1`,
		targetID,
	).Scan(&athleteName, &teamName)
	if errors.Is(err, pgx.ErrNoRows) {
		return "", fmt.Errorf("athlete not found")
	}
	if err != nil {
		return "", fmt.Errorf("resolve athlete target: %w", err)
	}
	return fmt.Sprintf("%s (%s)", athleteName, teamName), nil
}

func (r *Repository) Create(ctx context.Context, accountID uuid.UUID, targetType string, targetID uuid.UUID, amount float64) (*Sponsorship, error) {
	label, err := r.resolveTarget(ctx, targetType, targetID)
	if err != nil {
		return nil, err
	}

	feeAmount := amount * PlatformFeePct / 100
	net := amount - feeAmount

	var teamCol, playerCol any
	if targetType == "team" {
		teamCol = targetID
	} else {
		playerCol = targetID
	}

	row := r.pool.QueryRow(ctx,
		`INSERT INTO sponsorships (account_id, target_type, target_team_id, target_player_id, target_label, amount, platform_fee_pct, platform_fee_amount, net_to_team_amount)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING `+columns,
		accountID, targetType, teamCol, playerCol, label, amount, PlatformFeePct, feeAmount, net,
	)
	return scan(row)
}

func (r *Repository) ListMine(ctx context.Context, accountID uuid.UUID) ([]Sponsorship, error) {
	rows, err := r.pool.Query(ctx, `SELECT `+columns+` FROM sponsorships WHERE account_id = $1 ORDER BY created_at DESC`, accountID)
	if err != nil {
		return nil, fmt.Errorf("list my sponsorships: %w", err)
	}
	defer rows.Close()

	out := []Sponsorship{}
	for rows.Next() {
		s, err := scan(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *s)
	}
	return out, rows.Err()
}

func (r *Repository) GetByID(ctx context.Context, id uuid.UUID) (*Sponsorship, error) {
	row := r.pool.QueryRow(ctx, `SELECT `+columns+` FROM sponsorships WHERE id = $1`, id)
	s, err := scan(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get sponsorship: %w", err)
	}
	return s, nil
}
