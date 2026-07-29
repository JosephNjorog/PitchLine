import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiDelete, apiGet, apiPost, getToken } from '../lib/api'

interface ShortlistContextValue {
  shortlistedTeamIds: string[]
  shortlistedAthleteIds: string[]
  toggleTeam: (teamId: string) => Promise<void>
  toggleAthlete: (athleteId: string) => Promise<void>
  isTeamShortlisted: (teamId: string) => boolean
  isAthleteShortlisted: (athleteId: string) => boolean
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null)

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [shortlistedTeamIds, setShortlistedTeamIds] = useState<string[]>([])
  const [shortlistedAthleteIds, setShortlistedAthleteIds] = useState<string[]>([])

  useEffect(() => {
    if (!getToken()) return
    apiGet<{ teamIds: string[]; athleteIds: string[] }>('/shortlist')
      .then(({ teamIds, athleteIds }) => {
        setShortlistedTeamIds(teamIds)
        setShortlistedAthleteIds(athleteIds)
      })
      .catch(() => {})
  }, [])

  async function toggleTeam(teamId: string) {
    const isShortlisted = shortlistedTeamIds.includes(teamId)
    setShortlistedTeamIds((prev) => (isShortlisted ? prev.filter((id) => id !== teamId) : [...prev, teamId]))
    try {
      if (isShortlisted) {
        await apiDelete(`/shortlist/teams/${teamId}`)
      } else {
        await apiPost(`/shortlist/teams/${teamId}`)
      }
    } catch {
      setShortlistedTeamIds((prev) => (isShortlisted ? [...prev, teamId] : prev.filter((id) => id !== teamId)))
    }
  }

  async function toggleAthlete(athleteId: string) {
    const isShortlisted = shortlistedAthleteIds.includes(athleteId)
    setShortlistedAthleteIds((prev) =>
      isShortlisted ? prev.filter((id) => id !== athleteId) : [...prev, athleteId],
    )
    try {
      if (isShortlisted) {
        await apiDelete(`/shortlist/athletes/${athleteId}`)
      } else {
        await apiPost(`/shortlist/athletes/${athleteId}`)
      }
    } catch {
      setShortlistedAthleteIds((prev) =>
        isShortlisted ? [...prev, athleteId] : prev.filter((id) => id !== athleteId),
      )
    }
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
