package athletes

type Athlete struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	TeamID   string `json:"teamId"`
	Position string `json:"position"`
	AgeGroup string `json:"ageGroup"`
}
