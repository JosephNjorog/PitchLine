import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiGet, apiPost, getToken } from '../lib/api'
import type { PredictionEntry, Sponsorship } from '../types'

interface ActivityContextValue {
  predictionEntries: PredictionEntry[]
  sponsorships: Sponsorship[]
  addPredictionEntry: (roundId: string, predictedHomeScore: number, predictedAwayScore: number) => Promise<PredictionEntry>
  addSponsorship: (targetType: 'team' | 'player', targetId: string, amount: number) => Promise<Sponsorship>
}

const ActivityContext = createContext<ActivityContextValue | null>(null)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [predictionEntries, setPredictionEntries] = useState<PredictionEntry[]>([])
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([])

  useEffect(() => {
    if (!getToken()) return
    apiGet<PredictionEntry[]>('/me/prediction-entries').then(setPredictionEntries).catch(() => {})
    apiGet<Sponsorship[]>('/me/sponsorships').then(setSponsorships).catch(() => {})
  }, [])

  async function addPredictionEntry(roundId: string, predictedHomeScore: number, predictedAwayScore: number) {
    const entry = await apiPost<PredictionEntry>(`/prediction-rounds/${roundId}/entries`, {
      predictedHomeScore,
      predictedAwayScore,
    })
    setPredictionEntries((prev) => [entry, ...prev.filter((e) => e.roundId !== roundId)])
    return entry
  }

  async function addSponsorship(targetType: 'team' | 'player', targetId: string, amount: number) {
    const sponsorship = await apiPost<Sponsorship>('/sponsorships', { targetType, targetId, amount })
    setSponsorships((prev) => [sponsorship, ...prev])
    return sponsorship
  }

  return (
    <ActivityContext.Provider value={{ predictionEntries, sponsorships, addPredictionEntry, addSponsorship }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const ctx = useContext(ActivityContext)
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider')
  return ctx
}
