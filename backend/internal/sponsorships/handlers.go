package sponsorships

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
		auth.Post("/sponsorships", h.create)
		auth.Get("/me/sponsorships", h.mine)
		auth.Get("/sponsorships/{id}", h.getByID)
	})
}

type handler struct{ d Deps }

type createRequest struct {
	TargetType string  `json:"targetType"`
	TargetID   string  `json:"targetId"`
	Amount     float64 `json:"amount"`
}

func (h *handler) create(w http.ResponseWriter, r *http.Request) {
	var req createRequest
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	if req.TargetType != "team" && req.TargetType != "player" {
		httpx.Error(w, http.StatusBadRequest, "invalid_target_type")
		return
	}
	if req.Amount <= 0 {
		httpx.Error(w, http.StatusBadRequest, "invalid_amount")
		return
	}
	targetID, err := uuid.Parse(req.TargetID)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_target_id")
		return
	}

	principal, _ := authn.FromContext(r.Context())
	s, err := h.d.Repo.Create(r.Context(), principal.ID, req.TargetType, targetID, req.Amount)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "create_failed")
		return
	}
	httpx.JSON(w, http.StatusCreated, s)
}

func (h *handler) mine(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	out, err := h.d.Repo.ListMine(r.Context(), principal.ID)
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
	s, err := h.d.Repo.GetByID(r.Context(), id)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup_failed")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	if s == nil || s.AccountID != principal.ID.String() {
		httpx.Error(w, http.StatusNotFound, "sponsorship_not_found")
		return
	}
	httpx.JSON(w, http.StatusOK, s)
}
