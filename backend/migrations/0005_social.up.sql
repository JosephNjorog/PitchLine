CREATE TABLE match_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fixture_id uuid NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
    account_id uuid REFERENCES accounts(id), -- null for seeded/demo comments with no real account
    author_name text NOT NULL,
    message text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_comments_fixture ON match_comments(fixture_id, created_at);

CREATE TABLE match_polls (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fixture_id uuid NOT NULL UNIQUE REFERENCES fixtures(id) ON DELETE CASCADE,
    question text NOT NULL,
    options text[] NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE poll_votes (
    poll_id uuid NOT NULL REFERENCES match_polls(id) ON DELETE CASCADE,
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    option_label text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (poll_id, account_id)
);
