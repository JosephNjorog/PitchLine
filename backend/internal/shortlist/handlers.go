package shortlist

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
		auth.Get("/shortlist", h.list)
		auth.Post("/shortlist/teams/{id}", h.addTeam)
		auth.Delete("/shortlist/teams/{id}", h.removeTeam)
		auth.Post("/shortlist/athletes/{id}", h.addAthlete)
		auth.Delete("/shortlist/athletes/{id}", h.removeAthlete)
	})
}

type handler struct{ d Deps }

func (h *handler) list(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	teamIDs, err := h.d.Repo.ListTeamIDs(r.Context(), principal.ID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "list_failed")
		return
	}
	athleteIDs, err := h.d.Repo.ListAthleteIDs(r.Context(), principal.ID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "list_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{
		"teamIds":    teamIDs,
		"athleteIds": athleteIDs,
	})
}

func (h *handler) addTeam(w http.ResponseWriter, r *http.Request) {
	teamID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.AddTeam(r.Context(), principal.ID, teamID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "add_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *handler) removeTeam(w http.ResponseWriter, r *http.Request) {
	teamID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.RemoveTeam(r.Context(), principal.ID, teamID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "remove_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *handler) addAthlete(w http.ResponseWriter, r *http.Request) {
	athleteID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.AddAthlete(r.Context(), principal.ID, athleteID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "add_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *handler) removeAthlete(w http.ResponseWriter, r *http.Request) {
	athleteID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.RemoveAthlete(r.Context(), principal.ID, athleteID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "remove_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
