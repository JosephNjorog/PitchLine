import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import type { Fixture, Result, Team } from '../../types'

interface ScoreCardProps {
  fixture: Fixture
  result?: Result
  homeTeam: Team
  awayTeam: Team
}

export function ScoreCard({ fixture, result, homeTeam, awayTeam }: ScoreCardProps) {
  return (
    <div className="flex w-56 shrink-0 flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <Badge tone={fixture.status === 'live' ? 'live' : 'completed'}>
        {fixture.status === 'live' ? 'Live' : 'Full time'}
      </Badge>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name={homeTeam.name} color={homeTeam.crestColor} size={32} />
          <span className="max-w-20 truncate text-xs font-medium text-white">
            {homeTeam.name}
          </span>
        </div>
        <span className="text-xl font-extrabold text-white">
          {result ? `${result.homeScore} - ${result.awayScore}` : 'vs'}
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar name={awayTeam.name} color={awayTeam.crestColor} size={32} />
          <span className="max-w-20 truncate text-xs font-medium text-white">
            {awayTeam.name}
          </span>
        </div>
      </div>
      <p className="text-center text-xs text-white/50">{homeTeam.county}</p>
    </div>
  )
}
