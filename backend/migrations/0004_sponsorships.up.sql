CREATE TABLE sponsorships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid NOT NULL REFERENCES accounts(id),
    target_type text NOT NULL CHECK (target_type IN ('team', 'player')),
    target_team_id uuid REFERENCES teams(id),
    target_player_id uuid REFERENCES players(id),
    target_label text NOT NULL,
    amount numeric(12, 2) NOT NULL CHECK (amount > 0),
    platform_fee_pct numeric(5, 2) NOT NULL,
    platform_fee_amount numeric(12, 2) NOT NULL,
    net_to_team_amount numeric(12, 2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (
        (target_type = 'team' AND target_team_id IS NOT NULL AND target_player_id IS NULL)
        OR (target_type = 'player' AND target_player_id IS NOT NULL AND target_team_id IS NULL)
    )
);
