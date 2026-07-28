import type { Fixture } from '../types'

export const FIXTURES: Fixture[] = [
  // Completed
  {
    id: 'fixture-001',
    homeTeamId: 'team-nairobi-thunder',
    awayTeamId: 'team-kibera-rangers',
    kickoffAt: '2026-07-25T13:00:00Z',
    status: 'completed',
    venue: 'City Stadium, Nairobi',
  },
  {
    id: 'fixture-002',
    homeTeamId: 'team-eldoret-eagles',
    awayTeamId: 'team-machakos-hills',
    kickoffAt: '2026-07-26T11:00:00Z',
    status: 'completed',
    venue: 'Kipchoge Keino Stadium',
  },
  {
    id: 'fixture-003',
    homeTeamId: 'team-nyalenda-queens',
    awayTeamId: 'team-kisumu-lakers',
    kickoffAt: '2026-07-26T14:30:00Z',
    status: 'completed',
    venue: 'Moi Stadium, Kisumu',
  },
  {
    id: 'fixture-004',
    homeTeamId: 'team-nakuru-warriors',
    awayTeamId: 'team-nyeri-blind-strikers',
    kickoffAt: '2026-07-27T10:00:00Z',
    status: 'completed',
    venue: 'Afraha Stadium, Nakuru',
  },
  // Live
  {
    id: 'fixture-005',
    homeTeamId: 'team-mombasa-sharks',
    awayTeamId: 'team-tudor-tridents',
    kickoffAt: '2026-07-28T13:30:00Z',
    status: 'live',
    venue: 'Mbaraki Sports Club, Mombasa',
  },
  // Scheduled / upcoming
  {
    id: 'fixture-006',
    homeTeamId: 'team-kibera-rangers',
    awayTeamId: 'team-eldoret-eagles',
    kickoffAt: '2026-08-01T13:00:00Z',
    status: 'scheduled',
    venue: 'City Stadium, Nairobi',
  },
  {
    id: 'fixture-007',
    homeTeamId: 'team-eldoret-wheelchair-hoopers',
    awayTeamId: 'team-kisumu-lakers',
    kickoffAt: '2026-08-02T11:00:00Z',
    status: 'scheduled',
    venue: 'Eldoret Sports Club',
  },
  {
    id: 'fixture-008',
    homeTeamId: 'team-rift-valley-blazers',
    awayTeamId: 'team-kakamega-forest-runners',
    kickoffAt: '2026-08-03T09:00:00Z',
    status: 'scheduled',
    venue: 'Nakuru ASK Showground',
  },
  {
    id: 'fixture-009',
    homeTeamId: 'team-kitale-comets',
    awayTeamId: 'team-tudor-tridents',
    kickoffAt: '2026-08-04T14:00:00Z',
    status: 'scheduled',
    venue: 'Kitale Social Hall',
  },
]
