include .env
export

MIGRATE := $(HOME)/go/bin/migrate -database "$(DATABASE_URL)" -path migrations

.PHONY: migrate-up migrate-down run build

migrate-up:
	$(MIGRATE) up

migrate-down:
	$(MIGRATE) down 1

run:
	go run ./cmd/api

build:
	go build -o bin/api ./cmd/api
