import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { PredictionEntry, Sponsorship } from '../types'

interface ActivityContextValue {
  predictionEntries: PredictionEntry[]
  sponsorships: Sponsorship[]
  addPredictionEntry: (entry: Omit<PredictionEntry, 'id' | 'submittedAt'>) => PredictionEntry
  addSponsorship: (sponsorship: Omit<Sponsorship, 'id' | 'createdAt'>) => Sponsorship
}

const ActivityContext = createContext<ActivityContextValue | null>(null)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [predictionEntries, setPredictionEntries] = useLocalStorage<PredictionEntry[]>(
    'pitchline:predictionEntries',
    [],
  )
  const [sponsorships, setSponsorships] = useLocalStorage<Sponsorship[]>(
    'pitchline:sponsorships',
    [],
  )

  function addPredictionEntry(entry: Omit<PredictionEntry, 'id' | 'submittedAt'>) {
    const full: PredictionEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    }
    setPredictionEntries((prev) => [full, ...prev])
    return full
  }

  function addSponsorship(sponsorship: Omit<Sponsorship, 'id' | 'createdAt'>) {
    const full: Sponsorship = {
      ...sponsorship,
      id: `sponsorship-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setSponsorships((prev) => [full, ...prev])
    return full
  }

  return (
    <ActivityContext.Provider
      value={{ predictionEntries, sponsorships, addPredictionEntry, addSponsorship }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const ctx = useContext(ActivityContext)
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider')
  return ctx
}
