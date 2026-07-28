import { Card } from '../../components/ui/Card'
import { LEADERBOARD_ENTRIES } from '../../mock-data'
import { useAuth } from '../../context/AuthContext'
import { useActivity } from '../../context/ActivityContext'

export function Leaderboard() {
  const { user } = useAuth()
  const { predictionEntries } = useActivity()
  const myPoints = predictionEntries.reduce((sum, entry) => sum + (entry.pointsAwarded ?? 0), 0)

  return (
    <Card className="flex flex-col gap-1">
      {LEADERBOARD_ENTRIES.map((entry) => (
        <div
          key={entry.accountId}
          className="flex items-center justify-between border-b border-ink-500/10 py-2.5 last:border-0"
        >
          <div className="flex items-center gap-3">
            <span className="w-5 text-sm font-bold text-ink-500">{entry.rank}</span>
            <span className="text-sm font-medium text-ink-900">{entry.displayName}</span>
          </div>
          <span className="text-sm font-semibold text-pitch-700">{entry.points} pts</span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2.5">
        <div className="flex items-center gap-3">
          <span className="w-5 text-sm font-bold text-ink-500">—</span>
          <span className="text-sm font-medium text-ink-900">{user?.name ?? 'You'}</span>
        </div>
        <span className="text-sm font-semibold text-pitch-700">{myPoints} pts</span>
      </div>
    </Card>
  )
}
