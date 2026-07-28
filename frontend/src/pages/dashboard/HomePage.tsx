import { TopBar } from '../../components/layout/TopBar'
import { FollowedResultsSection } from '../../features/matches/FollowedResultsSection'
import { UpcomingFixturesSection } from '../../features/matches/UpcomingFixturesSection'
import { DiscoverTeamsRow } from '../../features/teams/DiscoverTeamsRow'

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-4">
      <TopBar title="PitchLine" />
      <FollowedResultsSection />
      <UpcomingFixturesSection />
      <DiscoverTeamsRow />
    </div>
  )
}
