import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Team } from '../types'

interface MyTeamContextValue {
  myTeam: Team | null
  registerTeam: (details: Omit<Team, 'id' | 'followerCount'>) => Team
}

const MyTeamContext = createContext<MyTeamContextValue | null>(null)

export function MyTeamProvider({ children }: { children: ReactNode }) {
  const [myTeam, setMyTeam] = useLocalStorage<Team | null>('pitchline:myTeam', null)

  function registerTeam(details: Omit<Team, 'id' | 'followerCount'>) {
    const team: Team = { ...details, id: `myteam-${Date.now()}`, followerCount: 0 }
    setMyTeam(team)
    return team
  }

  return <MyTeamContext.Provider value={{ myTeam, registerTeam }}>{children}</MyTeamContext.Provider>
}

export function useMyTeam() {
  const ctx = useContext(MyTeamContext)
  if (!ctx) throw new Error('useMyTeam must be used within MyTeamProvider')
  return ctx
}
