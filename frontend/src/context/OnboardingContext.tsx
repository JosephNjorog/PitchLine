import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Sport } from '../types'

export interface TeamDraft {
  name: string
  sport: Sport
  county: string
  category: 'standard' | 'adaptive'
  disabilityCategory: string
  phone: string
}

export interface OrgDraft {
  name: string
  kind: 'scout' | 'league'
  focusSports: Sport[]
  region: string
}

const EMPTY_TEAM_DRAFT: TeamDraft = {
  name: '',
  sport: 'football',
  county: '',
  category: 'standard',
  disabilityCategory: '',
  phone: '',
}

const EMPTY_ORG_DRAFT: OrgDraft = {
  name: '',
  kind: 'scout',
  focusSports: [],
  region: '',
}

interface OnboardingContextValue {
  selectedTeamIds: string[]
  toggleTeam: (teamId: string) => void

  teamDraft: TeamDraft
  updateTeamDraft: (patch: Partial<TeamDraft>) => void

  orgDraft: OrgDraft
  updateOrgDraft: (patch: Partial<OrgDraft>) => void
  jurisdictionTeamIds: string[]
  toggleJurisdictionTeam: (teamId: string) => void

  reset: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([])
  const [teamDraft, setTeamDraft] = useState<TeamDraft>(EMPTY_TEAM_DRAFT)
  const [orgDraft, setOrgDraft] = useState<OrgDraft>(EMPTY_ORG_DRAFT)
  const [jurisdictionTeamIds, setJurisdictionTeamIds] = useState<string[]>([])

  function toggleTeam(teamId: string) {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId],
    )
  }

  function updateTeamDraft(patch: Partial<TeamDraft>) {
    setTeamDraft((prev) => ({ ...prev, ...patch }))
  }

  function updateOrgDraft(patch: Partial<OrgDraft>) {
    setOrgDraft((prev) => ({ ...prev, ...patch }))
  }

  function toggleJurisdictionTeam(teamId: string) {
    setJurisdictionTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId],
    )
  }

  function reset() {
    setSelectedTeamIds([])
    setTeamDraft(EMPTY_TEAM_DRAFT)
    setOrgDraft(EMPTY_ORG_DRAFT)
    setJurisdictionTeamIds([])
  }

  return (
    <OnboardingContext.Provider
      value={{
        selectedTeamIds,
        toggleTeam,
        teamDraft,
        updateTeamDraft,
        orgDraft,
        updateOrgDraft,
        jurisdictionTeamIds,
        toggleJurisdictionTeam,
        reset,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}
