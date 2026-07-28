import { Link } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { FollowedResultsSection } from '../../features/matches/FollowedResultsSection'
import { UpcomingFixturesSection } from '../../features/matches/UpcomingFixturesSection'
import { DiscoverTeamsRow } from '../../features/teams/DiscoverTeamsRow'
import { Leaderboard } from '../../features/predictions/Leaderboard'
import { useAuth } from '../../context/AuthContext'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Your feed</h1>
        <div className="relative">
          <Avatar name={user?.name ?? 'Fan'} size={36} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
            3
          </span>
        </div>
      </div>

      <FollowedResultsSection />
      <UpcomingFixturesSection />
      <DiscoverTeamsRow />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-ink-900">Prediction leaderboard</h2>
        <Leaderboard />
      </section>

      <Link
        to="/dashboard/sponsor"
        className="rounded-2xl bg-amber-tint px-5 py-4 text-center font-semibold text-ink-900 hover:opacity-90"
      >
        Back a player from KES 20
      </Link>
    </div>
  )
}
