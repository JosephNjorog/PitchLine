import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { FixtureListItem } from '../../features/team/FixtureListItem'
import { formatKickoff } from '../../lib/date'
import { useMyTeam } from '../../context/MyTeamContext'
import { useTeamOps } from '../../context/TeamOpsContext'

export function TeamHomePage() {
  const navigate = useNavigate()
  const { myTeam } = useMyTeam()
  const { fixtures } = useTeamOps()

  const nextFixture = [...fixtures]
    .filter((f) => f.status !== 'completed')
    .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())[0]
  const sorted = [...fixtures].sort(
    (a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime(),
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink-900">{myTeam?.name ?? 'My team'}</h1>
        {nextFixture && (
          <Button onClick={() => navigate(`/team/fixtures/${nextFixture.id}/result`)}>Submit result</Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-500">Followers</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">{myTeam?.followerCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-500">Results logged</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">
            {fixtures.filter((f) => f.status === 'completed').length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-ink-500">Next fixture</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">
            {nextFixture ? formatKickoff(nextFixture.kickoffAt) : '—'}
          </p>
        </Card>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">Fixtures</h2>
          <Button variant="secondary" size="md" onClick={() => navigate('/team/fixtures/new')}>
            + New fixture
          </Button>
        </div>
        {sorted.length === 0 ? (
          <EmptyState
            icon="📅"
            title="Create your first fixture"
            description="Schedule a match to start tracking results and building your follower base."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.slice(0, 5).map((fixture) => (
              <FixtureListItem key={fixture.id} fixture={fixture} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
