import type { MatchPoll } from '../types'

export const MATCH_POLLS: MatchPoll[] = [
  {
    id: 'poll-fixture-005',
    fixtureId: 'fixture-005',
    question: 'Who takes it from here?',
    options: ['Mombasa Sharks RFC', 'Tudor Tridents', 'Draw'],
    votes: { 'Mombasa Sharks RFC': 18, 'Tudor Tridents': 14, Draw: 9 },
  },
  {
    id: 'poll-fixture-006',
    fixtureId: 'fixture-006',
    question: 'Who wins this one?',
    options: ['Kibera Rangers', 'Eldoret Eagles'],
    votes: { 'Kibera Rangers': 22, 'Eldoret Eagles': 27 },
  },
  {
    id: 'poll-fixture-001',
    fixtureId: 'fixture-001',
    question: 'Man of the match aside, best performance overall?',
    options: ['Nairobi Thunder FC', 'Kibera Rangers'],
    votes: { 'Nairobi Thunder FC': 41, 'Kibera Rangers': 12 },
  },
]
