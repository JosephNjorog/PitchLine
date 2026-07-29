import { Link, useNavigate } from 'react-router-dom'
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
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/dashboard/match/${fixture.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/dashboard/match/${fixture.id}`)
      }}
      className={`relative flex w-full cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl bg-paper p-4 text-left shadow-(--shadow-xs) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-md) ${
        fixture.status === 'live' ? 'live-pulse' : ''
      }`}
    >
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: `linear-gradient(180deg, ${homeTeam.crestColor}, ${awayTeam.crestColor})` }}
      />
      <div className="flex items-center justify-between pl-1">
        <Badge tone={badgeTone}>{badgeLabel}</Badge>
        <span className="text-xs font-medium text-ink-500">
          {fixture.status === 'scheduled' ? formatKickoff(fixture.kickoffAt) : formatRelativeTime(fixture.kickoffAt)}
        </span>
      </div>
      <div className="flex items-center justify-between pl-1">
        <Link
          to={`/dashboard/team/${homeTeam.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2"
        >
          <Avatar name={homeTeam.name} color={homeTeam.crestColor} size={28} />
          <span className="text-sm font-semibold text-ink-900">{homeTeam.name}</span>
        </Link>
        <span className="text-lg font-black tabular-nums text-ink-900">
          {result ? result.homeScore : ''}
        </span>
      </div>
      <div className="flex items-center justify-between pl-1">
        <Link
          to={`/dashboard/team/${awayTeam.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2"
        >
          <Avatar name={awayTeam.name} color={awayTeam.crestColor} size={28} />
          <span className="text-sm font-semibold text-ink-900">{awayTeam.name}</span>
        </Link>
        <span className="text-lg font-black tabular-nums text-ink-900">
          {result ? result.awayScore : ''}
        </span>
      </div>
    </div>
  )
}
