package athletes

import (
	"context"
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

func scanAthlete(row pgx.Row) (*Athlete, error) {
	var a Athlete
	var id, teamID uuid.UUID
	if err := row.Scan(&id, &a.Name, &teamID, &a.Position, &a.AgeGroup); err != nil {
		return nil, err
	}
	a.ID = id.String()
	a.TeamID = teamID.String()
	return &a, nil
}

func (r *Repository) Search(ctx context.Context, query, county, sport, position, ageGroup string) ([]Athlete, error) {
	sql := `SELECT a.id, a.name, a.team_id, a.position, a.age_group
		FROM athletes a JOIN teams t ON t.id = a.team_id
		WHERE ($1 = '' OR a.name ILIKE '%'||$1||'%' OR t.name ILIKE '%'||$1||'%')
		AND ($2 = '' OR t.county = $2)
		AND ($3 = '' OR t.sport = $3)
		AND ($4 = '' OR a.position = $4)
		AND ($5 = '' OR a.age_group = $5)
		ORDER BY a.name`
	rows, err := r.pool.Query(ctx, sql, query, county, sport, position, ageGroup)
	if err != nil {
		return nil, fmt.Errorf("search athletes: %w", err)
	}
	defer rows.Close()

	out := []Athlete{}
	for rows.Next() {
		a, err := scanAthlete(rows)
		if err != nil {
			return nil, fmt.Errorf("scan athlete: %w", err)
		}
		out = append(out, *a)
	}
	return out, rows.Err()
}

func (r *Repository) Positions(ctx context.Context) ([]string, error) {
	rows, err := r.pool.Query(ctx, `SELECT DISTINCT position FROM athletes ORDER BY position`)
	if err != nil {
		return nil, fmt.Errorf("list positions: %w", err)
	}
	defer rows.Close()

	out := []string{}
	for rows.Next() {
		var p string
		if err := rows.Scan(&p); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}
