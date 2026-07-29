package social

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PollsRepository struct {
	pool *pgxpool.Pool
}

func NewPollsRepository(pool *pgxpool.Pool) *PollsRepository {
	return &PollsRepository{pool: pool}
}

func (r *PollsRepository) GetForFixture(ctx context.Context, fixtureID uuid.UUID) (*Poll, error) {
	var p Poll
	var id, fID uuid.UUID
	err := r.pool.QueryRow(ctx,
		`SELECT id, fixture_id, question, options FROM match_polls WHERE fixture_id = $1`,
		fixtureID,
	).Scan(&id, &fID, &p.Question, &p.Options)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get poll: %w", err)
	}
	p.ID = id.String()
	p.FixtureID = fID.String()

	votes, err := r.votesFor(ctx, id)
	if err != nil {
		return nil, err
	}
	p.Votes = votes
	return &p, nil
}

func (r *PollsRepository) votesFor(ctx context.Context, pollID uuid.UUID) (map[string]int, error) {
	rows, err := r.pool.Query(ctx, `SELECT option_label, COUNT(*) FROM poll_votes WHERE poll_id = $1 GROUP BY option_label`, pollID)
	if err != nil {
		return nil, fmt.Errorf("aggregate poll votes: %w", err)
	}
	defer rows.Close()

	out := map[string]int{}
	for rows.Next() {
		var label string
		var count int
		if err := rows.Scan(&label, &count); err != nil {
			return nil, err
		}
		out[label] = count
	}
	return out, rows.Err()
}

func (r *PollsRepository) Vote(ctx context.Context, pollID, accountID uuid.UUID, optionLabel string) error {
	var validOptions []string
	if err := r.pool.QueryRow(ctx, `SELECT options FROM match_polls WHERE id = $1`, pollID).Scan(&validOptions); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return fmt.Errorf("poll not found")
		}
		return fmt.Errorf("lookup poll options: %w", err)
	}
	valid := false
	for _, opt := range validOptions {
		if opt == optionLabel {
			valid = true
			break
		}
	}
	if !valid {
		return fmt.Errorf("invalid option")
	}

	_, err := r.pool.Exec(ctx,
		`INSERT INTO poll_votes (poll_id, account_id, option_label) VALUES ($1,$2,$3)
		 ON CONFLICT (poll_id, account_id) DO UPDATE SET option_label = EXCLUDED.option_label`,
		pollID, accountID, optionLabel,
	)
	if err != nil {
		return fmt.Errorf("cast poll vote: %w", err)
	}
	return nil
}
