package accounts

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/JosephNjorog/PitchLine/backend/internal/authn"
)

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

const selectColumns = `id, name, email, phone, google_sub, role, onboarding_complete, confirmation_sms_sent_at, created_at`

func scanAccount(row pgx.Row) (*Account, error) {
	var a Account
	var id uuid.UUID
	if err := row.Scan(&id, &a.Name, &a.Email, &a.Phone, &a.GoogleSub, &a.Role, &a.OnboardingComplete, &a.ConfirmationSMSSentAt, &a.CreatedAt); err != nil {
		return nil, err
	}
	a.ID = id.String()
	return &a, nil
}

func (r *Repository) GetByID(ctx context.Context, id uuid.UUID) (*Account, error) {
	row := r.pool.QueryRow(ctx, `SELECT `+selectColumns+` FROM accounts WHERE id = $1`, id)
	acc, err := scanAccount(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get account by id: %w", err)
	}
	return acc, nil
}

// GetOrCreateByGoogleSub finds the account for a verified Google identity, or
// creates one (role=NULL, onboardingComplete=false) if this is a first-time
// sign-in. Returns the account and whether it was newly created.
func (r *Repository) GetOrCreateByGoogleSub(ctx context.Context, sub, email, name string) (*Account, bool, error) {
	row := r.pool.QueryRow(ctx, `SELECT `+selectColumns+` FROM accounts WHERE google_sub = $1`, sub)
	acc, err := scanAccount(row)
	if err == nil {
		return acc, false, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, false, fmt.Errorf("lookup by google_sub: %w", err)
	}

	if name == "" {
		name = "PitchLine Fan"
	}
	var emailPtr *string
	if email != "" {
		emailPtr = &email
	}

	row = r.pool.QueryRow(ctx,
		`INSERT INTO accounts (name, email, google_sub) VALUES ($1, $2, $3) RETURNING `+selectColumns,
		name, emailPtr, sub,
	)
	acc, err = scanAccount(row)
	if err != nil {
		return nil, false, fmt.Errorf("create account by google_sub: %w", err)
	}
	return acc, true, nil
}

// GetOrCreateByPhone finds the account for a verified phone number, or
// creates one if this is a first-time sign-in.
func (r *Repository) GetOrCreateByPhone(ctx context.Context, phone string) (*Account, bool, error) {
	row := r.pool.QueryRow(ctx, `SELECT `+selectColumns+` FROM accounts WHERE phone = $1`, phone)
	acc, err := scanAccount(row)
	if err == nil {
		return acc, false, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, false, fmt.Errorf("lookup by phone: %w", err)
	}

	row = r.pool.QueryRow(ctx,
		`INSERT INTO accounts (name, phone) VALUES ($1, $2) RETURNING `+selectColumns,
		"PitchLine Fan", phone,
	)
	acc, err = scanAccount(row)
	if err != nil {
		return nil, false, fmt.Errorf("create account by phone: %w", err)
	}
	return acc, true, nil
}

func (r *Repository) CompleteOnboarding(ctx context.Context, id uuid.UUID, role string) (*Account, error) {
	row := r.pool.QueryRow(ctx,
		`UPDATE accounts SET role = $1, onboarding_complete = true, updated_at = now()
		 WHERE id = $2 RETURNING `+selectColumns,
		role, id,
	)
	acc, err := scanAccount(row)
	if err != nil {
		return nil, fmt.Errorf("complete onboarding: %w", err)
	}
	return acc, nil
}

func (r *Repository) MarkConfirmationSMSSent(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `UPDATE accounts SET confirmation_sms_sent_at = now() WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("mark confirmation sms sent: %w", err)
	}
	return nil
}

// LoadPrincipal implements authn.PrincipalLoader.
func (r *Repository) LoadPrincipal(ctx context.Context, id uuid.UUID) (*authn.Principal, error) {
	acc, err := r.GetByID(ctx, id)
	if err != nil || acc == nil {
		return nil, err
	}
	role := ""
	if acc.Role != nil {
		role = *acc.Role
	}
	return &authn.Principal{ID: id, Role: role, OnboardingComplete: acc.OnboardingComplete}, nil
}
