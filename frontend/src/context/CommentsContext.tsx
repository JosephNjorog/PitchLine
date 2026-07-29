import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { MATCH_COMMENTS } from '../mock-data'
import type { MatchComment } from '../types'

interface CommentsContextValue {
  getCommentsForFixture: (fixtureId: string) => MatchComment[]
  addComment: (fixtureId: string, authorName: string, message: string) => void
}

const CommentsContext = createContext<CommentsContextValue | null>(null)

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [userComments, setUserComments] = useLocalStorage<MatchComment[]>('pitchline:comments', [])

  function getCommentsForFixture(fixtureId: string) {
    return [...MATCH_COMMENTS, ...userComments]
      .filter((comment) => comment.fixtureId === fixtureId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  function addComment(fixtureId: string, authorName: string, message: string) {
    const comment: MatchComment = {
      id: `comment-${Date.now()}`,
      fixtureId,
      authorName,
      message,
      createdAt: new Date().toISOString(),
    }
    setUserComments((prev) => [...prev, comment])
  }

  return (
    <CommentsContext.Provider value={{ getCommentsForFixture, addComment }}>
      {children}
    </CommentsContext.Provider>
  )
}

export function useComments() {
  const ctx = useContext(CommentsContext)
  if (!ctx) throw new Error('useComments must be used within CommentsProvider')
  return ctx
}
