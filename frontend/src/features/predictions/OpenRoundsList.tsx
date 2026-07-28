import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatKickoff } from '../../lib/date'
import { getFixtureById, getOpenPredictionRounds, getTeamById } from '../../mock-data'

export function OpenRoundsList() {
  const navigate = useNavigate()
  const rounds = getOpenPredictionRounds()

  if (rounds.length === 0) {
    return <EmptyState icon="⚽" title="No open rounds" description="Check back before the next fixture." />
  }

  return (
    <div className="flex flex-col gap-3">
      {rounds.map((round) => {
        const fixture = getFixtureById(round.fixtureId)
        if (!fixture) return null
        const homeTeam = getTeamById(fixture.homeTeamId)
        const awayTeam = getTeamById(fixture.awayTeamId)
        if (!homeTeam || !awayTeam) return null

        return (
          <Card key={round.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Avatar name={homeTeam.name} color={homeTeam.crestColor} size={28} />
              <span className="flex-1 text-sm font-medium text-ink-900">
                {homeTeam.name} vs {awayTeam.name}
              </span>
              <Avatar name={awayTeam.name} color={awayTeam.crestColor} size={28} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-500">{formatKickoff(fixture.kickoffAt)}</span>
              <Button size="md" onClick={() => navigate(`/dashboard/predictions/${round.id}/enter`)}>
                Predict
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
