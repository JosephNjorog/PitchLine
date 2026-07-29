import { Avatar } from '../../components/ui/Avatar'
import type { Fixture, Result, Team } from '../../types'

interface ScoreCardProps {
  fixture: Fixture
  result?: Result
  homeTeam: Team
  awayTeam: Team
}

export function ScoreCard({ fixture, result, homeTeam, awayTeam }: ScoreCardProps) {
  const subtitle =
    fixture.status === 'live'
      ? 'Live now'
      : result?.motmNominees?.[0]
        ? `MOTM: ${result.motmNominees[0]}`
        : fixture.venue

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-lg backdrop-blur-md">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${homeTeam.crestColor}, ${awayTeam.crestColor})`,
        }}
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <Avatar name={homeTeam.name} color={homeTeam.crestColor} size={32} />
          <span className="max-w-20 truncate text-xs font-semibold text-white">{homeTeam.name}</span>
        </div>
        <span className="text-2xl font-black tabular-nums text-white">
          {result ? `${result.homeScore}-${result.awayScore}` : 'vs'}
        </span>
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <Avatar name={awayTeam.name} color={awayTeam.crestColor} size={32} />
          <span className="max-w-20 truncate text-xs font-semibold text-white">{awayTeam.name}</span>
        </div>
      </div>
      {subtitle && (
        <p className="mt-3 text-center text-xs font-medium text-white/50">{subtitle}</p>
      )}
    </div>
  )
}
