package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	DatabaseURL    string
	JWTSecret      string
	GoogleClientID string
	Port           string
	CORSOrigin     string
	OTPTTLSeconds  int
	OTPDelivery    string // "dev" (log/return code) or "sms" (real Africa's Talking send)
	ATAPIKey       string
	ATUsername     string
	ATSenderID     string
	ATSandbox      bool
}

func Load() (*Config, error) {
	cfg := &Config{
		DatabaseURL:    os.Getenv("DATABASE_URL"),
		JWTSecret:      os.Getenv("JWT_SECRET"),
		GoogleClientID: os.Getenv("GOOGLE_CLIENT_ID"),
		Port:           envOr("PORT", "8080"),
		CORSOrigin:     envOr("CORS_ORIGIN", "http://localhost:5173"),
		OTPDelivery:    envOr("OTP_DELIVERY", "dev"),
		ATAPIKey:       os.Getenv("AT_API_KEY"),
		ATUsername:     os.Getenv("AT_USERNAME"),
		ATSenderID:     os.Getenv("AT_SMS_SENDER_ID"),
		ATSandbox:      envOr("AT_ENV", "sandbox") != "production",
	}

	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}
	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}

	ttl, err := strconv.Atoi(envOr("OTP_TTL_SECONDS", "300"))
	if err != nil {
		return nil, fmt.Errorf("invalid OTP_TTL_SECONDS: %w", err)
	}
	cfg.OTPTTLSeconds = ttl

	return cfg, nil
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
