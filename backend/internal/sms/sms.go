// Package sms is the single outbound-SMS chokepoint for PitchLine. Per the
// README, Africa's Talking SMS is used for exactly three things: OTP delivery
// during phone sign-in, the one-time account-creation confirmation message
// (with a team's follow code if one was just registered), and the result-push
// alert to a fixture's followers. All three call Sender.Send — swapping
// DevLogSender for AfricasTalkingSender (once AT_API_KEY/AT_USERNAME are set)
// changes delivery for all of them at once, with no call-site changes.
package sms

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"
)

type Sender interface {
	Send(ctx context.Context, toPhone, message string) error
}

// DevLogSender is the default Sender until Africa's Talking credentials are
// configured: it just logs the message that would have been sent.
type DevLogSender struct{}

func (DevLogSender) Send(_ context.Context, toPhone, message string) error {
	log.Printf("[DEV SMS] to=%s message=%q", toPhone, message)
	return nil
}

// AfricasTalkingSender sends real SMS via the Africa's Talking messaging API
// (https://developers.africastalking.com/docs/sms/sending/bulk). Construct
// with NewAfricasTalkingSender once AT_API_KEY/AT_USERNAME/AT_SMS_SENDER_ID
// are available; until then main.go keeps using DevLogSender.
type AfricasTalkingSender struct {
	apiKey     string
	username   string
	senderID   string // optional AT_SMS_SENDER_ID / short code
	baseURL    string
	httpClient *http.Client
}

// NewAfricasTalkingSender builds a sender against either AT's sandbox or live
// messaging endpoint. Sandbox apps only deliver to numbers registered as test
// numbers in the AT simulator; live accounts can incur real SMS charges.
func NewAfricasTalkingSender(apiKey, username, senderID string, sandbox bool) *AfricasTalkingSender {
	baseURL := "https://api.africastalking.com/version1/messaging"
	if sandbox {
		baseURL = "https://api.sandbox.africastalking.com/version1/messaging"
	}
	return &AfricasTalkingSender{
		apiKey:     apiKey,
		username:   username,
		senderID:   senderID,
		baseURL:    baseURL,
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}
}

type atRecipient struct {
	Status     string `json:"status"`
	StatusCode int    `json:"statusCode"`
	Number     string `json:"number"`
	Cost       string `json:"cost"`
	MessageID  string `json:"messageId"`
}

type atResponse struct {
	SMSMessageData struct {
		Message    string        `json:"Message"`
		Recipients []atRecipient `json:"Recipients"`
	} `json:"SMSMessageData"`
}

func (s *AfricasTalkingSender) Send(ctx context.Context, toPhone, message string) error {
	form := url.Values{}
	form.Set("username", s.username)
	form.Set("to", toPhone)
	form.Set("message", message)
	if s.senderID != "" {
		form.Set("from", s.senderID)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.baseURL, bytes.NewBufferString(form.Encode()))
	if err != nil {
		return fmt.Errorf("building africa's talking request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("apiKey", s.apiKey)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("calling africa's talking: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("reading africa's talking response: %w", err)
	}
	log.Printf("[AT SMS] to=%s http=%d raw=%s", toPhone, resp.StatusCode, string(body))

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("africa's talking returned status %d: %s", resp.StatusCode, string(body))
	}

	var parsed atResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return fmt.Errorf("decoding africa's talking response: %w", err)
	}
	if len(parsed.SMSMessageData.Recipients) == 0 {
		return fmt.Errorf("africa's talking accepted no recipients: %s", parsed.SMSMessageData.Message)
	}
	for _, r := range parsed.SMSMessageData.Recipients {
		if r.Status != "Success" {
			return fmt.Errorf("africa's talking rejected %s: %s (code %d)", r.Number, r.Status, r.StatusCode)
		}
	}
	return nil
}
