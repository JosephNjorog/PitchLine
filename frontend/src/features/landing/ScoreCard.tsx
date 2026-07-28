import type { Fixture, Result, Team } from '../../types'

interface ScoreCardProps {
  fixture: Fixture
  result?: Result
  homeTeam: Team
  awayTeam: Team
}

export function ScoreCard({ fixture, result, homeTeam, awayTeam }: ScoreCardProps) {
  const title = result
    ? `${homeTeam.name} ${result.homeScore}-${result.awayScore} ${awayTeam.name}`
    : `${homeTeam.name} vs ${awayTeam.name}`

  const subtitle =
    fixture.status === 'live'
      ? 'Live now'
      : result?.motmNominees?.[0]
        ? `MOTM: ${result.motmNominees[0]}`
        : fixture.venue

  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-sand px-5 py-5 text-center">
      <p className="font-medium text-ink-900">{title}</p>
      {subtitle && <p className="text-sm text-ink-500">{subtitle}</p>}
    </div>
  )
}
