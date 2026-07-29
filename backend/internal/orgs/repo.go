package orgs

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

func (r *Repository) withJurisdiction(ctx context.Context, o *Org, id uuid.UUID) (*Org, error) {
	rows, err := r.pool.Query(ctx, `SELECT team_id FROM org_jurisdiction_teams WHERE org_id = $1`, id)
	if err != nil {
		return nil, fmt.Errorf("list jurisdiction teams: %w", err)
	}
	defer rows.Close()

	o.JurisdictionTeamIDs = []string{}
	for rows.Next() {
		var teamID uuid.UUID
		if err := rows.Scan(&teamID); err != nil {
			return nil, err
		}
		o.JurisdictionTeamIDs = append(o.JurisdictionTeamIDs, teamID.String())
	}
	return o, rows.Err()
}

func (r *Repository) Create(ctx context.Context, ownerAccountID uuid.UUID, name, kind string, focusSports []string, region string) (*Org, error) {
	var o Org
	var id uuid.UUID
	err := r.pool.QueryRow(ctx,
		`INSERT INTO orgs (owner_account_id, name, kind, focus_sports, region) VALUES ($1,$2,$3,$4,$5)
		 RETURNING id, name, kind, focus_sports, region, subscription_status`,
		ownerAccountID, name, kind, focusSports, region,
	).Scan(&id, &o.Name, &o.Kind, &o.FocusSports, &o.Region, &o.SubscriptionStatus)
	if err != nil {
		return nil, fmt.Errorf("create org: %w", err)
	}
	o.ID = id.String()
	return r.withJurisdiction(ctx, &o, id)
}

func (r *Repository) GetByOwner(ctx context.Context, ownerAccountID uuid.UUID) (*Org, error) {
	var o Org
	var id uuid.UUID
	err := r.pool.QueryRow(ctx,
		`SELECT id, name, kind, focus_sports, region, subscription_status FROM orgs WHERE owner_account_id = $1`,
		ownerAccountID,
	).Scan(&id, &o.Name, &o.Kind, &o.FocusSports, &o.Region, &o.SubscriptionStatus)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get org by owner: %w", err)
	}
	o.ID = id.String()
	return r.withJurisdiction(ctx, &o, id)
}

func (r *Repository) SetJurisdiction(ctx context.Context, orgID uuid.UUID, teamIDs []uuid.UUID) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin jurisdiction tx: %w", err)
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, `DELETE FROM org_jurisdiction_teams WHERE org_id = $1`, orgID); err != nil {
		return fmt.Errorf("clear jurisdiction: %w", err)
	}
	for _, teamID := range teamIDs {
		if _, err := tx.Exec(ctx, `INSERT INTO org_jurisdiction_teams (org_id, team_id) VALUES ($1,$2)`, orgID, teamID); err != nil {
			return fmt.Errorf("insert jurisdiction team: %w", err)
		}
	}
	return tx.Commit(ctx)
}

func (r *Repository) SetSubscriptionStatus(ctx context.Context, ownerAccountID uuid.UUID, status string) error {
	tag, err := r.pool.Exec(ctx, `UPDATE orgs SET subscription_status = $1, updated_at = now() WHERE owner_account_id = $2`, status, ownerAccountID)
	if err != nil {
		return fmt.Errorf("set subscription status: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return fmt.Errorf("no org for this account")
	}
	return nil
}
