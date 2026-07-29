DELETE FROM match_comments WHERE fixture_id IN (
  SELECT uuid_generate_v5(uuid_ns_url(), x) FROM unnest(ARRAY['fixture-001','fixture-002','fixture-003','fixture-004','fixture-005','fixture-006','fixture-007','fixture-008','fixture-009']) x
);
DELETE FROM match_polls;
DELETE FROM prediction_rounds;
DELETE FROM result_cards;
DELETE FROM result_scorers;
DELETE FROM results;
DELETE FROM fixtures;
DELETE FROM athletes;
DELETE FROM teams;
