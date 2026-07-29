import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Team } from '../types'

interface MyTeamContextValue {
  myTeam: Team | null
  registerTeam: (details: Omit<Team, 'id' | 'followerCount' | 'followCode'>) => Team
}

const MyTeamContext = createContext<MyTeamContextValue | null>(null)

function generateFollowCode(name: string) {
  const prefix = name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase().padEnd(3, 'X')
  const suffix = String(Date.now()).slice(-4)
  return `${prefix}${suffix}`
}

export function MyTeamProvider({ children }: { children: ReactNode }) {
  const [myTeam, setMyTeam] = useLocalStorage<Team | null>('pitchline:myTeam', null)

  function registerTeam(details: Omit<Team, 'id' | 'followerCount' | 'followCode'>) {
    const team: Team = {
      ...details,
      id: `myteam-${Date.now()}`,
      followerCount: 0,
      followCode: generateFollowCode(details.name),
    }
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
