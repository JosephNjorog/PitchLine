ALTER TABLE sponsorships DROP CONSTRAINT sponsorships_target_player_id_fkey;
ALTER TABLE sponsorships ADD CONSTRAINT sponsorships_target_player_id_fkey
    FOREIGN KEY (target_player_id) REFERENCES players(id);
