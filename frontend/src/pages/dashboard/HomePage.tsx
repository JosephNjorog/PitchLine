import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { TeamQuickSearch } from '../../features/teams/TeamQuickSearch'
import { NotificationsPanel } from '../../features/notifications/NotificationsPanel'
import { FollowedResultsSection } from '../../features/matches/FollowedResultsSection'
import { UpcomingFixturesSection } from '../../features/matches/UpcomingFixturesSection'
import { SportFilterChips } from '../../features/matches/SportFilterChips'
import { DiscoverTeamsRow } from '../../features/teams/DiscoverTeamsRow'
import { Leaderboard } from '../../features/predictions/Leaderboard'
import { getTeamById } from '../../mock-data'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'
import type { Sport } from '../../types'

export function HomePage() {
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const { followedTeamIds } = useFollowedTeams()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [sportFilter, setSportFilter] = useState<Sport | null>(null)

  const followedSports = useMemo(() => {
    const sports = followedTeamIds
      .map((id) => getTeamById(id)?.sport)
      .filter((sport): sport is Sport => Boolean(sport))
    return Array.from(new Set(sports))
  }, [followedTeamIds])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink-900">Your feed</h1>
        <button
          type="button"
          onClick={() => setNotificationsOpen(true)}
          aria-label="Open notifications"
          className="relative shrink-0"
        >
          <Avatar name={user?.name ?? 'Fan'} size={36} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <TeamQuickSearch />

      <SportFilterChips sports={followedSports} selected={sportFilter} onSelect={setSportFilter} />

      <FollowedResultsSection sport={sportFilter} />
      <UpcomingFixturesSection sport={sportFilter} />
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

      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  )
}
