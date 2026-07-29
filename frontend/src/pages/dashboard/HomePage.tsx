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
import { useCatalog } from '../../context/CatalogContext'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'
import type { Sport } from '../../types'

export function HomePage() {
  const { getTeamById } = useCatalog()
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
  }, [followedTeamIds, getTeamById])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tight text-ink-900">Your feed</h1>
        <button
          type="button"
          onClick={() => setNotificationsOpen(true)}
          aria-label="Open notifications"
          className="relative shrink-0"
        >
          <Avatar name={user?.name ?? 'Fan'} size={38} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white ring-2 ring-cream">
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
        <h2 className="text-lg font-black tracking-tight text-ink-900">Prediction leaderboard</h2>
        <Leaderboard />
      </section>

      <Link
        to="/dashboard/sponsor"
        className="flex items-center justify-between gap-3 rounded-2xl bg-linear-to-r from-amber-500 to-amber-600 px-6 py-5 shadow-[0_8px_20px_rgba(217,119,6,0.3)] transition-transform hover:-translate-y-0.5"
      >
        <div>
          <p className="text-base font-black text-white">Back a player</p>
          <p className="text-sm text-white/80">From as little as KES 20</p>
        </div>
        <span className="text-2xl">🤝</span>
      </Link>

      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  )
}
