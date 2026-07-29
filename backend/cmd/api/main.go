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
	"github.com/JosephNjorog/PitchLine/backend/internal/athletes"
	"github.com/JosephNjorog/PitchLine/backend/internal/authn"
	"github.com/JosephNjorog/PitchLine/backend/internal/config"
	"github.com/JosephNjorog/PitchLine/backend/internal/db"
	"github.com/JosephNjorog/PitchLine/backend/internal/fixtures"
	"github.com/JosephNjorog/PitchLine/backend/internal/httpx"
	"github.com/JosephNjorog/PitchLine/backend/internal/notifications"
	"github.com/JosephNjorog/PitchLine/backend/internal/orgs"
	"github.com/JosephNjorog/PitchLine/backend/internal/predictions"
	"github.com/JosephNjorog/PitchLine/backend/internal/shortlist"
	"github.com/JosephNjorog/PitchLine/backend/internal/sms"
	"github.com/JosephNjorog/PitchLine/backend/internal/social"
	"github.com/JosephNjorog/PitchLine/backend/internal/sponsorships"
	"github.com/JosephNjorog/PitchLine/backend/internal/teams"
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

	teamsRepo := teams.NewRepository(pool)
	athletesRepo := athletes.NewRepository(pool)
	fixturesRepo := fixtures.NewRepository(pool)
	predictionsRepo := predictions.NewRepository(pool)
	sponsorshipsRepo := sponsorships.NewRepository(pool)
	commentsRepo := social.NewCommentsRepository(pool)
	pollsRepo := social.NewPollsRepository(pool)
	notificationsRepo := notifications.NewRepository(pool)
	orgsRepo := orgs.NewRepository(pool)
	shortlistRepo := shortlist.NewRepository(pool)

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
		teams.Mount(api, teams.Deps{Repo: teamsRepo, Middleware: authMiddleware})
		athletes.Mount(api, athletes.Deps{Repo: athletesRepo})
		fixtures.Mount(api, fixtures.Deps{Repo: fixturesRepo, Pool: pool, Middleware: authMiddleware})
		predictions.Mount(api, predictions.Deps{Repo: predictionsRepo, Middleware: authMiddleware})
		sponsorships.Mount(api, sponsorships.Deps{Repo: sponsorshipsRepo, Middleware: authMiddleware})
		social.Mount(api, social.Deps{Comments: commentsRepo, Polls: pollsRepo, Pool: pool, Middleware: authMiddleware})
		notifications.Mount(api, notifications.Deps{Repo: notificationsRepo, Middleware: authMiddleware})
		orgs.Mount(api, orgs.Deps{Repo: orgsRepo, Middleware: authMiddleware})
		shortlist.Mount(api, shortlist.Deps{Repo: shortlistRepo, Middleware: authMiddleware})
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
