import { Avatar } from '../../components/ui/Avatar'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { getFixtureById, getResultForFixture, getSettledPredictionRounds, getTeamById } from '../../mock-data'

export function PastResultsList() {
  const rounds = getSettledPredictionRounds()

  if (rounds.length === 0) {
    return <EmptyState icon="📊" title="No past rounds yet" />
  }

  return (
    <div className="flex flex-col gap-3">
      {rounds.map((round) => {
        const fixture = getFixtureById(round.fixtureId)
        const result = fixture ? getResultForFixture(fixture.id) : undefined
        if (!fixture || !result) return null
        const homeTeam = getTeamById(fixture.homeTeamId)
        const awayTeam = getTeamById(fixture.awayTeamId)
        if (!homeTeam || !awayTeam) return null

        return (
          <Card key={round.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar name={homeTeam.name} color={homeTeam.crestColor} size={24} />
              <span className="text-sm text-ink-900">{homeTeam.name}</span>
            </div>
            <span className="text-sm font-bold text-ink-900">
              {result.homeScore} - {result.awayScore}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-900">{awayTeam.name}</span>
              <Avatar name={awayTeam.name} color={awayTeam.crestColor} size={24} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
