import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { FixtureListItem } from '../../features/team/FixtureListItem'
import { useTeamOps } from '../../context/TeamOpsContext'

export function TeamFixturesPage() {
  const navigate = useNavigate()
  const { fixtures } = useTeamOps()
  const sorted = [...fixtures].sort(
    (a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime(),
  )

  return (
    <div className="flex flex-col gap-4 pb-4">
      <PageHeader
        title="Fixtures"
        action={
          <Button size="md" onClick={() => navigate('/team/fixtures/new')}>
            + New
          </Button>
        }
      />
      <div className="flex flex-col gap-3 px-4">
        {sorted.length === 0 ? (
          <EmptyState icon="📅" title="No fixtures yet" />
        ) : (
          sorted.map((fixture) => <FixtureListItem key={fixture.id} fixture={fixture} />)
        )}
      </div>
    </div>
  )
}
