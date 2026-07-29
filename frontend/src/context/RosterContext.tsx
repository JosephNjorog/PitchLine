import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Player } from '../types'

interface RosterContextValue {
  players: Player[]
  addPlayer: (name: string, position: string, jerseyNumber?: number) => Player
  removePlayer: (id: string) => void
}

const RosterContext = createContext<RosterContextValue | null>(null)

export function RosterProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useLocalStorage<Player[]>('pitchline:roster', [])

  function addPlayer(name: string, position: string, jerseyNumber?: number) {
    const player: Player = { id: `player-${Date.now()}`, name, position, jerseyNumber }
    setPlayers((prev) => [...prev, player])
    return player
  }

  function removePlayer(id: string) {
    setPlayers((prev) => prev.filter((player) => player.id !== id))
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
