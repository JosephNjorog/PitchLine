import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiGet, apiPatch, apiPost, getToken } from '../lib/api'
import type { CardEvent, Fixture, Result, Scorer } from '../types'

interface SubmitResultInput {
  homeScore: number
  awayScore: number
  scorers: Scorer[]
  cards: CardEvent[]
  motmNominees: string[]
}

interface TeamOpsContextValue {
  fixtures: Fixture[]
  results: Result[]
  fixturesLoading: boolean
  createFixture: (
    homeTeamId: string,
    opponentTeamId: string,
    kickoffAt: string,
    venue: string,
    playedScore?: { homeScore: number; awayScore: number },
  ) => Promise<Fixture>
  updateFixture: (fixtureId: string, updates: { kickoffAt: string; venue: string }) => Promise<void>
  submitResult: (fixtureId: string, input: SubmitResultInput) => Promise<Result>
}

const TeamOpsContext = createContext<TeamOpsContextValue | null>(null)

export function TeamOpsProvider({ children }: { children: ReactNode }) {
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [fixturesLoading, setFixturesLoading] = useState(true)

  async function loadResults(fixtureList: Fixture[]) {
    const completed = fixtureList.filter((f) => f.status === 'completed' || f.status === 'live')
    const fetched = await Promise.all(
      completed.map((f) => apiGet<Result>(`/fixtures/${f.id}/result`, false).catch(() => null)),
    )
    setResults(fetched.filter((r): r is Result => r !== null))
  }

  useEffect(() => {
    if (!getToken()) {
      setFixturesLoading(false)
      return
    }
    apiGet<{ id: string }>('/me/team')
      .then(async (team) => {
        const teamFixtures = await apiGet<Fixture[]>(`/fixtures?teamIds=${team.id}`, false)
        setFixtures(teamFixtures)
        await loadResults(teamFixtures)
      })
      .catch(() => {})
      .finally(() => setFixturesLoading(false))
  }, [])

  async function createFixture(
    homeTeamId: string,
    opponentTeamId: string,
    kickoffAt: string,
    venue: string,
    playedScore?: { homeScore: number; awayScore: number },
  ) {
    const fixture = await apiPost<Fixture>('/fixtures', {
      homeTeamId,
      awayTeamId: opponentTeamId,
      kickoffAt,
      venue,
      result: playedScore,
    })
    setFixtures((prev) => [...prev, fixture])
    if (playedScore) {
      const result = await apiGet<Result>(`/fixtures/${fixture.id}/result`, false).catch(() => null)
      if (result) setResults((prev) => [...prev, result])
    }
    return fixture
  }

  async function updateFixture(fixtureId: string, updates: { kickoffAt: string; venue: string }) {
    const updated = await apiPatch<Fixture>(`/fixtures/${fixtureId}`, updates)
    setFixtures((prev) => prev.map((f) => (f.id === fixtureId ? updated : f)))
  }

  async function submitResult(fixtureId: string, input: SubmitResultInput) {
    const result = await apiPost<Result>(`/fixtures/${fixtureId}/result`, input)
    setFixtures((prev) => prev.map((f) => (f.id === fixtureId ? { ...f, status: 'completed' as const } : f)))
    setResults((prev) => [...prev.filter((r) => r.fixtureId !== fixtureId), result])
    return result
  }

  return (
    <TeamOpsContext.Provider
      value={{ fixtures, results, fixturesLoading, createFixture, updateFixture, submitResult }}
    >
      {children}
    </TeamOpsContext.Provider>
  )
}

export function useTeamOps() {
  const ctx = useContext(TeamOpsContext)
  if (!ctx) throw new Error('useTeamOps must be used within TeamOpsProvider')
  return ctx
}
