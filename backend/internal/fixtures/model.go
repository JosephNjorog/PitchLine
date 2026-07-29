package fixtures

import "time"

type Fixture struct {
	ID         string    `json:"id"`
	HomeTeamID string    `json:"homeTeamId"`
	AwayTeamID string    `json:"awayTeamId"`
	KickoffAt  time.Time `json:"kickoffAt"`
	Status     string    `json:"status"`
	Venue      *string   `json:"venue,omitempty"`
}

type Scorer struct {
	TeamID     string `json:"teamId"`
	PlayerName string `json:"playerName"`
	Minute     *int   `json:"minute,omitempty"`
}

type CardEvent struct {
	TeamID     string `json:"teamId"`
	PlayerName string `json:"playerName"`
	Type       string `json:"type"`
	Minute     *int   `json:"minute,omitempty"`
}

type Result struct {
	ID           string         `json:"id"`
	FixtureID    string         `json:"fixtureId"`
	HomeScore    int            `json:"homeScore"`
	AwayScore    int            `json:"awayScore"`
	Scorers      []Scorer       `json:"scorers"`
	Cards        []CardEvent    `json:"cards"`
	MotmNominees []string       `json:"motmNominees"`
	MotmVotes    map[string]int `json:"motmVotes"`
}
