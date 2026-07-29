import { useState } from 'react'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatRelativeTime } from '../../lib/date'
import { useComments } from '../../context/CommentsContext'
import { useAuth } from '../../context/AuthContext'

export function MatchDiscussion({ fixtureId }: { fixtureId: string }) {
  const { getCommentsForFixture, addComment } = useComments()
  const { user } = useAuth()
  const [message, setMessage] = useState('')

  const comments = getCommentsForFixture(fixtureId)

  function handlePost() {
    if (!message.trim()) return
    addComment(fixtureId, user?.name ?? 'Fan', message.trim())
    setMessage('')
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Discussion</h2>

      {comments.length === 0 ? (
        <EmptyState icon="💬" title="No comments yet" description="Be the first to say something." />
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar name={comment.authorName} size={28} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-ink-900">{comment.authorName}</p>
                  <p className="text-xs text-ink-500">{formatRelativeTime(comment.createdAt)}</p>
                </div>
                <p className="text-sm text-ink-900">{comment.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handlePost()
          }}
          placeholder="Add a comment..."
          className="flex-1 rounded-xl border border-transparent bg-sand px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-500 focus:border-pitch-900/30 focus:ring-2 focus:ring-pitch-900/15"
        />
        <Button size="md" onClick={handlePost} disabled={!message.trim()}>
          Post
        </Button>
      </div>
    </Card>
  )
}
