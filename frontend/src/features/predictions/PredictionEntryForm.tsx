import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { ScoreStepper } from '../../components/ui/ScoreStepper'
import type { Team } from '../../types'

interface PredictionEntryFormProps {
  homeTeam: Team
  awayTeam: Team
  homeScore: number
  awayScore: number
  onHomeScoreChange: (value: number) => void
  onAwayScoreChange: (value: number) => void
  onSubmit: () => void
}

export function PredictionEntryForm({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  onHomeScoreChange,
  onAwayScoreChange,
  onSubmit,
}: PredictionEntryFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-2">
          <Avatar name={homeTeam.name} color={homeTeam.crestColor} size={44} />
          <span className="text-sm font-medium text-ink-900">{homeTeam.name}</span>
          <ScoreStepper value={homeScore} onChange={onHomeScoreChange} />
        </div>
        <span className="text-lg font-bold text-ink-500">–</span>
        <div className="flex flex-col items-center gap-2">
          <Avatar name={awayTeam.name} color={awayTeam.crestColor} size={44} />
          <span className="text-sm font-medium text-ink-900">{awayTeam.name}</span>
          <ScoreStepper value={awayScore} onChange={onAwayScoreChange} />
        </div>
      </div>
      <Button size="lg" className="w-full" onClick={onSubmit}>
        Submit prediction
      </Button>
    </div>
  )
}
