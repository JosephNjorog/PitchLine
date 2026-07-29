import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { ResultForm } from '../../features/team/ResultForm'
import { useCatalog } from '../../context/CatalogContext'
import { useMyTeam } from '../../context/MyTeamContext'
import { useTeamOps } from '../../context/TeamOpsContext'

export function SubmitResultPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTeamById } = useCatalog()
  const { myTeam, myTeamLoading } = useMyTeam()
  const { fixtures, fixturesLoading, submitResult } = useTeamOps()

  const fixture = fixtures.find((f) => f.id === id)

  if (myTeamLoading || fixturesLoading) return null
  if (!myTeam || !fixture) return <Navigate to="/team/fixtures" replace />

  const opponent = getTeamById(fixture.awayTeamId)
  if (!opponent) return <Navigate to="/team/fixtures" replace />

  return (
    <div className="flex flex-col gap-4 pb-4">
      <PageHeader title="Submit result" showBack />
      <div className="px-4">
        <ResultForm
          homeTeam={myTeam}
          awayTeam={opponent}
          onSubmit={async (result) => {
            await submitResult(fixture.id, result)
            navigate('/team', { replace: true })
          }}
        />
      </div>
    </div>
  )
}
