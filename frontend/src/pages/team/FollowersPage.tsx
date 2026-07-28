import { TopBar } from '../../components/layout/TopBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { FollowerStatsCard } from '../../features/team/FollowerStatsCard'
import { useMyTeam } from '../../context/MyTeamContext'
import { useTeamOps } from '../../context/TeamOpsContext'

export function FollowersPage() {
  const { myTeam } = useMyTeam()
  const { results } = useTeamOps()

  return (
    <div className="flex flex-col gap-4 pb-4">
      <TopBar title="Followers" />
      <div className="px-4">
        {myTeam ? (
          <FollowerStatsCard team={myTeam} resultsSubmitted={results.length} />
        ) : (
          <EmptyState icon="📈" title="No team yet" />
        )}
      </div>
    </div>
  )
}
