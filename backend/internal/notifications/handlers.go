package notifications

import (
	"net/http"

	"github.com/go-chi/chi/v5"

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
		auth.Get("/notifications", h.list)
		auth.Post("/notifications/read-all", h.markAllRead)
	})
}

type handler struct{ d Deps }

func (h *handler) list(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	out, err := h.d.Repo.ListForAccount(r.Context(), principal.ID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "list_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, out)
}

func (h *handler) markAllRead(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.MarkAllRead(r.Context(), principal.ID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "mark_read_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
