package notifications

import "time"

type Notification struct {
	ID        string     `json:"id"`
	Type      string     `json:"type"`
	Message   string     `json:"message"`
	ReadAt    *time.Time `json:"readAt,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
}
