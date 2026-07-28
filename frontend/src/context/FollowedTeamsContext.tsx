import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface FollowedTeamsContextValue {
  followedTeamIds: string[]
  follow: (teamId: string) => void
  unfollow: (teamId: string) => void
  followMany: (teamIds: string[]) => void
  isFollowing: (teamId: string) => boolean
}

const FollowedTeamsContext = createContext<FollowedTeamsContextValue | null>(null)

export function FollowedTeamsProvider({ children }: { children: ReactNode }) {
  const [followedTeamIds, setFollowedTeamIds] = useLocalStorage<string[]>(
    'pitchline:followedTeams',
    [],
  )

  function follow(teamId: string) {
    setFollowedTeamIds((prev) => (prev.includes(teamId) ? prev : [...prev, teamId]))
  }

  function unfollow(teamId: string) {
    setFollowedTeamIds((prev) => prev.filter((id) => id !== teamId))
  }

  function followMany(teamIds: string[]) {
    setFollowedTeamIds((prev) => Array.from(new Set([...prev, ...teamIds])))
  }

  function isFollowing(teamId: string) {
    return followedTeamIds.includes(teamId)
  }

  return (
    <FollowedTeamsContext.Provider
      value={{ followedTeamIds, follow, unfollow, followMany, isFollowing }}
    >
      {children}
    </FollowedTeamsContext.Provider>
  )
}

export function useFollowedTeams() {
  const ctx = useContext(FollowedTeamsContext)
  if (!ctx) throw new Error('useFollowedTeams must be used within FollowedTeamsProvider')
  return ctx
}
