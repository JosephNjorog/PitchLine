import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiDelete, apiGet, apiPost, getToken } from '../lib/api'

interface FollowedTeamsContextValue {
  followedTeamIds: string[]
  follow: (teamId: string) => Promise<void>
  unfollow: (teamId: string) => Promise<void>
  followMany: (teamIds: string[]) => Promise<void>
  isFollowing: (teamId: string) => boolean
}

const FollowedTeamsContext = createContext<FollowedTeamsContextValue | null>(null)

export function FollowedTeamsProvider({ children }: { children: ReactNode }) {
  const [followedTeamIds, setFollowedTeamIds] = useState<string[]>([])

  useEffect(() => {
    if (!getToken()) return
    apiGet<{ teamIds: string[] }>('/me/followed-teams')
      .then(({ teamIds }) => setFollowedTeamIds(teamIds))
      .catch(() => {})
  }, [])

  async function follow(teamId: string) {
    setFollowedTeamIds((prev) => (prev.includes(teamId) ? prev : [...prev, teamId]))
    try {
      await apiPost(`/teams/${teamId}/follow`)
    } catch {
      setFollowedTeamIds((prev) => prev.filter((id) => id !== teamId))
    }
  }

  async function unfollow(teamId: string) {
    const prevIds = followedTeamIds
    setFollowedTeamIds((prev) => prev.filter((id) => id !== teamId))
    try {
      await apiDelete(`/teams/${teamId}/follow`)
    } catch {
      setFollowedTeamIds(prevIds)
    }
  }

  async function followMany(teamIds: string[]) {
    setFollowedTeamIds((prev) => Array.from(new Set([...prev, ...teamIds])))
    try {
      await apiPost('/me/followed-teams/bulk', { teamIds })
    } catch {
      // best-effort: local optimistic state stays even if the sync failed
    }
  }

  function isFollowing(teamId: string) {
    return followedTeamIds.includes(teamId)
  }

  return (
    <FollowedTeamsContext.Provider value={{ followedTeamIds, follow, unfollow, followMany, isFollowing }}>
      {children}
    </FollowedTeamsContext.Provider>
  )
}

export function useFollowedTeams() {
  const ctx = useContext(FollowedTeamsContext)
  if (!ctx) throw new Error('useFollowedTeams must be used within FollowedTeamsProvider')
  return ctx
}
