import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import type { Result } from '../../types'

export function MotmVote({ result }: { result: Result }) {
  const [votes, setVotes] = useState(result.motmVotes)
  const [votedFor, setVotedFor] = useState<string | null>(null)

  if (result.motmNominees.length === 0) return null

  function castVote(nominee: string) {
    if (votedFor) return
    setVotes((prev) => ({ ...prev, [nominee]: (prev[nominee] ?? 0) + 1 }))
    setVotedFor(nominee)
  }

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0)

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
        Man of the match
      </h2>
      <div className="flex flex-col gap-2">
        {result.motmNominees.map((nominee) => {
          const count = votes[nominee] ?? 0
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
          return (
            <button
              key={nominee}
              type="button"
              onClick={() => castVote(nominee)}
              disabled={votedFor !== null}
              className="relative overflow-hidden rounded-xl border border-ink-500/15 px-3 py-2.5 text-left disabled:cursor-default"
            >
              <div
                className="absolute inset-y-0 left-0 bg-pitch-900/10"
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex items-center justify-between">
                <span className="text-sm font-medium text-ink-900">
                  {nominee}
                  {votedFor === nominee && ' ✓'}
                </span>
                <span className="text-xs text-ink-500">{pct}%</span>
              </div>
            </button>
          )
        })}
      </div>
      {votedFor && <p className="text-xs text-success">Thanks for voting!</p>}
    </Card>
  )
}
