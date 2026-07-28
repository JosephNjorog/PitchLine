import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Sport } from '../types'

export interface MyOrg {
  name: string
  kind: 'scout' | 'league'
  focusSports: Sport[]
  region: string
  jurisdictionTeamIds: string[]
  subscriptionStatus: 'trial' | 'active'
}

interface MyOrgContextValue {
  myOrg: MyOrg | null
  registerOrg: (details: Omit<MyOrg, 'jurisdictionTeamIds' | 'subscriptionStatus'>) => void
  setJurisdictionTeams: (teamIds: string[]) => void
  startTrial: () => void
}

const MyOrgContext = createContext<MyOrgContextValue | null>(null)

export function MyOrgProvider({ children }: { children: ReactNode }) {
  const [myOrg, setMyOrg] = useLocalStorage<MyOrg | null>('pitchline:myOrg', null)

  function registerOrg(details: Omit<MyOrg, 'jurisdictionTeamIds' | 'subscriptionStatus'>) {
    setMyOrg({ ...details, jurisdictionTeamIds: [], subscriptionStatus: 'trial' })
  }

  function setJurisdictionTeams(teamIds: string[]) {
    setMyOrg((prev) => (prev ? { ...prev, jurisdictionTeamIds: teamIds } : prev))
  }

  function startTrial() {
    setMyOrg((prev) => (prev ? { ...prev, subscriptionStatus: 'trial' } : prev))
  }

  return (
    <MyOrgContext.Provider value={{ myOrg, registerOrg, setJurisdictionTeams, startTrial }}>
      {children}
    </MyOrgContext.Provider>
  )
}

export function useMyOrg() {
  const ctx = useContext(MyOrgContext)
  if (!ctx) throw new Error('useMyOrg must be used within MyOrgProvider')
  return ctx
}
