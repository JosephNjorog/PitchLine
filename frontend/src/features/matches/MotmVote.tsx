import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { apiPost } from '../../lib/api'
import { useCatalog } from '../../context/CatalogContext'
import type { Result } from '../../types'

export function MotmVote({ result }: { result: Result }) {
  const { refetchResult } = useCatalog()
  const [votedFor, setVotedFor] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (result.motmNominees.length === 0) return null

  async function castVote(nominee: string) {
    if (votedFor || submitting) return
    setSubmitting(true)
    try {
      await apiPost(`/results/${result.id}/motm-vote`, { nomineeName: nominee })
      setVotedFor(nominee)
      await refetchResult(result.fixtureId)
    } finally {
      setSubmitting(false)
    }
  }

  const totalVotes = Object.values(result.motmVotes).reduce((sum, v) => sum + v, 0)

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
        Man of the match
      </h2>
      <div className="flex flex-col gap-2">
        {result.motmNominees.map((nominee) => {
          const count = result.motmVotes[nominee] ?? 0
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
          return (
            <button
              key={nominee}
              type="button"
              onClick={() => void castVote(nominee)}
              disabled={votedFor !== null || submitting}
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
