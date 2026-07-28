import type { PredictionRound } from '../types'

/**
 * Free-to-play score-prediction game: no entry fee, no payout.
 * Predicting is closed once a fixture goes live, and settled after full time.
 */
export const PREDICTION_ROUNDS: PredictionRound[] = [
  {
    id: 'round-006',
    fixtureId: 'fixture-006',
    status: 'open',
    closesAt: '2026-08-01T12:45:00Z',
    pointsForExactScore: 3,
    pointsForCorrectOutcome: 1,
  },
  {
    id: 'round-007',
    fixtureId: 'fixture-007',
    status: 'open',
    closesAt: '2026-08-02T10:45:00Z',
    pointsForExactScore: 3,
    pointsForCorrectOutcome: 1,
  },
  {
    id: 'round-005',
    fixtureId: 'fixture-005',
    status: 'closed',
    closesAt: '2026-07-28T13:30:00Z',
    pointsForExactScore: 3,
    pointsForCorrectOutcome: 1,
  },
  {
    id: 'round-001',
    fixtureId: 'fixture-001',
    status: 'settled',
    closesAt: '2026-07-25T13:00:00Z',
    pointsForExactScore: 3,
    pointsForCorrectOutcome: 1,
  },
]
