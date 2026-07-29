package fixtures

import (
	"context"
	"errors"
	"fmt"
	"time"

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

const fixtureColumns = `id, home_team_id, away_team_id, kickoff_at, status, venue`

func scanFixture(row pgx.Row) (*Fixture, error) {
	var f Fixture
	var id, home, away uuid.UUID
	if err := row.Scan(&id, &home, &away, &f.KickoffAt, &f.Status, &f.Venue); err != nil {
		return nil, err
	}
	f.ID = id.String()
	f.HomeTeamID = home.String()
	f.AwayTeamID = away.String()
	return &f, nil
}

// List returns fixtures optionally filtered by team membership and/or a
// when=upcoming|completed bucket (mirrors getFixturesForTeams /
// getUpcomingFixtures / getCompletedFixtures from the old mock-data module).
func (r *Repository) List(ctx context.Context, teamIDs []uuid.UUID, when string) ([]Fixture, error) {
	sql := `SELECT ` + fixtureColumns + ` FROM fixtures WHERE
		(cardinality($1::uuid[]) = 0 OR home_team_id = ANY($1) OR away_team_id = ANY($1))
		AND (
			$2 = '' OR
			($2 = 'upcoming' AND status = 'scheduled') OR
			($2 = 'completed' AND status IN ('completed','live'))
		)
		ORDER BY kickoff_at`
	rows, err := r.pool.Query(ctx, sql, teamIDs, when)
	if err != nil {
		return nil, fmt.Errorf("list fixtures: %w", err)
	}
	defer rows.Close()

	out := []Fixture{}
	for rows.Next() {
		f, err := scanFixture(rows)
		if err != nil {
			return nil, fmt.Errorf("scan fixture: %w", err)
		}
		out = append(out, *f)
	}
	return out, rows.Err()
}

func (r *Repository) GetByID(ctx context.Context, id uuid.UUID) (*Fixture, error) {
	row := r.pool.QueryRow(ctx, `SELECT `+fixtureColumns+` FROM fixtures WHERE id = $1`, id)
	f, err := scanFixture(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get fixture: %w", err)
	}
	return f, nil
}

type BackfillResult struct {
	HomeScore int
	AwayScore int
}

// Create inserts a fixture; if backfill is non-nil the fixture is created
// status='completed' with a matching results row, in one transaction —
// this is the mock AdminFixturesContext.scheduleFixture's playedScore path.
func (r *Repository) Create(ctx context.Context, createdBy, homeTeamID, awayTeamID uuid.UUID, kickoffAt time.Time, venue *string, backfill *BackfillResult) (*Fixture, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin create fixture tx: %w", err)
	}
	defer tx.Rollback(ctx)

	status := "scheduled"
	if backfill != nil {
		status = "completed"
	}

	row := tx.QueryRow(ctx,
		`INSERT INTO fixtures (home_team_id, away_team_id, kickoff_at, status, venue, created_by_account_id)
		 VALUES ($1,$2,$3,$4,$5,$6) RETURNING `+fixtureColumns,
		homeTeamID, awayTeamID, kickoffAt, status, venue, createdBy,
	)
	f, err := scanFixture(row)
	if err != nil {
		return nil, fmt.Errorf("insert fixture: %w", err)
	}

	if backfill != nil {
		if _, err := tx.Exec(ctx,
			`INSERT INTO results (fixture_id, home_score, away_score) VALUES ($1,$2,$3)`,
			f.ID, backfill.HomeScore, backfill.AwayScore,
		); err != nil {
			return nil, fmt.Errorf("insert backfilled result: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit create fixture: %w", err)
	}
	return f, nil
}

func (r *Repository) Update(ctx context.Context, id uuid.UUID, kickoffAt *time.Time, venue *string) (*Fixture, error) {
	row := r.pool.QueryRow(ctx,
		`UPDATE fixtures SET
			kickoff_at = COALESCE($1, kickoff_at),
			venue = COALESCE($2, venue),
			updated_at = now()
		 WHERE id = $3 RETURNING `+fixtureColumns,
		kickoffAt, venue, id,
	)
	f, err := scanFixture(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("update fixture: %w", err)
	}
	return f, nil
}

// TeamsForFixture returns the home/away team ids, used by authz checks.
func (r *Repository) TeamsForFixture(ctx context.Context, fixtureID uuid.UUID) (home, away uuid.UUID, err error) {
	err = r.pool.QueryRow(ctx, `SELECT home_team_id, away_team_id FROM fixtures WHERE id = $1`, fixtureID).Scan(&home, &away)
	if err != nil {
		return uuid.UUID{}, uuid.UUID{}, fmt.Errorf("lookup fixture teams: %w", err)
	}
	return home, away, nil
}

func (r *Repository) GetResultByFixture(ctx context.Context, fixtureID uuid.UUID) (*Result, error) {
	var res Result
	var id uuid.UUID
	var fID uuid.UUID
	err := r.pool.QueryRow(ctx,
		`SELECT id, fixture_id, home_score, away_score, motm_nominees FROM results WHERE fixture_id = $1`,
		fixtureID,
	).Scan(&id, &fID, &res.HomeScore, &res.AwayScore, &res.MotmNominees)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get result: %w", err)
	}
	res.ID = id.String()
	res.FixtureID = fID.String()

	res.Scorers, err = r.scorersFor(ctx, id)
	if err != nil {
		return nil, err
	}
	res.Cards, err = r.cardsFor(ctx, id)
	if err != nil {
		return nil, err
	}
	res.MotmVotes, err = r.motmVotesFor(ctx, id)
	if err != nil {
		return nil, err
	}
	if res.MotmNominees == nil {
		res.MotmNominees = []string{}
	}
	return &res, nil
}

