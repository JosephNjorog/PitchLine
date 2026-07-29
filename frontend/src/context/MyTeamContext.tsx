import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiGet, apiPost, getToken } from '../lib/api'
import type { Team } from '../types'

interface MyTeamContextValue {
  myTeam: Team | null
  myTeamLoading: boolean
  registerTeam: (details: Omit<Team, 'id' | 'followerCount' | 'followCode'>) => Promise<Team>
}

const MyTeamContext = createContext<MyTeamContextValue | null>(null)

export function MyTeamProvider({ children }: { children: ReactNode }) {
  const [myTeam, setMyTeam] = useState<Team | null>(null)
  const [myTeamLoading, setMyTeamLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setMyTeamLoading(false)
      return
    }
    apiGet<Team>('/me/team')
      .then(setMyTeam)
      .catch(() => {})
      .finally(() => setMyTeamLoading(false))
  }, [])

  async function registerTeam(details: Omit<Team, 'id' | 'followerCount' | 'followCode'>) {
    const team = await apiPost<Team>('/teams', details)
    setMyTeam(team)
    return team
  }

  return (
    <MyTeamContext.Provider value={{ myTeam, myTeamLoading, registerTeam }}>{children}</MyTeamContext.Provider>
  )
}

export function useMyTeam() {
  const ctx = useContext(MyTeamContext)
  if (!ctx) throw new Error('useMyTeam must be used within MyTeamProvider')
  return ctx
}
