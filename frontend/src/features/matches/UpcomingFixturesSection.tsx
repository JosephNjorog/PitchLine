import { getUpcomingFixtures } from '../../mock-data'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'
import { MatchCard } from './MatchCard'

export function UpcomingFixturesSection() {
  const { followedTeamIds } = useFollowedTeams()
  const fixtures = getUpcomingFixtures(followedTeamIds)

  if (fixtures.length === 0) return null

  return (
    <section className="flex flex-col gap-3 px-4">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Upcoming fixtures</h2>
      <div className="flex flex-col gap-3">
        {fixtures.map((fixture) => (
          <MatchCard key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </section>
  )
}
