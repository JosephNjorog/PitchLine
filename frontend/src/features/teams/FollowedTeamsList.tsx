import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { getTeamById } from '../../mock-data'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'

export function FollowedTeamsList() {
  const { followedTeamIds, unfollow } = useFollowedTeams()
  const teams = followedTeamIds.map((id) => getTeamById(id)).filter((t) => t !== undefined)

  if (teams.length === 0) {
    return <EmptyState icon="⭐" title="You're not following any teams yet" />
  }

  return (
    <div className="flex flex-col gap-2">
      {teams.map((team) => (
        <div
          key={team.id}
          className="flex items-center gap-3 rounded-xl border border-ink-500/15 bg-paper p-3"
        >
          <Avatar name={team.name} color={team.crestColor} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-ink-900">{team.name}</p>
            <p className="truncate text-xs text-ink-500">{team.county}</p>
          </div>
          <Button variant="ghost" size="md" onClick={() => unfollow(team.id)}>
            Unfollow
          </Button>
        </div>
      ))}
    </div>
  )
}
