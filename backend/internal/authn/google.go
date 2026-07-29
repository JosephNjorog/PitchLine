package authn

import (
	"context"
	"fmt"

	"google.golang.org/api/idtoken"
)

type GoogleIdentity struct {
	Sub   string
	Email string
	Name  string
}

// VerifyGoogleIDToken validates the ID token's signature, issuer, audience
// (must match clientID) and expiry via Google's own JWKS-backed validator.
func VerifyGoogleIDToken(ctx context.Context, clientID, rawIDToken string) (*GoogleIdentity, error) {
	payload, err := idtoken.Validate(ctx, rawIDToken, clientID)
	if err != nil {
		return nil, fmt.Errorf("verifying google id token: %w", err)
	}

	sub, _ := payload.Claims["sub"].(string)
	email, _ := payload.Claims["email"].(string)
	name, _ := payload.Claims["name"].(string)

	if sub == "" {
		return nil, fmt.Errorf("google id token missing sub claim")
	}

	return &GoogleIdentity{Sub: sub, Email: email, Name: name}, nil
}
