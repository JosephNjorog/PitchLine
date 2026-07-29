CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text UNIQUE,
    phone text UNIQUE,
    google_sub text UNIQUE,
    role text CHECK (role IN ('fan', 'team', 'scout', 'league')),
    onboarding_complete boolean NOT NULL DEFAULT false,
    confirmation_sms_sent_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE otp_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone text NOT NULL,
    code text NOT NULL,
    expires_at timestamptz NOT NULL,
    consumed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_otp_phone_active ON otp_codes(phone, consumed_at);

CREATE TABLE teams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    county text NOT NULL,
    sport text NOT NULL CHECK (sport IN ('football', 'rugby', 'basketball', 'volleyball', 'netball', 'athletics')),
    category text NOT NULL CHECK (category IN ('standard', 'adaptive')),
    disability_category text,
    crest_color text NOT NULL,
    follower_count integer NOT NULL DEFAULT 0,
    follow_code text UNIQUE,
    owner_account_id uuid REFERENCES accounts(id),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_teams_county ON teams(county);
CREATE INDEX idx_teams_sport ON teams(sport);

CREATE TABLE team_follows (
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (account_id, team_id)
);

CREATE TABLE players (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name text NOT NULL,
    position text NOT NULL,
    jersey_number integer,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE athletes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    team_id uuid NOT NULL REFERENCES teams(id),
    position text NOT NULL,
    age_group text NOT NULL CHECK (age_group IN ('U15', 'U17', 'U20', 'Senior')),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_athletes_team ON athletes(team_id);

CREATE TABLE fixtures (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    home_team_id uuid NOT NULL REFERENCES teams(id),
    away_team_id uuid NOT NULL REFERENCES teams(id),
    kickoff_at timestamptz NOT NULL,
    status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed')),
    venue text,
    created_by_account_id uuid REFERENCES accounts(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (home_team_id <> away_team_id)
);
CREATE INDEX idx_fixtures_status ON fixtures(status);
CREATE INDEX idx_fixtures_home ON fixtures(home_team_id);
CREATE INDEX idx_fixtures_away ON fixtures(away_team_id);
