package athletes

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/JosephNjorog/PitchLine/backend/internal/httpx"
)

type Deps struct {
	Repo *Repository
}

func Mount(r chi.Router, d Deps) {
	h := &handler{d: d}
	r.Get("/athletes", h.search)
	r.Get("/positions", h.positions)
}

type handler struct{ d Deps }

func (h *handler) search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	out, err := h.d.Repo.Search(r.Context(), q.Get("q"), q.Get("county"), q.Get("sport"), q.Get("position"), q.Get("ageGroup"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "search_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, out)
}

func (h *handler) positions(w http.ResponseWriter, r *http.Request) {
	out, err := h.d.Repo.Positions(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "positions_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, out)
}
