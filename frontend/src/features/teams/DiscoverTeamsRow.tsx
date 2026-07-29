import { Link } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { useCatalog } from '../../context/CatalogContext'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'

const TRENDING_COUNT = 2

export function DiscoverTeamsRow() {
  const { teams } = useCatalog()
  const { followedTeamIds, follow } = useFollowedTeams()
  const discoverable = teams.filter((team) => !followedTeamIds.includes(team.id))
    .sort((a, b) => b.followerCount - a.followerCount)
    .slice(0, 8)

  if (discoverable.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
        Discover new teams
      </h2>
      <div className="scroll-x-hide flex gap-3 overflow-x-auto pb-2">
        {discoverable.map((team, i) => (
          <div
            key={team.id}
            className="relative flex w-36 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-paper p-3 text-center shadow-(--shadow-xs) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-md)"
          >
            {i < TRENDING_COUNT && (
              <span className="absolute left-2 top-2 rounded-full bg-amber-tint px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                🔥 Trending
              </span>
            )}
            <Link
              to={`/dashboard/team/${team.id}`}
              className="flex flex-col items-center gap-2 pt-4"
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
