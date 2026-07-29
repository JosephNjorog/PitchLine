CREATE TABLE prediction_rounds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fixture_id uuid NOT NULL UNIQUE REFERENCES fixtures(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'settled')),
    closes_at timestamptz NOT NULL,
    points_for_exact_score integer NOT NULL DEFAULT 3,
    points_for_correct_outcome integer NOT NULL DEFAULT 1,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE prediction_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id uuid NOT NULL REFERENCES prediction_rounds(id) ON DELETE CASCADE,
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    predicted_home_score integer NOT NULL,
    predicted_away_score integer NOT NULL,
    points_awarded integer,
    submitted_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (round_id, account_id)
);
