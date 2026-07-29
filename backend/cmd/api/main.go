package main

import (
	"context"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	"github.com/JosephNjorog/PitchLine/backend/internal/accounts"
	"github.com/JosephNjorog/PitchLine/backend/internal/authn"
	"github.com/JosephNjorog/PitchLine/backend/internal/config"
	"github.com/JosephNjorog/PitchLine/backend/internal/db"
	"github.com/JosephNjorog/PitchLine/backend/internal/httpx"
	"github.com/JosephNjorog/PitchLine/backend/internal/sms"
)

func main() {
	_ = godotenv.Load()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pool, err := db.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	defer pool.Close()

	var smsSender sms.Sender = sms.DevLogSender{}
	if cfg.OTPDelivery == "sms" && cfg.ATAPIKey != "" && cfg.ATUsername != "" {
		smsSender = sms.NewAfricasTalkingSender(cfg.ATAPIKey, cfg.ATUsername, cfg.ATSenderID, cfg.ATSandbox)
		log.Println("sms: using Africa's Talking sender")
	} else {
		log.Println("sms: using dev-mode sender (OTP codes logged/returned in API responses)")
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.CORSOrigins,
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		httpx.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	accountsRepo := accounts.NewRepository(pool)
	otpRepo := authn.NewOTPRepo(pool)
	authMiddleware := authn.NewMiddleware(cfg.JWTSecret, accountsRepo)

	r.Route("/api/v1", func(api chi.Router) {
		accounts.Mount(api, accounts.Deps{
			Repo:           accountsRepo,
			Middleware:     authMiddleware,
			JWTSecret:      cfg.JWTSecret,
			GoogleClientID: cfg.GoogleClientID,
			OTPRepo:        otpRepo,
			OTPTTL:         time.Duration(cfg.OTPTTLSeconds) * time.Second,
			OTPDevMode:     cfg.OTPDelivery == "dev",
			SMSSender:      smsSender,
		})
	})

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	go func() {
		log.Printf("pitchline api listening on :%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server: %v", err)
		}
	}()

	<-ctx.Done()
	log.Println("shutting down")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(shutdownCtx)
}
