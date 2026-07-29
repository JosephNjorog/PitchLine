export type Sport =
  | 'football'
  | 'rugby'
  | 'basketball'
  | 'volleyball'
  | 'netball'
  | 'athletics'

export type Role = 'fan' | 'team' | 'scout' | 'league'

export interface Team {
  id: string
  name: string
  county: string
  sport: Sport
  category: 'standard' | 'adaptive'
  disabilityCategory?: string
  crestColor: string
  followerCount: number
}

export interface Fixture {
  id: string
  homeTeamId: string
  awayTeamId: string
  kickoffAt: string
  status: 'scheduled' | 'live' | 'completed'
  venue?: string
}

export interface Scorer {
  teamId: string
  playerName: string
  minute?: number
}

export interface CardEvent {
  teamId: string
  playerName: string
  type: 'yellow' | 'red'
  minute?: number
}

export interface Result {
  id: string
  fixtureId: string
  homeScore: number
  awayScore: number
  scorers: Scorer[]
  cards: CardEvent[]
  motmNominees: string[]
  motmVotes: Record<string, number>
}

/** Free-to-play prediction game: points and leaderboard only, no entry fee, no money changes hands. */
export interface PredictionRound {
  id: string
  fixtureId: string
  status: 'open' | 'closed' | 'settled'
  closesAt: string
  pointsForExactScore: number
  pointsForCorrectOutcome: number
}

export interface PredictionEntry {
  id: string
  roundId: string
  accountId: string
  predictedHomeScore: number
  predictedAwayScore: number
  submittedAt: string
  pointsAwarded?: number
}

export interface LeaderboardEntry {
  accountId: string
  displayName: string
  points: number
  rank: number
}

/** Sponsorship is the real monetization rail: a fan sending money to a team/player. */
export interface Sponsorship {
  id: string
  accountId: string
  targetType: 'team' | 'player'
  targetId: string
  targetLabel: string
  amount: number
  platformFeePct: number
  platformFeeAmount: number
  netToTeamAmount: number
  createdAt: string
}

export interface MatchComment {
  id: string
  fixtureId: string
  authorName: string
  message: string
  createdAt: string
}

export interface MatchPoll {
  id: string
  fixtureId: string
  question: string
  options: string[]
  votes: Record<string, number>
}

export interface AppNotification {
  id: string
  type: 'result' | 'fixture' | 'prediction' | 'sponsorship'
  message: string
  createdAt: string
}

export interface Account {
  id: string
  name: string
  email?: string
  phone?: string
  role: Role | null
}
