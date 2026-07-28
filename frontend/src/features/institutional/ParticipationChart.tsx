import { Card } from '../../components/ui/Card'

interface ParticipationChartProps {
  values: number[]
}

export function ParticipationChart({ values }: ParticipationChartProps) {
  const max = Math.max(...values, 1)

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Participation trend</h3>
      <div className="flex h-32 items-end gap-2">
        {values.map((value, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-pitch-900"
            style={{ height: `${Math.max((value / max) * 100, 6)}%` }}
          />
        ))}
      </div>
      <p className="text-sm text-ink-500">Last 6 months</p>
    </Card>
  )
}
