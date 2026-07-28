import { createContext, useContext, useState, type ReactNode } from 'react'

interface OnboardingContextValue {
  selectedTeamIds: string[]
  toggleTeam: (teamId: string) => void
  reset: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([])

  function toggleTeam(teamId: string) {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId],
    )
  }

  function reset() {
    setSelectedTeamIds([])
  }

  return (
    <OnboardingContext.Provider value={{ selectedTeamIds, toggleTeam, reset }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}
