import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Fixture, Result } from '../types'

interface ScheduleFixtureInput {
  homeTeamId: string
  awayTeamId: string
  kickoffAt: string
  venue: string
  /** If the fixture has already been played, record the score immediately so it feeds standings. */
  playedScore?: { homeScore: number; awayScore: number }
}

interface AdminFixturesContextValue {
  fixtures: Fixture[]
  results: Result[]
  scheduleFixture: (input: ScheduleFixtureInput) => Fixture
}

const AdminFixturesContext = createContext<AdminFixturesContextValue | null>(null)

export function AdminFixturesProvider({ children }: { children: ReactNode }) {
  const [fixtures, setFixtures] = useLocalStorage<Fixture[]>('pitchline:adminFixtures', [])
  const [results, setResults] = useLocalStorage<Result[]>('pitchline:adminFixtureResults', [])

  function scheduleFixture(input: ScheduleFixtureInput) {
    const fixture: Fixture = {
      id: `adminfixture-${Date.now()}`,
      homeTeamId: input.homeTeamId,
      awayTeamId: input.awayTeamId,
      kickoffAt: input.kickoffAt,
      venue: input.venue,
      status: input.playedScore ? 'completed' : 'scheduled',
    }
    setFixtures((prev) => [...prev, fixture])

    if (input.playedScore) {
      const result: Result = {
        id: `adminresult-${Date.now()}`,
        fixtureId: fixture.id,
        homeScore: input.playedScore.homeScore,
        awayScore: input.playedScore.awayScore,
        scorers: [],
        cards: [],
        motmNominees: [],
        motmVotes: {},
      }
      setResults((prev) => [...prev, result])
    }

    return fixture
  }

  return (
    <AdminFixturesContext.Provider value={{ fixtures, results, scheduleFixture }}>
      {children}
    </AdminFixturesContext.Provider>
  )
}

export function useAdminFixtures() {
  const ctx = useContext(AdminFixturesContext)
  if (!ctx) throw new Error('useAdminFixtures must be used within AdminFixturesProvider')
  return ctx
}
