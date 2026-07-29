-- Ports frontend/src/mock-data/*.ts seed arrays into real rows so the demo
-- has data immediately. IDs are deterministic v5 UUIDs derived from the
-- original mock string ids (e.g. 'team-nairobi-thunder'), so this file stays
-- readable and FK references can just re-derive the same UUID rather than
-- needing a lookup table.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- teams
INSERT INTO teams (id, name, county, sport, category, disability_category, crest_color, follower_count) VALUES
(uuid_generate_v5(uuid_ns_url(), 'team-nairobi-thunder'), 'Nairobi Thunder FC', 'Nairobi', 'football', 'standard', NULL, '#14532D', 842),
(uuid_generate_v5(uuid_ns_url(), 'team-kibera-rangers'), 'Kibera Rangers', 'Nairobi', 'football', 'standard', NULL, '#B45309', 611),
(uuid_generate_v5(uuid_ns_url(), 'team-kisumu-lakers'), 'Kisumu Lakers', 'Kisumu', 'basketball', 'standard', NULL, '#1D4ED8', 398),
(uuid_generate_v5(uuid_ns_url(), 'team-nyalenda-queens'), 'Nyalenda Queens', 'Kisumu', 'netball', 'standard', NULL, '#BE185D', 275),
(uuid_generate_v5(uuid_ns_url(), 'team-mombasa-sharks'), 'Mombasa Sharks RFC', 'Mombasa', 'rugby', 'standard', NULL, '#0E7490', 520),
(uuid_generate_v5(uuid_ns_url(), 'team-tudor-tridents'), 'Tudor Tridents', 'Mombasa', 'volleyball', 'standard', NULL, '#7C3AED', 189),
(uuid_generate_v5(uuid_ns_url(), 'team-nakuru-warriors'), 'Nakuru Warriors', 'Nakuru', 'football', 'adaptive', 'Amputee football', '#B91C1C', 334),
(uuid_generate_v5(uuid_ns_url(), 'team-rift-valley-blazers'), 'Rift Valley Blazers', 'Nakuru', 'athletics', 'standard', NULL, '#CA8A04', 447),
(uuid_generate_v5(uuid_ns_url(), 'team-eldoret-eagles'), 'Eldoret Eagles', 'Uasin Gishu', 'football', 'standard', NULL, '#166534', 703),
(uuid_generate_v5(uuid_ns_url(), 'team-eldoret-wheelchair-hoopers'), 'Eldoret Wheelchair Hoopers', 'Uasin Gishu', 'basketball', 'adaptive', 'Wheelchair basketball', '#0F766E', 156),
(uuid_generate_v5(uuid_ns_url(), 'team-machakos-hills'), 'Machakos Hills FC', 'Machakos', 'football', 'standard', NULL, '#9A3412', 288),
(uuid_generate_v5(uuid_ns_url(), 'team-kitale-comets'), 'Kitale Comets', 'Trans Nzoia', 'volleyball', 'standard', NULL, '#4338CA', 143),
(uuid_generate_v5(uuid_ns_url(), 'team-kakamega-forest-runners'), 'Kakamega Forest Runners', 'Kakamega', 'athletics', 'standard', NULL, '#15803D', 231),
(uuid_generate_v5(uuid_ns_url(), 'team-nyeri-blind-strikers'), 'Nyeri Blind Strikers', 'Nyeri', 'football', 'adaptive', 'Blind football (5-a-side)', '#374151', 97);

-- athletes
INSERT INTO athletes (id, name, team_id, position, age_group) VALUES
(uuid_generate_v5(uuid_ns_url(), 'athlete-001'), 'Brian Otieno', uuid_generate_v5(uuid_ns_url(), 'team-nairobi-thunder'), 'Forward', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-002'), 'Kevin Mwangi', uuid_generate_v5(uuid_ns_url(), 'team-nairobi-thunder'), 'Midfielder', 'U20'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-003'), 'Felix Wanjala', uuid_generate_v5(uuid_ns_url(), 'team-kibera-rangers'), 'Forward', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-004'), 'Dennis Kioko', uuid_generate_v5(uuid_ns_url(), 'team-kibera-rangers'), 'Defender', 'U20'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-005'), 'Achieng Odongo', uuid_generate_v5(uuid_ns_url(), 'team-kisumu-lakers'), 'Guard', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-006'), 'Brenda Awuor', uuid_generate_v5(uuid_ns_url(), 'team-kisumu-lakers'), 'Center', 'U20'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-007'), 'Faith Adhiambo', uuid_generate_v5(uuid_ns_url(), 'team-nyalenda-queens'), 'Goal Attack', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-008'), 'Ali Juma', uuid_generate_v5(uuid_ns_url(), 'team-mombasa-sharks'), 'Fly-half', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-009'), 'Hassan Mwakio', uuid_generate_v5(uuid_ns_url(), 'team-mombasa-sharks'), 'Prop', 'U20'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-010'), 'Omar Bakari', uuid_generate_v5(uuid_ns_url(), 'team-tudor-tridents'), 'Outside Hitter', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-011'), 'Josphat Kamau', uuid_generate_v5(uuid_ns_url(), 'team-nakuru-warriors'), 'Forward', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-012'), 'Peter Karanja', uuid_generate_v5(uuid_ns_url(), 'team-rift-valley-blazers'), '400m Sprinter', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-013'), 'Kevin Rotich', uuid_generate_v5(uuid_ns_url(), 'team-eldoret-eagles'), 'Winger', 'U20'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-014'), 'Sammy Korir', uuid_generate_v5(uuid_ns_url(), 'team-eldoret-eagles'), 'Striker', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-015'), 'Grace Chebet', uuid_generate_v5(uuid_ns_url(), 'team-eldoret-wheelchair-hoopers'), 'Guard', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-016'), 'Peter Mutuku', uuid_generate_v5(uuid_ns_url(), 'team-machakos-hills'), 'Midfielder', 'U17'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-017'), 'John Musyoka', uuid_generate_v5(uuid_ns_url(), 'team-machakos-hills'), 'Defender', 'U17'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-018'), 'Mercy Wanjiku', uuid_generate_v5(uuid_ns_url(), 'team-kitale-comets'), 'Setter', 'U20'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-019'), 'Isaac Kiplagat', uuid_generate_v5(uuid_ns_url(), 'team-kakamega-forest-runners'), '5000m Runner', 'Senior'),
(uuid_generate_v5(uuid_ns_url(), 'athlete-020'), 'Samuel Nderitu', uuid_generate_v5(uuid_ns_url(), 'team-nyeri-blind-strikers'), 'Striker', 'Senior');

-- fixtures
INSERT INTO fixtures (id, home_team_id, away_team_id, kickoff_at, status, venue) VALUES
(uuid_generate_v5(uuid_ns_url(), 'fixture-001'), uuid_generate_v5(uuid_ns_url(), 'team-nairobi-thunder'), uuid_generate_v5(uuid_ns_url(), 'team-kibera-rangers'), '2026-07-25T13:00:00Z', 'completed', 'City Stadium, Nairobi'),
(uuid_generate_v5(uuid_ns_url(), 'fixture-002'), uuid_generate_v5(uuid_ns_url(), 'team-eldoret-eagles'), uuid_generate_v5(uuid_ns_url(), 'team-machakos-hills'), '2026-07-26T11:00:00Z', 'completed', 'Kipchoge Keino Stadium'),
(uuid_generate_v5(uuid_ns_url(), 'fixture-003'), uuid_generate_v5(uuid_ns_url(), 'team-nyalenda-queens'), uuid_generate_v5(uuid_ns_url(), 'team-kisumu-lakers'), '2026-07-26T14:30:00Z', 'completed', 'Moi Stadium, Kisumu'),
(uuid_generate_v5(uuid_ns_url(), 'fixture-004'), uuid_generate_v5(uuid_ns_url(), 'team-nakuru-warriors'), uuid_generate_v5(uuid_ns_url(), 'team-nyeri-blind-strikers'), '2026-07-27T10:00:00Z', 'completed', 'Afraha Stadium, Nakuru'),
(uuid_generate_v5(uuid_ns_url(), 'fixture-005'), uuid_generate_v5(uuid_ns_url(), 'team-mombasa-sharks'), uuid_generate_v5(uuid_ns_url(), 'team-tudor-tridents'), '2026-07-28T13:30:00Z', 'live', 'Mbaraki Sports Club, Mombasa'),
(uuid_generate_v5(uuid_ns_url(), 'fixture-006'), uuid_generate_v5(uuid_ns_url(), 'team-kibera-rangers'), uuid_generate_v5(uuid_ns_url(), 'team-eldoret-eagles'), '2026-08-01T13:00:00Z', 'scheduled', 'City Stadium, Nairobi'),
(uuid_generate_v5(uuid_ns_url(), 'fixture-007'), uuid_generate_v5(uuid_ns_url(), 'team-eldoret-wheelchair-hoopers'), uuid_generate_v5(uuid_ns_url(), 'team-kisumu-lakers'), '2026-08-02T11:00:00Z', 'scheduled', 'Eldoret Sports Club'),
(uuid_generate_v5(uuid_ns_url(), 'fixture-008'), uuid_generate_v5(uuid_ns_url(), 'team-rift-valley-blazers'), uuid_generate_v5(uuid_ns_url(), 'team-kakamega-forest-runners'), '2026-08-03T09:00:00Z', 'scheduled', 'Nakuru ASK Showground'),
(uuid_generate_v5(uuid_ns_url(), 'fixture-009'), uuid_generate_v5(uuid_ns_url(), 'team-kitale-comets'), uuid_generate_v5(uuid_ns_url(), 'team-tudor-tridents'), '2026-08-04T14:00:00Z', 'scheduled', 'Kitale Social Hall');

-- results
INSERT INTO results (id, fixture_id, home_score, away_score, motm_nominees) VALUES
(uuid_generate_v5(uuid_ns_url(), 'result-001'), uuid_generate_v5(uuid_ns_url(), 'fixture-001'), 2, 1, ARRAY['Brian Otieno', 'Felix Wanjala']),
(uuid_generate_v5(uuid_ns_url(), 'result-002'), uuid_generate_v5(uuid_ns_url(), 'fixture-002'), 3, 3, ARRAY['Kevin Rotich', 'Peter Mutuku']),
(uuid_generate_v5(uuid_ns_url(), 'result-003'), uuid_generate_v5(uuid_ns_url(), 'fixture-003'), 41, 36, ARRAY['Achieng Odongo', 'Brenda Awuor']),
(uuid_generate_v5(uuid_ns_url(), 'result-004'), uuid_generate_v5(uuid_ns_url(), 'fixture-004'), 1, 1, ARRAY['Josphat Kamau', 'Samuel Nderitu']),
(uuid_generate_v5(uuid_ns_url(), 'result-005'), uuid_generate_v5(uuid_ns_url(), 'fixture-005'), 2, 2, ARRAY['Ali Juma', 'Omar Bakari']);

-- result_scorers
INSERT INTO result_scorers (result_id, team_id, player_name, minute) VALUES
(uuid_generate_v5(uuid_ns_url(), 'result-001'), uuid_generate_v5(uuid_ns_url(), 'team-nairobi-thunder'), 'Brian Otieno', 23),
(uuid_generate_v5(uuid_ns_url(), 'result-001'), uuid_generate_v5(uuid_ns_url(), 'team-nairobi-thunder'), 'Brian Otieno', 67),
(uuid_generate_v5(uuid_ns_url(), 'result-001'), uuid_generate_v5(uuid_ns_url(), 'team-kibera-rangers'), 'Felix Wanjala', 54),
(uuid_generate_v5(uuid_ns_url(), 'result-002'), uuid_generate_v5(uuid_ns_url(), 'team-eldoret-eagles'), 'Kevin Rotich', 12),
(uuid_generate_v5(uuid_ns_url(), 'result-002'), uuid_generate_v5(uuid_ns_url(), 'team-eldoret-eagles'), 'Sammy Korir', 44),
(uuid_generate_v5(uuid_ns_url(), 'result-002'), uuid_generate_v5(uuid_ns_url(), 'team-eldoret-eagles'), 'Kevin Rotich', 80),
(uuid_generate_v5(uuid_ns_url(), 'result-002'), uuid_generate_v5(uuid_ns_url(), 'team-machakos-hills'), 'Peter Mutuku', 30),
(uuid_generate_v5(uuid_ns_url(), 'result-002'), uuid_generate_v5(uuid_ns_url(), 'team-machakos-hills'), 'Peter Mutuku', 58),
(uuid_generate_v5(uuid_ns_url(), 'result-002'), uuid_generate_v5(uuid_ns_url(), 'team-machakos-hills'), 'John Musyoka', 88),
(uuid_generate_v5(uuid_ns_url(), 'result-004'), uuid_generate_v5(uuid_ns_url(), 'team-nakuru-warriors'), 'Josphat Kamau', 39),
(uuid_generate_v5(uuid_ns_url(), 'result-004'), uuid_generate_v5(uuid_ns_url(), 'team-nyeri-blind-strikers'), 'Samuel Nderitu', 61),
(uuid_generate_v5(uuid_ns_url(), 'result-005'), uuid_generate_v5(uuid_ns_url(), 'team-mombasa-sharks'), 'Ali Juma', 8),
(uuid_generate_v5(uuid_ns_url(), 'result-005'), uuid_generate_v5(uuid_ns_url(), 'team-mombasa-sharks'), 'Hassan Mwakio', 52),
(uuid_generate_v5(uuid_ns_url(), 'result-005'), uuid_generate_v5(uuid_ns_url(), 'team-tudor-tridents'), 'Omar Bakari', 29),
(uuid_generate_v5(uuid_ns_url(), 'result-005'), uuid_generate_v5(uuid_ns_url(), 'team-tudor-tridents'), 'Omar Bakari', 74);

-- result_cards
INSERT INTO result_cards (result_id, team_id, player_name, type, minute) VALUES
(uuid_generate_v5(uuid_ns_url(), 'result-001'), uuid_generate_v5(uuid_ns_url(), 'team-kibera-rangers'), 'Dennis Kioko', 'yellow', 71),
(uuid_generate_v5(uuid_ns_url(), 'result-005'), uuid_generate_v5(uuid_ns_url(), 'team-tudor-tridents'), 'Ibrahim Said', 'yellow', 65);

-- prediction_rounds (motm_votes/poll_votes intentionally left empty: the old mock
-- data stored aggregate counts, not per-account votes, so there is no real
-- account to attribute historical votes to under the normalized schema)
INSERT INTO prediction_rounds (id, fixture_id, status, closes_at, points_for_exact_score, points_for_correct_outcome) VALUES
(uuid_generate_v5(uuid_ns_url(), 'round-006'), uuid_generate_v5(uuid_ns_url(), 'fixture-006'), 'open', '2026-08-01T12:45:00Z', 3, 1),
(uuid_generate_v5(uuid_ns_url(), 'round-007'), uuid_generate_v5(uuid_ns_url(), 'fixture-007'), 'open', '2026-08-02T10:45:00Z', 3, 1),
(uuid_generate_v5(uuid_ns_url(), 'round-005'), uuid_generate_v5(uuid_ns_url(), 'fixture-005'), 'closed', '2026-07-28T13:30:00Z', 3, 1),
(uuid_generate_v5(uuid_ns_url(), 'round-001'), uuid_generate_v5(uuid_ns_url(), 'fixture-001'), 'settled', '2026-07-25T13:00:00Z', 3, 1);

-- match_polls
INSERT INTO match_polls (id, fixture_id, question, options) VALUES
(uuid_generate_v5(uuid_ns_url(), 'poll-fixture-005'), uuid_generate_v5(uuid_ns_url(), 'fixture-005'), 'Who takes it from here?', ARRAY['Mombasa Sharks RFC', 'Tudor Tridents', 'Draw']),
(uuid_generate_v5(uuid_ns_url(), 'poll-fixture-006'), uuid_generate_v5(uuid_ns_url(), 'fixture-006'), 'Who wins this one?', ARRAY['Kibera Rangers', 'Eldoret Eagles']),
(uuid_generate_v5(uuid_ns_url(), 'poll-fixture-001'), uuid_generate_v5(uuid_ns_url(), 'fixture-001'), 'Man of the match aside, best performance overall?', ARRAY['Nairobi Thunder FC', 'Kibera Rangers']);

-- match_comments (account_id left null: these are seeded/historical, not tied to a real signed-in account)
INSERT INTO match_comments (id, fixture_id, account_id, author_name, message, created_at) VALUES
(uuid_generate_v5(uuid_ns_url(), 'comment-001'), uuid_generate_v5(uuid_ns_url(), 'fixture-005'), NULL, 'Peter M.', 'What a second half! Mombasa''s defense is all over the place.', '2026-07-28T14:05:00Z'),
(uuid_generate_v5(uuid_ns_url(), 'comment-002'), uuid_generate_v5(uuid_ns_url(), 'fixture-005'), NULL, 'Aisha K.', 'Omar Bakari has been the best player on the pitch today.', '2026-07-28T14:12:00Z'),
(uuid_generate_v5(uuid_ns_url(), 'comment-003'), uuid_generate_v5(uuid_ns_url(), 'fixture-001'), NULL, 'Dennis O.', 'Brian Otieno fully deserved that MOTM, two goals and a great link-up play.', '2026-07-25T15:20:00Z'),
(uuid_generate_v5(uuid_ns_url(), 'comment-004'), uuid_generate_v5(uuid_ns_url(), 'fixture-001'), NULL, 'Faith N.', 'Kibera Rangers need to sort out their defending at set pieces.', '2026-07-25T15:32:00Z');
