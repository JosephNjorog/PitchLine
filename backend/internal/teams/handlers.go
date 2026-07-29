package teams

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

	r.Get("/teams", h.search)
	r.Get("/teams/{id}", h.getByID)
	r.Get("/counties", h.counties)

	r.Group(func(auth chi.Router) {
		auth.Use(d.Middleware.RequireAuth)
		auth.Post("/teams/{id}/follow", h.follow)
		auth.Delete("/teams/{id}/follow", h.unfollow)
		auth.Post("/me/followed-teams/bulk", h.followMany)
		auth.Get("/me/followed-teams", h.listFollowed)

		auth.Group(func(team chi.Router) {
			team.Use(authn.RequireRole("team"))
			team.Post("/teams", h.create)
			team.Get("/me/team", h.myTeam)
			team.Get("/teams/me/players", h.listPlayers)
			team.Post("/teams/me/players", h.addPlayer)
			team.Delete("/teams/me/players/{id}", h.removePlayer)
		})
	})
}

type handler struct{ d Deps }

func (h *handler) search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	out, err := h.d.Repo.Search(r.Context(), q.Get("q"), q.Get("county"), q.Get("sport"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "search_failed")
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
	t, err := h.d.Repo.GetByID(r.Context(), id)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup_failed")
		return
	}
	if t == nil {
		httpx.Error(w, http.StatusNotFound, "team_not_found")
		return
	}
	httpx.JSON(w, http.StatusOK, t)
}

func (h *handler) counties(w http.ResponseWriter, r *http.Request) {
	out, err := h.d.Repo.Counties(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "counties_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, out)
}

type createTeamRequest struct {
	Name               string  `json:"name"`
	County             string  `json:"county"`
	Sport              string  `json:"sport"`
	Category           string  `json:"category"`
	DisabilityCategory *string `json:"disabilityCategory,omitempty"`
	CrestColor         string  `json:"crestColor"`
}

func (h *handler) create(w http.ResponseWriter, r *http.Request) {
	var req createTeamRequest
	if err := httpx.Decode(r, &req); err != nil || req.Name == "" || req.County == "" || req.Sport == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	if req.CrestColor == "" {
		req.CrestColor = "#14532D"
	}

	principal, _ := authn.FromContext(r.Context())
	t, err := h.d.Repo.Create(r.Context(), principal.ID, CreateInput{
		Name:               req.Name,
		County:             req.County,
		Sport:              req.Sport,
		Category:           req.Category,
		DisabilityCategory: req.DisabilityCategory,
		CrestColor:         req.CrestColor,
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "create_failed")
		return
	}
	httpx.JSON(w, http.StatusCreated, t)
}

func (h *handler) myTeam(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	t, err := h.d.Repo.GetByOwner(r.Context(), principal.ID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup_failed")
		return
	}
	if t == nil {
		httpx.Error(w, http.StatusNotFound, "no_team")
		return
	}
	httpx.JSON(w, http.StatusOK, t)
}

func (h *handler) follow(w http.ResponseWriter, r *http.Request) {
	teamID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.Follow(r.Context(), principal.ID, teamID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "follow_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *handler) unfollow(w http.ResponseWriter, r *http.Request) {
	teamID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	if err := h.d.Repo.Unfollow(r.Context(), principal.ID, teamID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "unfollow_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

type followManyRequest struct {
	TeamIDs []string `json:"teamIds"`
}

func (h *handler) followMany(w http.ResponseWriter, r *http.Request) {
	var req followManyRequest
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
	if err := h.d.Repo.FollowMany(r.Context(), principal.ID, ids); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "follow_many_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *handler) listFollowed(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	ids, err := h.d.Repo.ListFollowedIDs(r.Context(), principal.ID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "list_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"teamIds": ids})
}

func (h *handler) listPlayers(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	team, err := h.d.Repo.GetByOwner(r.Context(), principal.ID)
	if err != nil || team == nil {
		httpx.Error(w, http.StatusNotFound, "no_team")
		return
	}
	players, err := h.d.Repo.ListPlayers(r.Context(), uuid.MustParse(team.ID))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "list_players_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, players)
}

type addPlayerRequest struct {
	Name         string `json:"name"`
	Position     string `json:"position"`
	JerseyNumber *int   `json:"jerseyNumber,omitempty"`
}

func (h *handler) addPlayer(w http.ResponseWriter, r *http.Request) {
	var req addPlayerRequest
	if err := httpx.Decode(r, &req); err != nil || req.Name == "" || req.Position == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	team, err := h.d.Repo.GetByOwner(r.Context(), principal.ID)
	if err != nil || team == nil {
		httpx.Error(w, http.StatusNotFound, "no_team")
		return
	}
	p, err := h.d.Repo.AddPlayer(r.Context(), uuid.MustParse(team.ID), req.Name, req.Position, req.JerseyNumber)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "add_player_failed")
		return
	}
	httpx.JSON(w, http.StatusCreated, p)
}

func (h *handler) removePlayer(w http.ResponseWriter, r *http.Request) {
	playerID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_id")
		return
	}
	principal, _ := authn.FromContext(r.Context())
	team, err := h.d.Repo.GetByOwner(r.Context(), principal.ID)
	if err != nil || team == nil {
		httpx.Error(w, http.StatusNotFound, "no_team")
		return
	}
	if err := h.d.Repo.RemovePlayer(r.Context(), uuid.MustParse(team.ID), playerID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "remove_player_failed")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
