import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { formatKickoff, formatRelativeTime } from '../../lib/date'
import { getResultForFixture, getTeamById } from '../../mock-data'
import type { Fixture } from '../../types'

export function MatchCard({ fixture }: { fixture: Fixture }) {
  const navigate = useNavigate()
  const homeTeam = getTeamById(fixture.homeTeamId)
  const awayTeam = getTeamById(fixture.awayTeamId)
  const result = getResultForFixture(fixture.id)
  if (!homeTeam || !awayTeam) return null

  const badgeTone = fixture.status === 'live' ? 'live' : fixture.status === 'completed' ? 'completed' : 'scheduled'
  const badgeLabel =
    fixture.status === 'live' ? 'Live' : fixture.status === 'completed' ? 'Full time' : 'Upcoming'

  return (
    <button
      type="button"
      onClick={() => navigate(`/dashboard/match/${fixture.id}`)}
      className="flex w-full flex-col gap-3 rounded-2xl bg-surface-0 p-4 text-left shadow-card"
    >
      <div className="flex items-center justify-between">
        <Badge tone={badgeTone}>{badgeLabel}</Badge>
        <span className="text-xs text-ink-500">
          {fixture.status === 'scheduled' ? formatKickoff(fixture.kickoffAt) : formatRelativeTime(fixture.kickoffAt)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={homeTeam.name} color={homeTeam.crestColor} size={28} />
          <span className="text-sm font-medium text-ink-900">{homeTeam.name}</span>
        </div>
        <span className="text-sm font-bold text-ink-900">
          {result ? result.homeScore : ''}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={awayTeam.name} color={awayTeam.crestColor} size={28} />
          <span className="text-sm font-medium text-ink-900">{awayTeam.name}</span>
        </div>
        <span className="text-sm font-bold text-ink-900">
          {result ? result.awayScore : ''}
        </span>
      </div>
    </button>
  )
}
