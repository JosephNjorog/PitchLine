import { Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { MatchCard } from '../../features/matches/MatchCard'
import { getCompletedFixtures, getTeamById, getUpcomingFixtures } from '../../mock-data'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'

export function TeamProfilePage() {
  const { id } = useParams()
  const team = id ? getTeamById(id) : undefined
  const { isFollowing, follow, unfollow } = useFollowedTeams()

  if (!team) return <Navigate to="/dashboard" replace />

  const following = isFollowing(team.id)
  const results = getCompletedFixtures([team.id])
  const upcoming = getUpcomingFixtures([team.id])

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PageHeader title={team.name} showBack />
      <div className="flex items-center gap-3 px-4">
        <Avatar name={team.name} color={team.crestColor} size={56} />
        <div className="flex-1">
          <p className="font-bold text-ink-900">{team.name}</p>
          <p className="text-sm text-ink-500 capitalize">
            {team.county} · {team.sport}
            {team.category === 'adaptive' ? ` · ${team.disabilityCategory}` : ''}
          </p>
          <p className="text-xs text-ink-500">{team.followerCount} followers</p>
        </div>
        <Button
          variant={following ? 'secondary' : 'primary'}
          size="md"
          onClick={() => (following ? unfollow(team.id) : follow(team.id))}
        >
          {following ? 'Following' : 'Follow'}
        </Button>
      </div>

      <section className="flex flex-col gap-3 px-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Recent results</h2>
        {results.length === 0 ? (
          <EmptyState icon="⚽" title="No results yet" />
        ) : (
          results.map((fixture) => <MatchCard key={fixture.id} fixture={fixture} />)
        )}
      </section>

      <section className="flex flex-col gap-3 px-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          Upcoming fixtures
        </h2>
        {upcoming.length === 0 ? (
          <EmptyState icon="📅" title="No upcoming fixtures" />
        ) : (
          upcoming.map((fixture) => <MatchCard key={fixture.id} fixture={fixture} />)
        )}
      </section>
    </div>
  )
}
