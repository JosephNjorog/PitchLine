import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { formatKickoff } from '../../lib/date'
import type { Fixture, Result, Team } from '../../types'

interface LiveScoreHeaderProps {
  fixture: Fixture
  result?: Result
  homeTeam: Team
  awayTeam: Team
}

export function LiveScoreHeader({ fixture, result, homeTeam, awayTeam }: LiveScoreHeaderProps) {
  const badgeTone = fixture.status === 'live' ? 'live' : fixture.status === 'completed' ? 'completed' : 'scheduled'
  const badgeLabel =
    fixture.status === 'live' ? 'Live' : fixture.status === 'completed' ? 'Full time' : 'Upcoming'

  return (
    <div className="flex flex-col items-center gap-4 bg-pitch-900 px-4 py-8 text-white">
      <Badge tone={badgeTone}>{badgeLabel}</Badge>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 flex-col items-center gap-2">
          <Avatar name={homeTeam.name} color={homeTeam.crestColor} size={48} />
          <span className="text-center text-sm font-semibold">{homeTeam.name}</span>
        </div>
        <span
          className={`rounded-2xl px-3 text-3xl font-extrabold ${fixture.status === 'live' ? 'live-pulse' : ''}`}
        >
          {result ? `${result.homeScore} - ${result.awayScore}` : 'vs'}
        </span>
        <div className="flex flex-1 flex-col items-center gap-2">
          <Avatar name={awayTeam.name} color={awayTeam.crestColor} size={48} />
          <span className="text-center text-sm font-semibold">{awayTeam.name}</span>
        </div>
      </div>
      <p className="text-xs text-white/70">
        {fixture.venue} · {formatKickoff(fixture.kickoffAt)}
      </p>
    </div>
  )
}
