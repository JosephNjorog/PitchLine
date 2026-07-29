package orgs

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/JosephNjorog/PitchLine/backend/internal/authn"
	"github.com/JosephNjorog/PitchLine/backend/internal/httpx"
)

type Deps struct {
	Repo       *Repository
	Middleware *authn.Middleware
}

func Mount(r chi.Router, d Deps) {
	h := &handler{d: d}
	r.Group(func(auth chi.Router) {
		auth.Use(d.Middleware.RequireAuth)
		auth.Get("/orgs/me", h.mine)

		auth.Group(func(inst chi.Router) {
			inst.Use(authn.RequireRole("scout", "league"))
			inst.Post("/orgs", h.create)
			inst.Patch("/orgs/me/jurisdiction", h.setJurisdiction)
			inst.Post("/orgs/me/trial/start", h.startTrial)
			inst.Post("/orgs/me/subscription/activate", h.activateSubscription)
		})
	})
}

type handler struct{ d Deps }

type createRequest struct {
	Name        string   `json:"name"`
	Kind        string   `json:"kind"`
	FocusSports []string `json:"focusSports"`
	Region      string   `json:"region"`
}

func (h *handler) create(w http.ResponseWriter, r *http.Request) {
	var req createRequest
	if err := httpx.Decode(r, &req); err != nil || req.Name == "" || (req.Kind != "scout" && req.Kind != "league") {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	o, err := h.d.Repo.Create(r.Context(), principal.ID, req.Name, req.Kind, req.FocusSports, req.Region)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "create_failed")
		return
	}
	httpx.JSON(w, http.StatusCreated, o)
}

func (h *handler) mine(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	o, err := h.d.Repo.GetByOwner(r.Context(), principal.ID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup_failed")
		return
	}
	if o == nil {
		httpx.Error(w, http.StatusNotFound, "no_org")
		return
	}
	httpx.JSON(w, http.StatusOK, o)
}

type jurisdictionRequest struct {
	TeamIDs []string `json:"teamIds"`
}

func (h *handler) setJurisdiction(w http.ResponseWriter, r *http.Request) {
	var req jurisdictionRequest
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	ids := make([]uuid.UUID, 0, len(req.TeamIDs))
	for _, s := range req.TeamIDs {
		id, err := uuid.Parse(s)
		if err != nil {
			httpx.Error(w, http.StatusBadRequest, "invalid_team_id")
			return
		}
		ids = append(ids, id)
	}

	principal, _ := authn.FromContext(r.Context())
	org, err := h.d.Repo.GetByOwner(r.Context(), principal.ID)
	if err != nil || org == nil {
		httpx.Error(w, http.StatusNotFound, "no_org")
		return
	}
	if err := h.d.Repo.SetJurisdiction(r.Context(), uuid.MustParse(org.ID), ids); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "set_jurisdiction_failed")
		return
	}
	org.JurisdictionTeamIDs = req.TeamIDs
	httpx.JSON(w, http.StatusOK, org)
}

func (h *handler) startTrial(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.SetSubscriptionStatus(r.Context(), principal.ID, "trial"); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "start_trial_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *handler) activateSubscription(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.SetSubscriptionStatus(r.Context(), principal.ID, "active"); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "activate_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
