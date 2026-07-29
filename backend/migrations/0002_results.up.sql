CREATE TABLE results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fixture_id uuid NOT NULL UNIQUE REFERENCES fixtures(id) ON DELETE CASCADE,
    home_score integer NOT NULL,
    away_score integer NOT NULL,
    motm_nominees text[] NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE result_scorers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id uuid NOT NULL REFERENCES results(id) ON DELETE CASCADE,
    team_id uuid NOT NULL REFERENCES teams(id),
    player_name text NOT NULL,
    minute integer
);

CREATE TABLE result_cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id uuid NOT NULL REFERENCES results(id) ON DELETE CASCADE,
    team_id uuid NOT NULL REFERENCES teams(id),
    player_name text NOT NULL,
    type text NOT NULL CHECK (type IN ('yellow', 'red')),
    minute integer
);

CREATE TABLE motm_votes (
    result_id uuid NOT NULL REFERENCES results(id) ON DELETE CASCADE,
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    nominee_name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (result_id, account_id)
);
