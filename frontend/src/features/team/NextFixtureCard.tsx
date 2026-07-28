import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { formatKickoff } from '../../lib/date'
import { getTeamById } from '../../mock-data'
import type { Fixture } from '../../types'

export function NextFixtureCard({ fixture }: { fixture: Fixture }) {
  const navigate = useNavigate()
  const opponentId = fixture.awayTeamId
  const opponent = getTeamById(opponentId)

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Badge tone={fixture.status === 'completed' ? 'completed' : 'scheduled'}>
          {fixture.status === 'completed' ? 'Played' : 'Upcoming'}
        </Badge>
        <span className="text-xs text-ink-500">{formatKickoff(fixture.kickoffAt)}</span>
      </div>
      <div className="flex items-center gap-3">
        {opponent && <Avatar name={opponent.name} color={opponent.crestColor} size={40} />}
        <div>
          <p className="font-semibold text-ink-900">vs {opponent?.name ?? 'Opponent'}</p>
          <p className="text-xs text-ink-500">{fixture.venue}</p>
        </div>
      </div>
      {fixture.status !== 'completed' && (
        <Button size="lg" className="w-full" onClick={() => navigate(`/team/fixtures/${fixture.id}/result`)}>
          Submit result
        </Button>
      )}
    </Card>
  )
}
