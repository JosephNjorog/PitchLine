package predictions

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

	r.Get("/prediction-rounds/open", h.open)
	r.Get("/prediction-rounds/settled", h.settled)
	r.Get("/prediction-rounds/{id}", h.getByID)
	r.Get("/fixtures/{id}/prediction-round", h.openForFixture)
	r.Get("/leaderboard", h.leaderboard)

	r.Group(func(auth chi.Router) {
		auth.Use(d.Middleware.RequireAuth)
		auth.Post("/prediction-rounds/{id}/entries", h.createEntry)
		auth.Get("/me/prediction-entries", h.myEntries)
	})
}

type handler struct{ d Deps }

func (h *handler) open(w http.ResponseWriter, r *http.Request) {
	out, err := h.d.Repo.Open(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "list_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, out)
}

func (h *handler) settled(w http.ResponseWriter, r *http.Request) {
	out, err := h.d.Repo.Settled(r.Context())
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
	rnd, err := h.d.Repo.GetByID(r.Context(), id)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup_failed")
		return
	}
	if rnd == nil {
		httpx.Error(w, http.StatusNotFound, "round_not_found")
		return
	}
	httpx.JSON(w, http.StatusOK, rnd)
}

func (h *handler) openForFixture(w http.ResponseWriter, r *http.Request) {
	fixtureID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	rnd, err := h.d.Repo.GetOpenForFixture(r.Context(), fixtureID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup_failed")
		return
	}
	if rnd == nil {
		httpx.Error(w, http.StatusNotFound, "round_not_found")
		return
	}
	httpx.JSON(w, http.StatusOK, rnd)
}

func (h *handler) leaderboard(w http.ResponseWriter, r *http.Request) {
	out, err := h.d.Repo.Leaderboard(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "leaderboard_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, out)
}

type createEntryRequest struct {
	PredictedHomeScore int `json:"predictedHomeScore"`
	PredictedAwayScore int `json:"predictedAwayScore"`
}

func (h *handler) createEntry(w http.ResponseWriter, r *http.Request) {
	roundID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	var req createEntryRequest
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	e, err := h.d.Repo.CreateEntry(r.Context(), roundID, principal.ID, req.PredictedHomeScore, req.PredictedAwayScore)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "create_entry_failed")
		return
	}
	httpx.JSON(w, http.StatusCreated, e)
}

func (h *handler) myEntries(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	out, err := h.d.Repo.ListMyEntries(r.Context(), principal.ID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "list_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, out)
}
