package orgs

type Org struct {
	ID                  string   `json:"id"`
	Name                string   `json:"name"`
	Kind                string   `json:"kind"`
	FocusSports         []string `json:"focusSports"`
	Region              string   `json:"region"`
	SubscriptionStatus  string   `json:"subscriptionStatus"`
	JurisdictionTeamIDs []string `json:"jurisdictionTeamIds"`
}
