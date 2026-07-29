package sponsorships

import "time"

type Sponsorship struct {
	ID                string    `json:"id"`
	AccountID         string    `json:"accountId"`
	TargetType        string    `json:"targetType"`
	TargetID          string    `json:"targetId"`
	TargetLabel       string    `json:"targetLabel"`
	Amount            float64   `json:"amount"`
	PlatformFeePct    float64   `json:"platformFeePct"`
	PlatformFeeAmount float64   `json:"platformFeeAmount"`
	NetToTeamAmount   float64   `json:"netToTeamAmount"`
	CreatedAt         time.Time `json:"createdAt"`
}

// PlatformFeePct is a fixed 10% platform cut on every sponsorship, matching
// the fee-split receipt the fan dashboard shows today.
const PlatformFeePct = 10.0
