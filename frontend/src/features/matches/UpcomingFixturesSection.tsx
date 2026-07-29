import { useCatalog } from '../../context/CatalogContext'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'
import { MatchCard } from './MatchCard'
import type { Sport } from '../../types'

export function UpcomingFixturesSection({ sport }: { sport?: Sport | null }) {
  const { getUpcomingFixtures, getTeamById } = useCatalog()
  const { followedTeamIds } = useFollowedTeams()
  const fixtures = getUpcomingFixtures(followedTeamIds).filter(
    (fixture) => !sport || getTeamById(fixture.homeTeamId)?.sport === sport,
  )

  if (fixtures.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Upcoming fixtures</h2>
      <div className="flex flex-col gap-3">
        {fixtures.map((fixture) => (
          <MatchCard key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </section>
  )
}
