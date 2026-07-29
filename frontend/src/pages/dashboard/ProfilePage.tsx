import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { FollowedTeamsList } from '../../features/teams/FollowedTeamsList'
import { NotificationPrefsToggle } from '../../features/profile/NotificationPrefsToggle'
import { ActivityHistory } from '../../features/profile/ActivityHistory'
import { BadgesSection } from '../../features/profile/BadgesSection'
import { useAuth } from '../../context/AuthContext'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'
import { useActivity } from '../../context/ActivityContext'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { followedTeamIds } = useFollowedTeams()
  const { predictionEntries, sponsorships } = useActivity()

  function handleSignOut() {
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PageHeader title="Profile" />
      <div className="flex items-center gap-3 px-4">
        <Avatar name={user?.name ?? 'Fan'} size={56} />
        <div>
          <p className="font-bold text-ink-900">{user?.name ?? 'Fan'}</p>
          <p className="text-sm text-ink-500">{user?.email ?? user?.phone}</p>
        </div>
      </div>

      <section className="flex flex-col gap-3 px-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Badges</h2>
        <BadgesSection
          stats={{
            followedCount: followedTeamIds.length,
            predictionCount: predictionEntries.length,
            sponsorshipCount: sponsorships.length,
          }}
        />
      </section>

      <section className="flex flex-col gap-3 px-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Followed teams</h2>
        <FollowedTeamsList />
      </section>

      <section className="flex flex-col gap-3 px-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          Notifications
        </h2>
        <NotificationPrefsToggle />
      </section>

      <section className="flex flex-col gap-3 px-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Activity</h2>
        <ActivityHistory />
      </section>

      <div className="px-4">
        <Button variant="secondary" className="w-full" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}
