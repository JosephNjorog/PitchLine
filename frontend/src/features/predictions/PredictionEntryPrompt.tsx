import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import type { PredictionRound } from '../../types'

export function PredictionEntryPrompt({ round }: { round: PredictionRound }) {
  const navigate = useNavigate()

  return (
    <Card className="flex items-center justify-between gap-3">
      <div>
        <p className="font-semibold text-ink-900">Predict the score</p>
        <p className="text-xs text-ink-500">Free to play — earn points, climb the leaderboard.</p>
      </div>
      <Button size="md" onClick={() => navigate(`/dashboard/predictions/${round.id}/enter`)}>
        Predict
      </Button>
    </Card>
  )
}
