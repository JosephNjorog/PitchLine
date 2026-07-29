package authn

import (
	"context"
	"net/http"
	"strings"

	"github.com/google/uuid"

	"github.com/JosephNjorog/PitchLine/backend/internal/httpx"
)

// Principal is the minimal identity+authorization shape middleware needs.
// Kept independent of the richer accounts.Account model to avoid a circular
// import between authn (which accounts depends on for JWT/OTP/Google) and
// accounts (which authn's middleware needs to load the current user).
type Principal struct {
	ID                 uuid.UUID
	Role               string // "", "fan", "team", "scout", "league"
	OnboardingComplete bool
}

type PrincipalLoader interface {
	LoadPrincipal(ctx context.Context, id uuid.UUID) (*Principal, error)
}

type ctxKey int

const principalCtxKey ctxKey = iota

func FromContext(ctx context.Context) (*Principal, bool) {
	p, ok := ctx.Value(principalCtxKey).(*Principal)
	return p, ok
}

type Middleware struct {
	secret string
	loader PrincipalLoader
}

func NewMiddleware(secret string, loader PrincipalLoader) *Middleware {
	return &Middleware{secret: secret, loader: loader}
}

func (m *Middleware) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		token, ok := strings.CutPrefix(authHeader, "Bearer ")
		if !ok || token == "" {
			httpx.Error(w, http.StatusUnauthorized, "missing_token")
			return
		}

		accountID, err := ParseToken(m.secret, token)
		if err != nil {
			httpx.Error(w, http.StatusUnauthorized, "invalid_token")
			return
		}

		principal, err := m.loader.LoadPrincipal(r.Context(), accountID)
		if err != nil || principal == nil {
			httpx.Error(w, http.StatusUnauthorized, "account_not_found")
			return
		}

		ctx := context.WithValue(r.Context(), principalCtxKey, principal)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RequireOnboarded(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		principal, ok := FromContext(r.Context())
		if !ok || !principal.OnboardingComplete {
			httpx.Error(w, http.StatusForbidden, "onboarding_incomplete")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func RequireRole(roles ...string) func(http.Handler) http.Handler {
	allowed := make(map[string]bool, len(roles))
	for _, r := range roles {
		allowed[r] = true
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			principal, ok := FromContext(r.Context())
			if !ok || !allowed[principal.Role] {
				httpx.Error(w, http.StatusForbidden, "forbidden_role")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
