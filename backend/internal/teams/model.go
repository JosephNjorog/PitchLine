package teams

type Team struct {
	ID                 string  `json:"id"`
	Name               string  `json:"name"`
	County             string  `json:"county"`
	Sport              string  `json:"sport"`
	Category           string  `json:"category"`
	DisabilityCategory *string `json:"disabilityCategory,omitempty"`
	CrestColor         string  `json:"crestColor"`
	FollowerCount      int     `json:"followerCount"`
	FollowCode         *string `json:"followCode,omitempty"`
}

type Player struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Position     string `json:"position"`
	JerseyNumber *int   `json:"jerseyNumber,omitempty"`
}
