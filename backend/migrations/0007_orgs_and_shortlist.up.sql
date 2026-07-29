CREATE TABLE orgs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_account_id uuid NOT NULL UNIQUE REFERENCES accounts(id),
    name text NOT NULL,
    kind text NOT NULL CHECK (kind IN ('scout', 'league')),
    focus_sports text[] NOT NULL DEFAULT '{}',
    region text NOT NULL,
    subscription_status text NOT NULL DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE org_jurisdiction_teams (
    org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    PRIMARY KEY (org_id, team_id)
);

CREATE TABLE shortlisted_teams (
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (account_id, team_id)
);

CREATE TABLE shortlisted_athletes (
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (account_id, athlete_id)
);
