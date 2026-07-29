package notifications

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

func (r *Repository) ListForAccount(ctx context.Context, accountID uuid.UUID) ([]Notification, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, type, message, read_at, created_at FROM notifications WHERE account_id = $1 ORDER BY created_at DESC`,
		accountID,
	)
	if err != nil {
		return nil, fmt.Errorf("list notifications: %w", err)
	}
	defer rows.Close()

	out := []Notification{}
	for rows.Next() {
		var n Notification
		var id uuid.UUID
		if err := rows.Scan(&id, &n.Type, &n.Message, &n.ReadAt, &n.CreatedAt); err != nil {
			return nil, err
		}
		n.ID = id.String()
		out = append(out, n)
	}
	return out, rows.Err()
}

func (r *Repository) MarkAllRead(ctx context.Context, accountID uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `UPDATE notifications SET read_at = now() WHERE account_id = $1 AND read_at IS NULL`, accountID)
	if err != nil {
		return fmt.Errorf("mark all read: %w", err)
	}
	return nil
}

// FanoutToAccounts inserts one notification row per account, inside the
// caller's transaction, so it lands atomically with whatever event
// triggered it (a result posted, a fixture scheduled, etc).
func FanoutToAccounts(ctx context.Context, tx pgx.Tx, accountIDs []uuid.UUID, kind, message string) error {
	for _, id := range accountIDs {
		if _, err := tx.Exec(ctx, `INSERT INTO notifications (account_id, type, message) VALUES ($1,$2,$3)`, id, kind, message); err != nil {
			return fmt.Errorf("fanout notification to %s: %w", id, err)
		}
	}
	return nil
}
