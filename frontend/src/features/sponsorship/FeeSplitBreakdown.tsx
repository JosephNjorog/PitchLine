import { Card } from '../../components/ui/Card'
import { formatKes } from '../../lib/currency'
import type { Sponsorship } from '../../types'

export function FeeSplitBreakdown({ sponsorship }: { sponsorship: Sponsorship }) {
  return (
    <Card className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-500">You sent</span>
        <span className="font-semibold text-ink-900">{formatKes(sponsorship.amount)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-500">Platform fee ({Math.round(sponsorship.platformFeePct * 100)}%)</span>
        <span className="text-ink-900">− {formatKes(sponsorship.platformFeeAmount)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-ink-500/10 pt-2.5 text-sm">
        <span className="font-semibold text-ink-900">Goes to {sponsorship.targetLabel}</span>
        <span className="font-bold text-success">{formatKes(sponsorship.netToTeamAmount)}</span>
      </div>
    </Card>
  )
}
