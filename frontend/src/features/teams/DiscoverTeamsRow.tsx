import { Link } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { TEAMS } from '../../mock-data'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'

export function DiscoverTeamsRow() {
  const { followedTeamIds, follow } = useFollowedTeams()
  const discoverable = TEAMS.filter((team) => !followedTeamIds.includes(team.id)).slice(0, 8)

  if (discoverable.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="px-4 text-sm font-bold uppercase tracking-wide text-ink-500">
        Discover new teams
      </h2>
      <div className="scroll-x-hide flex gap-3 overflow-x-auto px-4 pb-2">
        {discoverable.map((team) => (
          <div
            key={team.id}
            className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-2xl bg-surface-0 p-3 text-center shadow-card"
          >
            <Link
              to={`/dashboard/team/${team.id}`}
              className="flex flex-col items-center gap-2"
            >
              <Avatar name={team.name} color={team.crestColor} size={40} />
              <p className="truncate text-xs font-semibold text-ink-900">{team.name}</p>
              <p className="truncate text-[11px] text-ink-500">{team.county}</p>
            </Link>
            <Button size="md" className="w-full !px-2 !py-1.5 text-xs" onClick={() => follow(team.id)}>
              Follow
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
