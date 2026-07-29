package fixtures

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/JosephNjorog/PitchLine/backend/internal/authn"
)

// CanManage reports whether principal may create/edit a fixture or submit a
// result involving homeTeamID/awayTeamID: a team rep must own one of the two
// teams; a scout/league admin must have one of the two teams in their org's
// jurisdiction. This is the single authorization rule behind the unified
// fixtures/results tables replacing the old separate TeamOpsContext vs
// AdminFixturesContext split.
func CanManage(ctx context.Context, pool *pgxpool.Pool, principal *authn.Principal, homeTeamID, awayTeamID uuid.UUID) (bool, error) {
	switch principal.Role {
	case "team":
		var ok bool
		err := pool.QueryRow(ctx,
			`SELECT EXISTS(SELECT 1 FROM teams WHERE owner_account_id = $1 AND id IN ($2, $3))`,
			principal.ID, homeTeamID, awayTeamID,
		).Scan(&ok)
		if err != nil {
			return false, fmt.Errorf("check team ownership: %w", err)
		}
		return ok, nil
	case "league":
		var ok bool
		err := pool.QueryRow(ctx,
			`SELECT EXISTS(
				SELECT 1 FROM org_jurisdiction_teams ojt
				JOIN orgs o ON o.id = ojt.org_id
				WHERE o.owner_account_id = $1 AND ojt.team_id IN ($2, $3)
			)`,
			principal.ID, homeTeamID, awayTeamID,
		).Scan(&ok)
		if err != nil {
			return false, fmt.Errorf("check org jurisdiction: %w", err)
		}
		return ok, nil
	default:
		return false, nil
	}
}
