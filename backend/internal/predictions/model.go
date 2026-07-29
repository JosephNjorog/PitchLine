package predictions

import "time"

type Round struct {
	ID                      string    `json:"id"`
	FixtureID               string    `json:"fixtureId"`
	Status                  string    `json:"status"`
	ClosesAt                time.Time `json:"closesAt"`
	PointsForExactScore     int       `json:"pointsForExactScore"`
	PointsForCorrectOutcome int       `json:"pointsForCorrectOutcome"`
}

type Entry struct {
	ID                 string    `json:"id"`
	RoundID            string    `json:"roundId"`
	AccountID          string    `json:"accountId"`
	PredictedHomeScore int       `json:"predictedHomeScore"`
	PredictedAwayScore int       `json:"predictedAwayScore"`
	SubmittedAt        time.Time `json:"submittedAt"`
	PointsAwarded      *int      `json:"pointsAwarded,omitempty"`
}

type LeaderboardEntry struct {
	AccountID   string `json:"accountId"`
	DisplayName string `json:"displayName"`
	Points      int    `json:"points"`
	Rank        int    `json:"rank"`
}
