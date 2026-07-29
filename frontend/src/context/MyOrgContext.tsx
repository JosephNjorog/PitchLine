import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiGet, apiPatch, apiPost, getToken } from '../lib/api'
import type { Sport } from '../types'

export interface MyOrg {
  id: string
  name: string
  kind: 'scout' | 'league'
  focusSports: Sport[]
  region: string
  jurisdictionTeamIds: string[]
  subscriptionStatus: 'trial' | 'active'
}

interface MyOrgContextValue {
  myOrg: MyOrg | null
  myOrgLoading: boolean
  registerOrg: (details: { name: string; kind: 'scout' | 'league'; focusSports: Sport[]; region: string }) => Promise<MyOrg>
  setJurisdictionTeams: (teamIds: string[]) => Promise<void>
  startTrial: () => Promise<void>
  activateSubscription: () => Promise<void>
}

const MyOrgContext = createContext<MyOrgContextValue | null>(null)

export function MyOrgProvider({ children }: { children: ReactNode }) {
  const [myOrg, setMyOrg] = useState<MyOrg | null>(null)
  const [myOrgLoading, setMyOrgLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setMyOrgLoading(false)
      return
    }
    apiGet<MyOrg>('/orgs/me')
      .then(setMyOrg)
      .catch(() => {})
      .finally(() => setMyOrgLoading(false))
  }, [])

  async function registerOrg(details: { name: string; kind: 'scout' | 'league'; focusSports: Sport[]; region: string }) {
    const org = await apiPost<MyOrg>('/orgs', details)
    setMyOrg(org)
    return org
  }

  async function setJurisdictionTeams(teamIds: string[]) {
    const org = await apiPatch<MyOrg>('/orgs/me/jurisdiction', { teamIds })
    setMyOrg(org)
  }

  async function startTrial() {
    await apiPost('/orgs/me/trial/start')
    setMyOrg((prev) => (prev ? { ...prev, subscriptionStatus: 'trial' } : prev))
  }

  async function activateSubscription() {
    await apiPost('/orgs/me/subscription/activate')
    setMyOrg((prev) => (prev ? { ...prev, subscriptionStatus: 'active' } : prev))
  }

  return (
    <MyOrgContext.Provider
      value={{ myOrg, myOrgLoading, registerOrg, setJurisdictionTeams, startTrial, activateSubscription }}
    >
      {children}
    </MyOrgContext.Provider>
  )
}

export function useMyOrg() {
  const ctx = useContext(MyOrgContext)
  if (!ctx) throw new Error('useMyOrg must be used within MyOrgProvider')
  return ctx
}
