-- Sponsoring "a player" is conceptually backing a publicly discoverable
-- athlete, not a private roster entry only the team rep can see/edit —
-- repoint the FK from players to athletes to match.
ALTER TABLE sponsorships DROP CONSTRAINT sponsorships_target_player_id_fkey;
ALTER TABLE sponsorships ADD CONSTRAINT sponsorships_target_player_id_fkey
    FOREIGN KEY (target_player_id) REFERENCES athletes(id);
