package fixtures

import (
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/JosephNjorog/PitchLine/backend/internal/authn"
	"github.com/JosephNjorog/PitchLine/backend/internal/httpx"
)

type Deps struct {
	Repo       *Repository
	Pool       *pgxpool.Pool
	Middleware *authn.Middleware
}

func Mount(r chi.Router, d Deps) {
	h := &handler{d: d}

	r.Get("/fixtures", h.list)
	r.Get("/fixtures/{id}", h.getByID)
	r.Get("/fixtures/{id}/result", h.getResult)

	r.Group(func(auth chi.Router) {
		auth.Use(d.Middleware.RequireAuth)
		auth.Post("/results/{id}/motm-vote", h.motmVote)

		auth.Group(func(manage chi.Router) {
			manage.Use(authn.RequireRole("team", "league"))
			manage.Post("/fixtures", h.create)
			manage.Patch("/fixtures/{id}", h.update)
			manage.Post("/fixtures/{id}/result", h.submitResult)
		})
	})
}

type handler struct{ d Deps }

func (h *handler) list(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	teamIDs := []uuid.UUID{}
	if raw := q.Get("teamIds"); raw != "" {
		for _, s := range strings.Split(raw, ",") {
			id, err := uuid.Parse(strings.TrimSpace(s))
			if err != nil {
				httpx.Error(w, http.StatusBadRequest, "invalid_team_id")
				return
			}
			teamIDs = append(teamIDs, id)
		}
	}
	out, err := h.d.Repo.List(r.Context(), teamIDs, q.Get("when"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "list_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, out)
}

func (h *handler) getByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	f, err := h.d.Repo.GetByID(r.Context(), id)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup_failed")
		return
	}
	if f == nil {
		httpx.Error(w, http.StatusNotFound, "fixture_not_found")
		return
	}
	httpx.JSON(w, http.StatusOK, f)
}

type resultBackfill struct {
	HomeScore int `json:"homeScore"`
	AwayScore int `json:"awayScore"`
}

type createFixtureRequest struct {
	HomeTeamID string          `json:"homeTeamId"`
	AwayTeamID string          `json:"awayTeamId"`
	KickoffAt  time.Time       `json:"kickoffAt"`
	Venue      *string         `json:"venue,omitempty"`
	Result     *resultBackfill `json:"result,omitempty"`
}

func (h *handler) create(w http.ResponseWriter, r *http.Request) {
	var req createFixtureRequest
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	homeID, err1 := uuid.Parse(req.HomeTeamID)
	awayID, err2 := uuid.Parse(req.AwayTeamID)
	if err1 != nil || err2 != nil || homeID == awayID {
		httpx.Error(w, http.StatusBadRequest, "invalid_teams")
		return
	}

	principal, _ := authn.FromContext(r.Context())
	allowed, err := CanManage(r.Context(), h.d.Pool, principal, homeID, awayID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "authz_check_failed")
		return
	}
	if !allowed {
		httpx.Error(w, http.StatusForbidden, "forbidden")
		return
	}

	var backfill *BackfillResult
	if req.Result != nil {
		backfill = &BackfillResult{HomeScore: req.Result.HomeScore, AwayScore: req.Result.AwayScore}
	}

	f, err := h.d.Repo.Create(r.Context(), principal.ID, homeID, awayID, req.KickoffAt, req.Venue, backfill)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "create_failed")
		return
	}
	httpx.JSON(w, http.StatusCreated, f)
}

type updateFixtureRequest struct {
	KickoffAt *time.Time `json:"kickoffAt,omitempty"`
	Venue     *string    `json:"venue,omitempty"`
}

func (h *handler) update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}

	home, away, err := h.d.Repo.TeamsForFixture(r.Context(), id)
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "fixture_not_found")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	allowed, err := CanManage(r.Context(), h.d.Pool, principal, home, away)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "authz_check_failed")
		return
	}
	if !allowed {
		httpx.Error(w, http.StatusForbidden, "forbidden")
		return
	}

	var req updateFixtureRequest
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}

	f, err := h.d.Repo.Update(r.Context(), id, req.KickoffAt, req.Venue)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "update_failed")
		return
	}
	if f == nil {
		httpx.Error(w, http.StatusNotFound, "fixture_not_found")
		return
	}
	httpx.JSON(w, http.StatusOK, f)
}

func (h *handler) getResult(w http.ResponseWriter, r *http.Request) {
	fixtureID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	res, err := h.d.Repo.GetResultByFixture(r.Context(), fixtureID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup_failed")
		return
	}
	if res == nil {
		httpx.Error(w, http.StatusNotFound, "result_not_found")
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

type submitResultRequest struct {
	HomeScore    int         `json:"homeScore"`
	AwayScore    int         `json:"awayScore"`
	Scorers      []Scorer    `json:"scorers"`
	Cards        []CardEvent `json:"cards"`
	MotmNominees []string    `json:"motmNominees"`
}

func (h *handler) submitResult(w http.ResponseWriter, r *http.Request) {
	fixtureID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}

	home, away, err := h.d.Repo.TeamsForFixture(r.Context(), fixtureID)
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "fixture_not_found")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	allowed, err := CanManage(r.Context(), h.d.Pool, principal, home, away)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "authz_check_failed")
		return
	}
	if !allowed {
		httpx.Error(w, http.StatusForbidden, "forbidden")
		return
	}

	var req submitResultRequest
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	if req.Scorers == nil {
		req.Scorers = []Scorer{}
	}
	if req.Cards == nil {
		req.Cards = []CardEvent{}
	}
	if req.MotmNominees == nil {
		req.MotmNominees = []string{}
	}

	res, err := h.d.Repo.SubmitResult(r.Context(), fixtureID, SubmitResultInput{
		HomeScore:    req.HomeScore,
		AwayScore:    req.AwayScore,
		Scorers:      req.Scorers,
		Cards:        req.Cards,
		MotmNominees: req.MotmNominees,
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "submit_result_failed")
		return
	}
	httpx.JSON(w, http.StatusCreated, res)
}

type motmVoteRequest struct {
	NomineeName string `json:"nomineeName"`
}

func (h *handler) motmVote(w http.ResponseWriter, r *http.Request) {
	resultID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	var req motmVoteRequest
	if err := httpx.Decode(r, &req); err != nil || req.NomineeName == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.MotmVote(r.Context(), resultID, principal.ID, req.NomineeName); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "vote_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
