import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { formatKickoff } from '../../lib/date'
import { getResultForFixture, getTeamById } from '../../mock-data'
import { useTeamOps } from '../../context/TeamOpsContext'
import type { Fixture } from '../../types'

export function FixtureListItem({ fixture }: { fixture: Fixture }) {
  const navigate = useNavigate()
  const { results } = useTeamOps()
  const opponent = getTeamById(fixture.awayTeamId)
  const result = results.find((r) => r.fixtureId === fixture.id) ?? getResultForFixture(fixture.id)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Badge tone={fixture.status === 'completed' ? 'completed' : 'scheduled'}>
          {fixture.status === 'completed' ? 'Played' : 'Upcoming'}
        </Badge>
        <span className="text-xs text-ink-500">{formatKickoff(fixture.kickoffAt)}</span>
      </div>
      <div className="flex items-center gap-3">
        {opponent && <Avatar name={opponent.name} color={opponent.crestColor} size={32} />}
        <p className="flex-1 font-medium text-ink-900">vs {opponent?.name ?? 'Opponent'}</p>
        {result && (
          <span className="text-sm font-bold text-ink-900">
            {result.homeScore} - {result.awayScore}
          </span>
        )}
      </div>
      {fixture.status !== 'completed' && (
        <div className="flex gap-2">
          <Button size="md" className="flex-1" onClick={() => navigate(`/team/fixtures/${fixture.id}/result`)}>
            Submit result
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/team/fixtures/${fixture.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      )}
    </Card>
  )
}
