package accounts

import "time"

type Account struct {
	ID                    string     `json:"id"`
	Name                  string     `json:"name"`
	Email                 *string    `json:"email,omitempty"`
	Phone                 *string    `json:"phone,omitempty"`
	Role                  *string    `json:"role"`
	OnboardingComplete    bool       `json:"onboardingComplete"`
	CreatedAt             time.Time  `json:"-"`
	GoogleSub             *string    `json:"-"`
	ConfirmationSMSSentAt *time.Time `json:"-"`
}
