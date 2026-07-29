import { createContext, useContext, useState, type ReactNode } from 'react'
import { apiGet, apiPost } from '../lib/api'
import type { MatchComment } from '../types'

interface CommentsContextValue {
  commentsByFixtureId: Record<string, MatchComment[]>
  fetchComments: (fixtureId: string) => Promise<void>
  addComment: (fixtureId: string, message: string) => Promise<void>
}

const CommentsContext = createContext<CommentsContextValue | null>(null)

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [commentsByFixtureId, setCommentsByFixtureId] = useState<Record<string, MatchComment[]>>({})

  async function fetchComments(fixtureId: string) {
    try {
      const comments = await apiGet<MatchComment[]>(`/fixtures/${fixtureId}/comments`, false)
      setCommentsByFixtureId((prev) => ({ ...prev, [fixtureId]: comments }))
    } catch {
      // best-effort
    }
  }

  async function addComment(fixtureId: string, message: string) {
    const comment = await apiPost<MatchComment>(`/fixtures/${fixtureId}/comments`, { message })
    setCommentsByFixtureId((prev) => ({
      ...prev,
      [fixtureId]: [...(prev[fixtureId] ?? []), comment],
    }))
  }

  return (
    <CommentsContext.Provider value={{ commentsByFixtureId, fetchComments, addComment }}>
      {children}
    </CommentsContext.Provider>
  )
}

export function useComments() {
  const ctx = useContext(CommentsContext)
  if (!ctx) throw new Error('useComments must be used within CommentsProvider')
  return ctx
}
