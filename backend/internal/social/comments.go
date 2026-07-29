package social

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CommentsRepository struct {
	pool *pgxpool.Pool
}

func NewCommentsRepository(pool *pgxpool.Pool) *CommentsRepository {
	return &CommentsRepository{pool: pool}
}

func (r *CommentsRepository) ListForFixture(ctx context.Context, fixtureID uuid.UUID) ([]Comment, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, fixture_id, author_name, message, created_at FROM match_comments WHERE fixture_id = $1 ORDER BY created_at ASC`,
		fixtureID,
	)
	if err != nil {
		return nil, fmt.Errorf("list comments: %w", err)
	}
	defer rows.Close()

	out := []Comment{}
	for rows.Next() {
		var c Comment
		var id, fID uuid.UUID
		if err := rows.Scan(&id, &fID, &c.AuthorName, &c.Message, &c.CreatedAt); err != nil {
			return nil, err
		}
		c.ID = id.String()
		c.FixtureID = fID.String()
		out = append(out, c)
	}
	return out, rows.Err()
}

func (r *CommentsRepository) Add(ctx context.Context, fixtureID, accountID uuid.UUID, authorName, message string) (*Comment, error) {
	row := r.pool.QueryRow(ctx,
		`INSERT INTO match_comments (fixture_id, account_id, author_name, message) VALUES ($1,$2,$3,$4)
		 RETURNING id, fixture_id, author_name, message, created_at`,
		fixtureID, accountID, authorName, message,
	)
	var c Comment
	var id, fID uuid.UUID
	if err := row.Scan(&id, &fID, &c.AuthorName, &c.Message, &c.CreatedAt); err != nil {
		return nil, fmt.Errorf("add comment: %w", err)
	}
	c.ID = id.String()
	c.FixtureID = fID.String()
	return &c, nil
}
