import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatKes } from '../../lib/currency'
import { getFixtureById, getPredictionRoundById, getTeamById } from '../../mock-data'
import { useActivity } from '../../context/ActivityContext'

type TimelineItem =
  | { kind: 'prediction'; id: string; at: string; label: string }
  | { kind: 'sponsorship'; id: string; at: string; label: string; amount: number }

export function ActivityHistory() {
  const { predictionEntries, sponsorships } = useActivity()

  const items: TimelineItem[] = [
    ...predictionEntries.map((entry): TimelineItem => {
      const round = getPredictionRoundById(entry.roundId)
      const fixture = round ? getFixtureById(round.fixtureId) : undefined
      const homeTeam = fixture ? getTeamById(fixture.homeTeamId) : undefined
      const awayTeam = fixture ? getTeamById(fixture.awayTeamId) : undefined
      const label =
        homeTeam && awayTeam
          ? `Predicted ${homeTeam.name} ${entry.predictedHomeScore}-${entry.predictedAwayScore} ${awayTeam.name}`
          : 'Prediction submitted'
      return { kind: 'prediction', id: entry.id, at: entry.submittedAt, label }
    }),
    ...sponsorships.map(
      (s): TimelineItem => ({
        kind: 'sponsorship',
        id: s.id,
        at: s.createdAt,
        label: `Sponsored ${s.targetLabel}`,
        amount: s.amount,
      }),
    ),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🗒️"
        title="No activity yet"
        description="Predictions and sponsorships you make will show up here."
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Card key={item.id} className="flex items-center justify-between gap-2 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{item.kind === 'prediction' ? '⚽' : '🤝'}</span>
            <span className="text-sm text-ink-900">{item.label}</span>
          </div>
          {item.kind === 'sponsorship' && (
            <span className="text-sm font-semibold text-pitch-700">{formatKes(item.amount)}</span>
          )}
        </Card>
      ))}
    </div>
  )
}
