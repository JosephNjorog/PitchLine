import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiGet } from '../lib/api'
import type {
  AgeGroup,
  Athlete,
  Fixture,
  LeaderboardEntry,
  MatchPoll,
  PredictionRound,
  Result,
  Sport,
  Team,
} from '../types'

interface CatalogState {
  teams: Team[]
  athletes: Athlete[]
  fixtures: Fixture[]
  resultsByFixtureId: Record<string, Result>
  pollsByFixtureId: Record<string, MatchPoll>
  predictionRounds: PredictionRound[]
  leaderboardEntries: LeaderboardEntry[]
}

const EMPTY_STATE: CatalogState = {
  teams: [],
  athletes: [],
  fixtures: [],
  resultsByFixtureId: {},
  pollsByFixtureId: {},
  predictionRounds: [],
  leaderboardEntries: [],
}

export interface TeamSearchFilters {
  county?: string
  sport?: Sport
}

export interface AthleteSearchFilters {
  county?: string
  sport?: Sport
  position?: string
  ageGroup?: AgeGroup
}

interface CatalogContextValue extends CatalogState {
  catalogLoading: boolean
  getTeamById: (id: string) => Team | undefined
  getFixtureById: (id: string) => Fixture | undefined
  getResultForFixture: (fixtureId: string) => Result | undefined
  getFixturesForTeams: (teamIds: string[]) => Fixture[]
  getUpcomingFixtures: (teamIds?: string[]) => Fixture[]
  getCompletedFixtures: (teamIds?: string[]) => Fixture[]
  searchTeams: (query: string, filters?: TeamSearchFilters) => Team[]
  getOpenPredictionRound: (fixtureId: string) => PredictionRound | undefined
  getPredictionRoundById: (id: string) => PredictionRound | undefined
  getOpenPredictionRounds: () => PredictionRound[]
  getSettledPredictionRounds: () => PredictionRound[]
  getPollForFixture: (fixtureId: string) => MatchPoll | undefined
  getCounties: () => string[]
  searchAthletes: (query: string, filters?: AthleteSearchFilters) => Athlete[]
  getPositions: () => string[]
  refetchResult: (fixtureId: string) => Promise<void>
  refetchPoll: (fixtureId: string) => Promise<void>
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

async function safeGet<T>(path: string): Promise<T | null> {
  try {
    return await apiGet<T>(path, false)
  } catch {
    return null
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(EMPTY_STATE)
  const [catalogLoading, setCatalogLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [teams, athletes, fixtures, openRounds, settledRounds, leaderboardEntries] = await Promise.all([
        safeGet<Team[]>('/teams'),
        safeGet<Athlete[]>('/athletes'),
        safeGet<Fixture[]>('/fixtures'),
        safeGet<PredictionRound[]>('/prediction-rounds/open'),
        safeGet<PredictionRound[]>('/prediction-rounds/settled'),
        safeGet<LeaderboardEntry[]>('/leaderboard'),
      ])

      const fixtureList = fixtures ?? []
      const [results, polls] = await Promise.all([
        Promise.all(fixtureList.map((f) => safeGet<Result>(`/fixtures/${f.id}/result`))),
        Promise.all(fixtureList.map((f) => safeGet<MatchPoll>(`/fixtures/${f.id}/poll`))),
      ])

      const resultsByFixtureId: Record<string, Result> = {}
      fixtureList.forEach((f, i) => {
        if (results[i]) resultsByFixtureId[f.id] = results[i]!
      })
      const pollsByFixtureId: Record<string, MatchPoll> = {}
      fixtureList.forEach((f, i) => {
        if (polls[i]) pollsByFixtureId[f.id] = polls[i]!
      })

      if (cancelled) return
      setState({
        teams: teams ?? [],
        athletes: athletes ?? [],
        fixtures: fixtureList,
        resultsByFixtureId,
        pollsByFixtureId,
        predictionRounds: [...(openRounds ?? []), ...(settledRounds ?? [])],
        leaderboardEntries: leaderboardEntries ?? [],
      })
      setCatalogLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  async function refetchResult(fixtureId: string) {
    const result = await safeGet<Result>(`/fixtures/${fixtureId}/result`)
    if (result) {
      setState((prev) => ({ ...prev, resultsByFixtureId: { ...prev.resultsByFixtureId, [fixtureId]: result } }))
    }
  }

  async function refetchPoll(fixtureId: string) {
    const poll = await safeGet<MatchPoll>(`/fixtures/${fixtureId}/poll`)
    if (poll) {
      setState((prev) => ({ ...prev, pollsByFixtureId: { ...prev.pollsByFixtureId, [fixtureId]: poll } }))
    }
  }

  function getTeamById(id: string) {
    return state.teams.find((t) => t.id === id)
  }

  function getFixtureById(id: string) {
    return state.fixtures.find((f) => f.id === id)
  }

  function getResultForFixture(fixtureId: string) {
    return state.resultsByFixtureId[fixtureId]
  }

  function getFixturesForTeams(teamIds: string[]) {
    const idSet = new Set(teamIds)
    return state.fixtures.filter((f) => idSet.has(f.homeTeamId) || idSet.has(f.awayTeamId))
  }

  function getUpcomingFixtures(teamIds?: string[]) {
    const upcoming = state.fixtures.filter((f) => f.status === 'scheduled')
    if (!teamIds) return upcoming
    const idSet = new Set(teamIds)
    return upcoming.filter((f) => idSet.has(f.homeTeamId) || idSet.has(f.awayTeamId))
  }

  function getCompletedFixtures(teamIds?: string[]) {
    const completed = state.fixtures.filter((f) => f.status === 'completed' || f.status === 'live')
    if (!teamIds) return completed
    const idSet = new Set(teamIds)
    return completed.filter((f) => idSet.has(f.homeTeamId) || idSet.has(f.awayTeamId))
  }

  function searchTeams(query: string, filters: TeamSearchFilters = {}) {
    const q = query.trim().toLowerCase()
    return state.teams.filter((team) => {
      const matchesQuery = q.length === 0 || team.name.toLowerCase().includes(q) || team.county.toLowerCase().includes(q)
      const matchesCounty = !filters.county || team.county === filters.county
      const matchesSport = !filters.sport || team.sport === filters.sport
      return matchesQuery && matchesCounty && matchesSport
    })
  }

  function getOpenPredictionRound(fixtureId: string) {
    return state.predictionRounds.find((r) => r.fixtureId === fixtureId && r.status === 'open')
  }

  function getPredictionRoundById(id: string) {
    return state.predictionRounds.find((r) => r.id === id)
  }

  function getOpenPredictionRounds() {
    return state.predictionRounds.filter((r) => r.status === 'open')
  }

  function getSettledPredictionRounds() {
    return state.predictionRounds.filter((r) => r.status === 'settled')
  }

  function getPollForFixture(fixtureId: string) {
    return state.pollsByFixtureId[fixtureId]
  }

  function getCounties() {
    return Array.from(new Set(state.teams.map((t) => t.county))).sort()
  }

  function searchAthletes(query: string, filters: AthleteSearchFilters = {}) {
    const q = query.trim().toLowerCase()
    return state.athletes.filter((athlete) => {
      const team = getTeamById(athlete.teamId)
      if (!team) return false
      const matchesQuery = q.length === 0 || athlete.name.toLowerCase().includes(q) || team.name.toLowerCase().includes(q)
      const matchesCounty = !filters.county || team.county === filters.county
      const matchesSport = !filters.sport || team.sport === filters.sport
      const matchesPosition = !filters.position || athlete.position === filters.position
      const matchesAgeGroup = !filters.ageGroup || athlete.ageGroup === filters.ageGroup
      return matchesQuery && matchesCounty && matchesSport && matchesPosition && matchesAgeGroup
    })
  }

  function getPositions() {
    return Array.from(new Set(state.athletes.map((a) => a.position))).sort()
  }

  return (
    <CatalogContext.Provider
      value={{
        ...state,
        catalogLoading,
        getTeamById,
        getFixtureById,
        getResultForFixture,
        getFixturesForTeams,
        getUpcomingFixtures,
        getCompletedFixtures,
        searchTeams,
        getOpenPredictionRound,
        getPredictionRoundById,
        getOpenPredictionRounds,
        getSettledPredictionRounds,
        getPollForFixture,
        getCounties,
        searchAthletes,
        getPositions,
        refetchResult,
        refetchPoll,
      }}
    >
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
