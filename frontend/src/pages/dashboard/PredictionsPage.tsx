import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { OpenRoundsList } from '../../features/predictions/OpenRoundsList'
import { Leaderboard } from '../../features/predictions/Leaderboard'
import { PastResultsList } from '../../features/predictions/PastResultsList'

type Tab = 'open' | 'leaderboard' | 'past'

const TABS: { id: Tab; label: string }[] = [
  { id: 'open', label: 'Open rounds' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'past', label: 'Past results' },
]

export function PredictionsPage() {
  const [tab, setTab] = useState<Tab>('open')

  return (
    <div className="flex flex-col gap-4 pb-4">
      <PageHeader title="Predictions" />
      <p className="px-4 text-xs text-ink-500">
        Free to play — predict scores for fun, no entry fee, no payout.
      </p>
      <div className="flex gap-2 px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold ${
              tab === t.id ? 'bg-pitch-900 text-white' : 'bg-ink-500/10 text-ink-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="px-4">
        {tab === 'open' && <OpenRoundsList />}
        {tab === 'leaderboard' && <Leaderboard />}
        {tab === 'past' && <PastResultsList />}
      </div>
    </div>
  )
}
