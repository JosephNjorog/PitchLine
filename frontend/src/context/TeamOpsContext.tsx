import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
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
  createFixture: (homeTeamId: string, opponentTeamId: string, kickoffAt: string, venue: string) => Fixture
  updateFixture: (fixtureId: string, updates: { kickoffAt: string; venue: string }) => void
  submitResult: (fixtureId: string, input: SubmitResultInput) => Result
}

const TeamOpsContext = createContext<TeamOpsContextValue | null>(null)

export function TeamOpsProvider({ children }: { children: ReactNode }) {
  const [fixtures, setFixtures] = useLocalStorage<Fixture[]>('pitchline:teamFixtures', [])
  const [results, setResults] = useLocalStorage<Result[]>('pitchline:teamResults', [])

  function createFixture(homeTeamId: string, opponentTeamId: string, kickoffAt: string, venue: string) {
    const fixture: Fixture = {
      id: `teamfixture-${Date.now()}`,
      homeTeamId,
      awayTeamId: opponentTeamId,
      kickoffAt,
      status: 'scheduled',
      venue,
    }
    setFixtures((prev) => [...prev, fixture])
    return fixture
  }

  function updateFixture(fixtureId: string, updates: { kickoffAt: string; venue: string }) {
    setFixtures((prev) =>
      prev.map((fixture) => (fixture.id === fixtureId ? { ...fixture, ...updates } : fixture)),
    )
  }

  function submitResult(fixtureId: string, input: SubmitResultInput) {
    setFixtures((prev) =>
      prev.map((fixture) =>
        fixture.id === fixtureId ? { ...fixture, status: 'completed' } : fixture,
      ),
    )
    const result: Result = {
      id: `teamresult-${Date.now()}`,
      fixtureId,
      homeScore: input.homeScore,
      awayScore: input.awayScore,
      scorers: input.scorers,
      cards: input.cards,
      motmNominees: input.motmNominees,
      motmVotes: Object.fromEntries(input.motmNominees.map((name) => [name, 0])),
    }
    setResults((prev) => [...prev, result])
    return result
  }

  return (
    <TeamOpsContext.Provider value={{ fixtures, results, createFixture, updateFixture, submitResult }}>
      {children}
    </TeamOpsContext.Provider>
  )
}

export function useTeamOps() {
  const ctx = useContext(TeamOpsContext)
  if (!ctx) throw new Error('useTeamOps must be used within TeamOpsProvider')
  return ctx
}
