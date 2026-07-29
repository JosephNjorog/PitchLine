package shortlist

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

func idList(ctx context.Context, pool *pgxpool.Pool, sql string, accountID uuid.UUID) ([]string, error) {
	rows, err := pool.Query(ctx, sql, accountID)
	if err != nil {
		return nil, fmt.Errorf("shortlist query: %w", err)
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

func (r *Repository) ListTeamIDs(ctx context.Context, accountID uuid.UUID) ([]string, error) {
	return idList(ctx, r.pool, `SELECT team_id FROM shortlisted_teams WHERE account_id = $1`, accountID)
}

func (r *Repository) ListAthleteIDs(ctx context.Context, accountID uuid.UUID) ([]string, error) {
	return idList(ctx, r.pool, `SELECT athlete_id FROM shortlisted_athletes WHERE account_id = $1`, accountID)
}

func (r *Repository) AddTeam(ctx context.Context, accountID, teamID uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `INSERT INTO shortlisted_teams (account_id, team_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, accountID, teamID)
	return err
}

func (r *Repository) RemoveTeam(ctx context.Context, accountID, teamID uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM shortlisted_teams WHERE account_id = $1 AND team_id = $2`, accountID, teamID)
	return err
}

func (r *Repository) AddAthlete(ctx context.Context, accountID, athleteID uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `INSERT INTO shortlisted_athletes (account_id, athlete_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, accountID, athleteID)
	return err
}

func (r *Repository) RemoveAthlete(ctx context.Context, accountID, athleteID uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM shortlisted_athletes WHERE account_id = $1 AND athlete_id = $2`, accountID, athleteID)
	return err
}
