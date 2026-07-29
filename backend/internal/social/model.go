package social

import "time"

type Comment struct {
	ID         string    `json:"id"`
	FixtureID  string    `json:"fixtureId"`
	AuthorName string    `json:"authorName"`
	Message    string    `json:"message"`
	CreatedAt  time.Time `json:"createdAt"`
}

type Poll struct {
	ID        string         `json:"id"`
	FixtureID string         `json:"fixtureId"`
	Question  string         `json:"question"`
	Options   []string       `json:"options"`
	Votes     map[string]int `json:"votes"`
}
