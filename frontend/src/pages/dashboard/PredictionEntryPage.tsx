import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { PredictionEntryForm } from '../../features/predictions/PredictionEntryForm'
import { getFixtureById, getPredictionRoundById, getTeamById } from '../../mock-data'
import { useActivity } from '../../context/ActivityContext'
import { useAuth } from '../../context/AuthContext'

export function PredictionEntryPage() {
  const { roundId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addPredictionEntry } = useActivity()
  const [homeScore, setHomeScore] = useState(1)
  const [awayScore, setAwayScore] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const round = roundId ? getPredictionRoundById(roundId) : undefined
  if (!round) return <Navigate to="/dashboard/predictions" replace />

  const fixture = getFixtureById(round.fixtureId)
  const homeTeam = fixture ? getTeamById(fixture.homeTeamId) : undefined
  const awayTeam = fixture ? getTeamById(fixture.awayTeamId) : undefined

  if (!fixture || !homeTeam || !awayTeam) return <Navigate to="/dashboard/predictions" replace />

  if (round.status !== 'open') {
    return (
      <div className="flex flex-col gap-4 pb-4">
        <TopBar title="Predict the score" showBack />
        <div className="px-4">
          <EmptyState icon="🔒" title="Predictions are closed for this fixture" />
        </div>
      </div>
    )
  }

  function handleSubmit() {
    addPredictionEntry({
      roundId: round!.id,
      accountId: user?.id ?? 'guest',
      predictedHomeScore: homeScore,
      predictedAwayScore: awayScore,
    })
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <TopBar title="Predict the score" showBack />
      <div className="px-4">
        {submitted ? (
          <EmptyState
            icon="✅"
            title="Prediction submitted"
            description={`You called it ${homeScore}-${awayScore}. Good luck!`}
            action={
              <Button onClick={() => navigate('/dashboard/predictions')}>Back to predictions</Button>
            }
          />
        ) : (
          <PredictionEntryForm
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeScore={homeScore}
            awayScore={awayScore}
            onHomeScoreChange={setHomeScore}
            onAwayScoreChange={setAwayScore}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}
