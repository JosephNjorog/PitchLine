import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { NextFixtureCard } from '../../features/team/NextFixtureCard'
import { useMyTeam } from '../../context/MyTeamContext'
import { useTeamOps } from '../../context/TeamOpsContext'

export function TeamHomePage() {
  const navigate = useNavigate()
  const { myTeam } = useMyTeam()
  const { fixtures } = useTeamOps()

  const nextFixture = [...fixtures]
    .filter((f) => f.status !== 'completed')
    .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())[0]

  return (
    <div className="flex flex-col gap-6 pb-4">
      <TopBar title={myTeam?.name ?? 'My team'} />
      <div className="px-4">
        {nextFixture ? (
          <NextFixtureCard fixture={nextFixture} />
        ) : (
          <EmptyState
            icon="📅"
            title="Create your first fixture"
            description="Schedule a match to start tracking results and building your follower base."
            action={<Button onClick={() => navigate('/team/fixtures/new')}>New fixture</Button>}
          />
        )}
      </div>
    </div>
  )
}
