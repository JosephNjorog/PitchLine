import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiDelete, apiGet, apiPost, getToken } from '../lib/api'
import type { Player } from '../types'

interface RosterContextValue {
  players: Player[]
  addPlayer: (name: string, position: string, jerseyNumber?: number) => Promise<Player>
  removePlayer: (id: string) => Promise<void>
}

const RosterContext = createContext<RosterContextValue | null>(null)

export function RosterProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    if (!getToken()) return
    apiGet<Player[]>('/teams/me/players').then(setPlayers).catch(() => {})
  }, [])

  async function addPlayer(name: string, position: string, jerseyNumber?: number) {
    const player = await apiPost<Player>('/teams/me/players', { name, position, jerseyNumber })
    setPlayers((prev) => [...prev, player])
    return player
  }

  async function removePlayer(id: string) {
    setPlayers((prev) => prev.filter((player) => player.id !== id))
    try {
      await apiDelete(`/teams/me/players/${id}`)
    } catch {
      // best-effort
    }
  }

  return (
    <RosterContext.Provider value={{ players, addPlayer, removePlayer }}>
      {children}
    </RosterContext.Provider>
  )
}

export function useRoster() {
  const ctx = useContext(RosterContext)
  if (!ctx) throw new Error('useRoster must be used within RosterProvider')
  return ctx
}