func (r *Repository) scorersFor(ctx context.Context, resultID uuid.UUID) ([]Scorer, error) {
	rows, err := r.pool.Query(ctx, `SELECT team_id, player_name, minute FROM result_scorers WHERE result_id = $1`, resultID)
	if err != nil {
		return nil, fmt.Errorf("list scorers: %w", err)
	}
	defer rows.Close()

	out := []Scorer{}
	for rows.Next() {
		var s Scorer
		var teamID uuid.UUID
		if err := rows.Scan(&teamID, &s.PlayerName, &s.Minute); err != nil {
			return nil, err
		}
		s.TeamID = teamID.String()
		out = append(out, s)
	}
	return out, rows.Err()
}

func (r *Repository) cardsFor(ctx context.Context, resultID uuid.UUID) ([]CardEvent, error) {
	rows, err := r.pool.Query(ctx, `SELECT team_id, player_name, type, minute FROM result_cards WHERE result_id = $1`, resultID)
	if err != nil {
		return nil, fmt.Errorf("list cards: %w", err)
	}
	defer rows.Close()

	out := []CardEvent{}
	for rows.Next() {
		var c CardEvent
		var teamID uuid.UUID
		if err := rows.Scan(&teamID, &c.PlayerName, &c.Type, &c.Minute); err != nil {
			return nil, err
		}
		c.TeamID = teamID.String()
		out = append(out, c)
	}
	return out, rows.Err()
}

func (r *Repository) motmVotesFor(ctx context.Context, resultID uuid.UUID) (map[string]int, error) {
	rows, err := r.pool.Query(ctx, `SELECT nominee_name, COUNT(*) FROM motm_votes WHERE result_id = $1 GROUP BY nominee_name`, resultID)
	if err != nil {
		return nil, fmt.Errorf("aggregate motm votes: %w", err)
	}
	defer rows.Close()

	out := map[string]int{}
	for rows.Next() {
		var name string
		var count int
		if err := rows.Scan(&name, &count); err != nil {
			return nil, err
		}
		out[name] = count
	}
	return out, rows.Err()
}

type SubmitResultInput struct {
	HomeScore    int
	AwayScore    int
	Scorers      []Scorer
	Cards        []CardEvent
	MotmNominees []string
}

func (r *Repository) SubmitResult(ctx context.Context, fixtureID uuid.UUID, in SubmitResultInput) (*Result, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin submit result tx: %w", err)
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, `UPDATE fixtures SET status = 'completed', updated_at = now() WHERE id = $1`, fixtureID); err != nil {
		return nil, fmt.Errorf("mark fixture completed: %w", err)
	}

	var resultID uuid.UUID
	err = tx.QueryRow(ctx,
		`INSERT INTO results (fixture_id, home_score, away_score, motm_nominees) VALUES ($1,$2,$3,$4) RETURNING id`,
		fixtureID, in.HomeScore, in.AwayScore, in.MotmNominees,
	).Scan(&resultID)
	if err != nil {
		return nil, fmt.Errorf("insert result: %w", err)
	}

	for _, s := range in.Scorers {
		teamID, perr := uuid.Parse(s.TeamID)
		if perr != nil {
			return nil, fmt.Errorf("invalid scorer team id: %w", perr)
		}
		if _, err := tx.Exec(ctx,
			`INSERT INTO result_scorers (result_id, team_id, player_name, minute) VALUES ($1,$2,$3,$4)`,
			resultID, teamID, s.PlayerName, s.Minute,
		); err != nil {
			return nil, fmt.Errorf("insert scorer: %w", err)
		}
	}

	for _, c := range in.Cards {
		teamID, perr := uuid.Parse(c.TeamID)
		if perr != nil {
			return nil, fmt.Errorf("invalid card team id: %w", perr)
		}
		if _, err := tx.Exec(ctx,
			`INSERT INTO result_cards (result_id, team_id, player_name, type, minute) VALUES ($1,$2,$3,$4,$5)`,
			resultID, teamID, c.PlayerName, c.Type, c.Minute,
		); err != nil {
			return nil, fmt.Errorf("insert card: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit submit result: %w", err)
	}

	return r.GetResultByFixture(ctx, fixtureID)
}

func (r *Repository) MotmVote(ctx context.Context, resultID, accountID uuid.UUID, nomineeName string) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO motm_votes (result_id, account_id, nominee_name) VALUES ($1,$2,$3)
		 ON CONFLICT (result_id, account_id) DO UPDATE SET nominee_name = EXCLUDED.nominee_name`,
		resultID, accountID, nomineeName,
	)
	if err != nil {
		return fmt.Errorf("cast motm vote: %w", err)
	}
	return nil
}
