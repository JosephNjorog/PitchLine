package predictions

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

const roundColumns = `id, fixture_id, status, closes_at, points_for_exact_score, points_for_correct_outcome`

func scanRound(row pgx.Row) (*Round, error) {
	var rnd Round
	var id, fixtureID uuid.UUID
	if err := row.Scan(&id, &fixtureID, &rnd.Status, &rnd.ClosesAt, &rnd.PointsForExactScore, &rnd.PointsForCorrectOutcome); err != nil {
		return nil, err
	}
	rnd.ID = id.String()
	rnd.FixtureID = fixtureID.String()
	return &rnd, nil
}

func (r *Repository) listByStatus(ctx context.Context, status string) ([]Round, error) {
	rows, err := r.pool.Query(ctx, `SELECT `+roundColumns+` FROM prediction_rounds WHERE status = $1 ORDER BY closes_at`, status)
	if err != nil {
		return nil, fmt.Errorf("list %s rounds: %w", status, err)
	}
	defer rows.Close()

	out := []Round{}
	for rows.Next() {
		rnd, err := scanRound(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *rnd)
	}
	return out, rows.Err()
}

func (r *Repository) Open(ctx context.Context) ([]Round, error) { return r.listByStatus(ctx, "open") }
func (r *Repository) Settled(ctx context.Context) ([]Round, error) {
	return r.listByStatus(ctx, "settled")
}

func (r *Repository) GetByID(ctx context.Context, id uuid.UUID) (*Round, error) {
	row := r.pool.QueryRow(ctx, `SELECT `+roundColumns+` FROM prediction_rounds WHERE id = $1`, id)
	rnd, err := scanRound(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get round: %w", err)
	}
	return rnd, nil
}

func (r *Repository) GetOpenForFixture(ctx context.Context, fixtureID uuid.UUID) (*Round, error) {
	row := r.pool.QueryRow(ctx, `SELECT `+roundColumns+` FROM prediction_rounds WHERE fixture_id = $1 AND status = 'open'`, fixtureID)
	rnd, err := scanRound(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get open round for fixture: %w", err)
	}
	return rnd, nil
}

func scanEntry(row pgx.Row) (*Entry, error) {
	var e Entry
	var id, roundID, accountID uuid.UUID
	if err := row.Scan(&id, &roundID, &accountID, &e.PredictedHomeScore, &e.PredictedAwayScore, &e.PointsAwarded, &e.SubmittedAt); err != nil {
		return nil, err
	}
	e.ID = id.String()
	e.RoundID = roundID.String()
	e.AccountID = accountID.String()
	return &e, nil
}

// CreateEntry upserts: resubmitting a prediction before the round closes
// replaces the previous entry rather than erroring.
func (r *Repository) CreateEntry(ctx context.Context, roundID, accountID uuid.UUID, homeScore, awayScore int) (*Entry, error) {
	row := r.pool.QueryRow(ctx,
		`INSERT INTO prediction_entries (round_id, account_id, predicted_home_score, predicted_away_score)
		 VALUES ($1,$2,$3,$4)
		 ON CONFLICT (round_id, account_id) DO UPDATE SET
			predicted_home_score = EXCLUDED.predicted_home_score,
			predicted_away_score = EXCLUDED.predicted_away_score,
			submitted_at = now()
		 RETURNING id, round_id, account_id, predicted_home_score, predicted_away_score, points_awarded, submitted_at`,
		roundID, accountID, homeScore, awayScore,
	)
	return scanEntry(row)
}

func (r *Repository) ListMyEntries(ctx context.Context, accountID uuid.UUID) ([]Entry, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, round_id, account_id, predicted_home_score, predicted_away_score, points_awarded, submitted_at
		 FROM prediction_entries WHERE account_id = $1 ORDER BY submitted_at DESC`,
		accountID,
	)
	if err != nil {
		return nil, fmt.Errorf("list my entries: %w", err)
	}
	defer rows.Close()

	out := []Entry{}
	for rows.Next() {
		e, err := scanEntry(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *e)
	}
	return out, rows.Err()
}

func (r *Repository) Leaderboard(ctx context.Context) ([]LeaderboardEntry, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT a.id, a.name, COALESCE(SUM(pe.points_awarded), 0) AS points,
			RANK() OVER (ORDER BY COALESCE(SUM(pe.points_awarded), 0) DESC) AS rnk
		 FROM accounts a
		 JOIN prediction_entries pe ON pe.account_id = a.id
		 WHERE pe.points_awarded IS NOT NULL
		 GROUP BY a.id, a.name
		 ORDER BY points DESC, a.name
		 LIMIT 50`,
	)
	if err != nil {
		return nil, fmt.Errorf("leaderboard: %w", err)
	}
	defer rows.Close()

	out := []LeaderboardEntry{}
	for rows.Next() {
		var e LeaderboardEntry
		var id uuid.UUID
		if err := rows.Scan(&id, &e.DisplayName, &e.Points, &e.Rank); err != nil {
			return nil, err
		}
		e.AccountID = id.String()
		out = append(out, e)
	}
	return out, rows.Err()
}
