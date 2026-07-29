import { EmptyState } from '../../components/ui/EmptyState'
import { getCompletedFixtures, getTeamById } from '../../mock-data'
import { useFollowedTeams } from '../../context/FollowedTeamsContext'
import { MatchCard } from './MatchCard'
import type { Sport } from '../../types'

export function FollowedResultsSection({ sport }: { sport?: Sport | null }) {
  const { followedTeamIds } = useFollowedTeams()
  const fixtures = getCompletedFixtures(followedTeamIds).filter(
    (fixture) => !sport || getTeamById(fixture.homeTeamId)?.sport === sport,
  )

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Latest results</h2>
      {fixtures.length === 0 ? (
        <EmptyState
          icon="⚽"
          title="No results yet"
          description="Once your teams play, results will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {fixtures.map((fixture) => (
            <MatchCard key={fixture.id} fixture={fixture} />
          ))}
        </div>
      )}
    </section>
  )
}
