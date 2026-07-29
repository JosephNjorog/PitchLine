package authn

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type OTPRepo struct {
	pool *pgxpool.Pool
}

func NewOTPRepo(pool *pgxpool.Pool) *OTPRepo {
	return &OTPRepo{pool: pool}
}

func generateCode() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1_000_000))
	if err != nil {
		return "", fmt.Errorf("generating otp: %w", err)
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

// Request invalidates any still-unconsumed codes previously issued for phone
// (so only the most recently requested code can ever be verified), then
// generates and stores a new OTP expiring after ttl.
func (r *OTPRepo) Request(ctx context.Context, phone string, ttl time.Duration) (code string, expiresAt time.Time, err error) {
	code, err = generateCode()
	if err != nil {
		return "", time.Time{}, err
	}
	expiresAt = time.Now().Add(ttl)

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return "", time.Time{}, fmt.Errorf("starting otp request tx: %w", err)
	}
	defer tx.Rollback(ctx)

	if _, err = tx.Exec(ctx,
		`UPDATE otp_codes SET consumed_at = now() WHERE phone = $1 AND consumed_at IS NULL`,
		phone,
	); err != nil {
		return "", time.Time{}, fmt.Errorf("invalidating previous otps: %w", err)
	}

	if _, err = tx.Exec(ctx,
		`INSERT INTO otp_codes (phone, code, expires_at) VALUES ($1, $2, $3)`,
		phone, code, expiresAt,
	); err != nil {
		return "", time.Time{}, fmt.Errorf("storing otp: %w", err)
	}

	if err = tx.Commit(ctx); err != nil {
		return "", time.Time{}, fmt.Errorf("committing otp request: %w", err)
	}
	return code, expiresAt, nil
}

// Verify checks code against the most recent unconsumed, unexpired OTP for
// phone, and marks it consumed on success.
func (r *OTPRepo) Verify(ctx context.Context, phone, code string) (bool, error) {
	var id string
	err := r.pool.QueryRow(ctx,
		`SELECT id FROM otp_codes
		 WHERE phone = $1 AND code = $2 AND consumed_at IS NULL AND expires_at > now()
		 ORDER BY created_at DESC LIMIT 1`,
		phone, code,
	).Scan(&id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return false, nil
		}
		return false, fmt.Errorf("looking up otp: %w", err)
	}

	_, err = r.pool.Exec(ctx, `UPDATE otp_codes SET consumed_at = now() WHERE id = $1`, id)
	if err != nil {
		return false, fmt.Errorf("consuming otp: %w", err)
	}
	return true, nil
}
