import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface ShortlistContextValue {
  shortlistedTeamIds: string[]
  shortlistedAthleteIds: string[]
  toggleTeam: (teamId: string) => void
  toggleAthlete: (athleteId: string) => void
  isTeamShortlisted: (teamId: string) => boolean
  isAthleteShortlisted: (athleteId: string) => boolean
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null)

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [shortlistedTeamIds, setShortlistedTeamIds] = useLocalStorage<string[]>(
    'pitchline:shortlistedTeams',
    [],
  )
  const [shortlistedAthleteIds, setShortlistedAthleteIds] = useLocalStorage<string[]>(
    'pitchline:shortlistedAthletes',
    [],
  )

  function toggleTeam(teamId: string) {
    setShortlistedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId],
    )
  }

  function toggleAthlete(athleteId: string) {
    setShortlistedAthleteIds((prev) =>
      prev.includes(athleteId) ? prev.filter((id) => id !== athleteId) : [...prev, athleteId],
    )
  }

  return (
    <ShortlistContext.Provider
      value={{
        shortlistedTeamIds,
        shortlistedAthleteIds,
        toggleTeam,
        toggleAthlete,
        isTeamShortlisted: (teamId) => shortlistedTeamIds.includes(teamId),
        isAthleteShortlisted: (athleteId) => shortlistedAthleteIds.includes(athleteId),
      }}
    >
      {children}
    </ShortlistContext.Provider>
  )
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext)
  if (!ctx) throw new Error('useShortlist must be used within ShortlistProvider')
  return ctx
}
