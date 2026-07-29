import type { AgeGroup, Sport } from '../types'
import { TEAMS } from './teams'
import { FIXTURES } from './fixtures'
import { RESULTS } from './results'
import { PREDICTION_ROUNDS } from './predictionRounds'
import { LEADERBOARD_ENTRIES } from './leaderboard'
import { NOTIFICATIONS } from './notifications'
import { MATCH_POLLS } from './polls'
import { MATCH_COMMENTS } from './comments'
import { ATHLETES } from './athletes'

export {
  TEAMS,
  FIXTURES,
  RESULTS,
  PREDICTION_ROUNDS,
  LEADERBOARD_ENTRIES,
  NOTIFICATIONS,
  MATCH_POLLS,
  MATCH_COMMENTS,
  ATHLETES,
}

export const SPORTS: Sport[] = ['football', 'rugby', 'basketball', 'volleyball', 'netball', 'athletics']

export function getTeamById(id: string) {
  return TEAMS.find((team) => team.id === id)
}

export function getFixtureById(id: string) {
  return FIXTURES.find((fixture) => fixture.id === id)
}

export function getResultForFixture(fixtureId: string) {
  return RESULTS.find((result) => result.fixtureId === fixtureId)
}

export function getFixturesForTeams(teamIds: string[]) {
  const idSet = new Set(teamIds)
  return FIXTURES.filter((fixture) => idSet.has(fixture.homeTeamId) || idSet.has(fixture.awayTeamId))
}

export function getUpcomingFixtures(teamIds?: string[]) {
  const upcoming = FIXTURES.filter((fixture) => fixture.status === 'scheduled')
  if (!teamIds) return upcoming
  const idSet = new Set(teamIds)
  return upcoming.filter((fixture) => idSet.has(fixture.homeTeamId) || idSet.has(fixture.awayTeamId))
}

export function getCompletedFixtures(teamIds?: string[]) {
  const completed = FIXTURES.filter((fixture) => fixture.status === 'completed' || fixture.status === 'live')
  if (!teamIds) return completed
  const idSet = new Set(teamIds)
  return completed.filter((fixture) => idSet.has(fixture.homeTeamId) || idSet.has(fixture.awayTeamId))
}

export interface TeamSearchFilters {
  county?: string
  sport?: Sport
}

export function searchTeams(query: string, filters: TeamSearchFilters = {}) {
  const q = query.trim().toLowerCase()
  return TEAMS.filter((team) => {
    const matchesQuery =
      q.length === 0 ||
      team.name.toLowerCase().includes(q) ||
      team.county.toLowerCase().includes(q)
    const matchesCounty = !filters.county || team.county === filters.county
    const matchesSport = !filters.sport || team.sport === filters.sport
    return matchesQuery && matchesCounty && matchesSport
  })
}

export function getOpenPredictionRound(fixtureId: string) {
  return PREDICTION_ROUNDS.find((round) => round.fixtureId === fixtureId && round.status === 'open')
}

export function getPredictionRoundById(id: string) {
  return PREDICTION_ROUNDS.find((round) => round.id === id)
}

export function getOpenPredictionRounds() {
  return PREDICTION_ROUNDS.filter((round) => round.status === 'open')
}

export function getSettledPredictionRounds() {
  return PREDICTION_ROUNDS.filter((round) => round.status === 'settled')
}

export function getPollForFixture(fixtureId: string) {
  return MATCH_POLLS.find((poll) => poll.fixtureId === fixtureId)
}

export function getCounties() {
  return Array.from(new Set(TEAMS.map((team) => team.county))).sort()
}

export interface AthleteSearchFilters {
  county?: string
  sport?: Sport
  position?: string
  ageGroup?: AgeGroup
}

export function searchAthletes(query: string, filters: AthleteSearchFilters = {}) {
  const q = query.trim().toLowerCase()
  return ATHLETES.filter((athlete) => {
    const team = getTeamById(athlete.teamId)
    if (!team) return false
    const matchesQuery =
      q.length === 0 ||
      athlete.name.toLowerCase().includes(q) ||
      team.name.toLowerCase().includes(q)
    const matchesCounty = !filters.county || team.county === filters.county
    const matchesSport = !filters.sport || team.sport === filters.sport
    const matchesPosition = !filters.position || athlete.position === filters.position
    const matchesAgeGroup = !filters.ageGroup || athlete.ageGroup === filters.ageGroup
    return matchesQuery && matchesCounty && matchesSport && matchesPosition && matchesAgeGroup
  })
}

export function getPositions() {
  return Array.from(new Set(ATHLETES.map((athlete) => athlete.position))).sort()
}
