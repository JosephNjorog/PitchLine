import { Card } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { useCatalog } from '../../context/CatalogContext'
import { useAuth } from '../../context/AuthContext'
import { useActivity } from '../../context/ActivityContext'

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-500 text-white',
  2: 'bg-ink-500/30 text-white',
  3: 'bg-amber-800 text-white',
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
        RANK_STYLES[rank] ?? 'bg-sand text-ink-500'
      }`}
    >
      {rank}
    </span>
  )
}

export function Leaderboard() {
  const { leaderboardEntries } = useCatalog()
  const { user } = useAuth()
  const { predictionEntries } = useActivity()
  const myPoints = predictionEntries.reduce((sum, entry) => sum + (entry.pointsAwarded ?? 0), 0)

  return (
    <Card className="flex flex-col gap-1">
      {leaderboardEntries.map((entry) => (
        <div
          key={entry.accountId}
          className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0"
        >
          <div className="flex items-center gap-3">
            <RankBadge rank={entry.rank} />
            <Avatar name={entry.displayName} size={30} />
            <span className="text-sm font-semibold text-ink-900">{entry.displayName}</span>
          </div>
          <span className="text-sm font-black tabular-nums text-pitch-500">{entry.points} pts</span>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pitch-900/10 text-xs font-black text-pitch-900">
            —
          </span>
          <Avatar name={user?.name ?? 'You'} size={30} />
          <span className="text-sm font-semibold text-ink-900">{user?.name ?? 'You'}</span>
        </div>
        <span className="text-sm font-black tabular-nums text-pitch-500">{myPoints} pts</span>
      </div>
    </Card>
  )
}
