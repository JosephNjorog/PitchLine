import { Card } from '../../components/ui/Card'
import type { Team } from '../../types'

export function FollowerStatsCard({ team, resultsSubmitted }: { team: Team; resultsSubmitted: number }) {
  return (
    <Card className="flex flex-col gap-4">
      <div>
        <p className="text-4xl font-extrabold text-pitch-900">{team.followerCount}</p>
        <p className="text-sm text-ink-500">
          {team.followerCount === 0 ? 'No followers yet' : 'people following your team'}
        </p>
      </div>
      <p className="text-sm text-ink-500">
        {resultsSubmitted === 0
          ? "Submit your first result and share your follow code — every result you post is a chance for fans to discover your team."
          : `You've submitted ${resultsSubmitted} result${resultsSubmitted === 1 ? '' : 's'}. Keep it up — teams that post results consistently grow their following fastest.`}
      </p>
    </Card>
  )
}
