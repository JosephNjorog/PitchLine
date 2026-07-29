import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { apiPost } from '../../lib/api'
import { useCatalog } from '../../context/CatalogContext'
import type { MatchPoll as MatchPollType } from '../../types'

export function MatchPoll({ poll }: { poll: MatchPollType }) {
  const { refetchPoll } = useCatalog()
  const [votedFor, setVotedFor] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function castVote(option: string) {
    if (votedFor || submitting) return
    setSubmitting(true)
    try {
      await apiPost(`/polls/${poll.id}/vote`, { optionLabel: option })
      setVotedFor(option)
      await refetchPoll(poll.fixtureId)
    } finally {
      setSubmitting(false)
    }
  }

  const totalVotes = Object.values(poll.votes).reduce((sum, v) => sum + v, 0)

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">{poll.question}</h2>
      <div className="flex flex-col gap-2">
        {poll.options.map((option) => {
          const count = poll.votes[option] ?? 0
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
          return (
            <button
              key={option}
              type="button"
              onClick={() => void castVote(option)}
              disabled={votedFor !== null || submitting}
              className="relative overflow-hidden rounded-xl border border-ink-500/15 px-3 py-2.5 text-left disabled:cursor-default"
            >
              <div className="absolute inset-y-0 left-0 bg-amber-600/15" style={{ width: `${pct}%` }} />
              <div className="relative flex items-center justify-between">
                <span className="text-sm font-medium text-ink-900">
                  {option}
                  {votedFor === option && ' ✓'}
                </span>
                <span className="text-xs text-ink-500">{pct}%</span>
              </div>
            </button>
          )
        })}
      </div>
      {votedFor ? (
        <p className="text-xs text-success">Thanks for voting!</p>
      ) : (
        <p className="text-xs text-ink-500">{totalVotes} fans have voted so far</p>
      )}
    </Card>
  )
}
