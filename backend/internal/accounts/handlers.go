package accounts

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/JosephNjorog/PitchLine/backend/internal/authn"
	"github.com/JosephNjorog/PitchLine/backend/internal/httpx"
	"github.com/JosephNjorog/PitchLine/backend/internal/sms"
)

type Deps struct {
	Repo           *Repository
	Middleware     *authn.Middleware
	JWTSecret      string
	GoogleClientID string
	OTPRepo        *authn.OTPRepo
	OTPTTL         time.Duration
	OTPDevMode     bool // true when OTP_DELIVERY=dev: dev code is echoed in the response
	SMSSender      sms.Sender
}

func Mount(r chi.Router, d Deps) {
	h := &handler{d: d}

	r.Post("/auth/google", h.signInWithGoogle)
	r.Post("/auth/otp/request", h.requestOTP)
	r.Post("/auth/otp/verify", h.verifyOTP)

	r.Group(func(auth chi.Router) {
		auth.Use(d.Middleware.RequireAuth)
		auth.Post("/auth/signout", h.signOut)
		auth.Get("/me", h.me)
		auth.Post("/onboarding/complete", h.completeOnboarding)
	})
}

type handler struct{ d Deps }

func (h *handler) issueSessionResponse(w http.ResponseWriter, acc *Account) {
	token, err := authn.IssueToken(h.d.JWTSecret, mustParseID(acc.ID))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "token_issue_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{
		"token":   token,
		"account": acc,
	})
}

// sendConfirmationSMS fires the once-per-account "your PitchLine account is
// set up" SMS on first registration, per the README's registration flow.
// Best-effort: a delivery failure never blocks the auth response.
func (h *handler) sendConfirmationSMS(acc *Account) {
	if acc.Phone == nil || *acc.Phone == "" {
		return
	}
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		msg := "Your PitchLine account is set up. Open the app: https://pitchline.app"
		if err := h.d.SMSSender.Send(ctx, *acc.Phone, msg); err != nil {
			log.Printf("confirmation sms failed for account %s: %v", acc.ID, err)
		} else {
			_ = h.d.Repo.MarkConfirmationSMSSent(ctx, mustParseID(acc.ID))
		}
	}()
}

type googleSignInRequest struct {
	IDToken string `json:"idToken"`
}

func (h *handler) signInWithGoogle(w http.ResponseWriter, r *http.Request) {
	var req googleSignInRequest
	if err := httpx.Decode(r, &req); err != nil || req.IDToken == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}

	identity, err := authn.VerifyGoogleIDToken(r.Context(), h.d.GoogleClientID, req.IDToken)
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "invalid_google_token")
		return
	}

	acc, isNew, err := h.d.Repo.GetOrCreateByGoogleSub(r.Context(), identity.Sub, identity.Email, identity.Name)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "account_lookup_failed")
		return
	}
	if isNew {
		h.sendConfirmationSMS(acc)
	}

	h.issueSessionResponse(w, acc)
}

type otpRequestRequest struct {
	Phone string `json:"phone"`
}

func (h *handler) requestOTP(w http.ResponseWriter, r *http.Request) {
	var req otpRequestRequest
	if err := httpx.Decode(r, &req); err != nil || len(req.Phone) < 9 {
		httpx.Error(w, http.StatusBadRequest, "invalid_phone")
		return
	}

	code, expiresAt, err := h.d.OTPRepo.Request(r.Context(), req.Phone, h.d.OTPTTL)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "otp_request_failed")
		return
	}

	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := h.d.SMSSender.Send(ctx, req.Phone, "Your PitchLine verification code is "+code); err != nil {
			log.Printf("otp sms failed for %s: %v", req.Phone, err)
		}
	}()

	resp := map[string]any{
		"phone":     req.Phone,
		"expiresAt": expiresAt,
	}
	if h.d.OTPDevMode {
		resp["devCode"] = code
	}
	httpx.JSON(w, http.StatusOK, resp)
}

type otpVerifyRequest struct {
	Phone string `json:"phone"`
	Code  string `json:"code"`
}

func (h *handler) verifyOTP(w http.ResponseWriter, r *http.Request) {
	var req otpVerifyRequest
	if err := httpx.Decode(r, &req); err != nil || req.Phone == "" || req.Code == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid_request")
		return
	}

	ok, err := h.d.OTPRepo.Verify(r.Context(), req.Phone, req.Code)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "otp_verify_failed")
		return
	}
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "invalid_or_expired_code")
		return
	}

	acc, isNew, err := h.d.Repo.GetOrCreateByPhone(r.Context(), req.Phone)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "account_lookup_failed")
		return
	}
	if isNew {
		h.sendConfirmationSMS(acc)
	}

	h.issueSessionResponse(w, acc)
}

func (h *handler) signOut(w http.ResponseWriter, r *http.Request) {
	// Stateless JWT: signout is client-side (drop the token). No server-side
	// blacklist in scope for the hackathon.
	w.WriteHeader(http.StatusNoContent)
}

func (h *handler) me(w http.ResponseWriter, r *http.Request) {
	principal, _ := authn.FromContext(r.Context())
	acc, err := h.d.Repo.GetByID(r.Context(), principal.ID)
	if err != nil || acc == nil {
		httpx.Error(w, http.StatusNotFound, "account_not_found")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"account": acc})
}

type completeOnboardingRequest struct {
	Role string `json:"role"`
}

var validRoles = map[string]bool{"fan": true, "team": true, "scout": true, "league": true}

func (h *handler) completeOnboarding(w http.ResponseWriter, r *http.Request) {
	var req completeOnboardingRequest
	if err := httpx.Decode(r, &req); err != nil || !validRoles[req.Role] {
		httpx.Error(w, http.StatusBadRequest, "invalid_role")
		return
	}

	principal, _ := authn.FromContext(r.Context())
	acc, err := h.d.Repo.CompleteOnboarding(r.Context(), principal.ID, req.Role)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "onboarding_failed")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"account": acc})
}

func mustParseID(s string) uuid.UUID {
	id, err := uuid.Parse(s)
	if err != nil {
		panic(err)
	}
	return id
}
