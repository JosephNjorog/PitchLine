package social

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/JosephNjorog/PitchLine/backend/internal/authn"
	"github.com/JosephNjorog/PitchLine/backend/internal/httpx"
)

type Deps struct {
	Comments   *CommentsRepository
	Polls      *PollsRepository
	Pool       *pgxpool.Pool
	Middleware *authn.Middleware
}

func Mount(r chi.Router, d Deps) {
	h := &handler{d: d}

	r.Get("/fixtures/{id}/comments", h.listComments)
	r.Get("/fixtures/{id}/poll", h.getPoll)

	r.Group(func(auth chi.Router) {
		auth.Use(d.Middleware.RequireAuth)
		auth.Post("/fixtures/{id}/comments", h.addComment)
		auth.Post("/polls/{id}/vote", h.votePoll)
	})
}

type handler struct{ d Deps }

func (h *handler) listComments(w http.ResponseWriter, r *http.Request) {
	fixtureID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	out, err := h.d.Comments.ListForFixture(r.Context(), fixtureID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "list_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, out)
}

type addCommentRequest struct {
	Message string `json:"message"`
}

func (h *handler) accountName(ctx context.Context, accountID uuid.UUID) (string, error) {
	var name string
	err := h.d.Pool.QueryRow(ctx, `SELECT name FROM accounts WHERE id = $1`, accountID).Scan(&name)
	return name, err
}

func (h *handler) addComment(w http.ResponseWriter, r *http.Request) {
	fixtureID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	var req addCommentRequest
	if err := httpx.Decode(r, &req); err != nil || req.Message == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}

	principal, _ := authn.FromContext(r.Context())
	authorName, err := h.accountName(r.Context(), principal.ID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "author_lookup_failed")
		return
	}

	c, err := h.d.Comments.Add(r.Context(), fixtureID, principal.ID, authorName, req.Message)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "add_comment_failed")
		return
	}
	httpx.JSON(w, http.StatusCreated, c)
}

func (h *handler) getPoll(w http.ResponseWriter, r *http.Request) {
	fixtureID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	p, err := h.d.Polls.GetForFixture(r.Context(), fixtureID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup_failed")
		return
	}
	if p == nil {
		httpx.Error(w, http.StatusNotFound, "poll_not_found")
		return
	}
	httpx.JSON(w, http.StatusOK, p)
}

type voteRequest struct {
	OptionLabel string `json:"optionLabel"`
}

func (h *handler) votePoll(w http.ResponseWriter, r *http.Request) {
	pollID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	var req voteRequest
	if err := httpx.Decode(r, &req); err != nil || req.OptionLabel == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Polls.Vote(r.Context(), pollID, principal.ID, req.OptionLabel); err != nil {
		httpx.Error(w, http.StatusBadRequest, "vote_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
