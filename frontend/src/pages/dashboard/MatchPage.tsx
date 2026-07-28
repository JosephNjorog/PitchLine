import { Navigate, useParams } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { LiveScoreHeader } from '../../features/matches/LiveScoreHeader'
import { MotmVote } from '../../features/matches/MotmVote'
import { PredictionEntryPrompt } from '../../features/predictions/PredictionEntryPrompt'
import { getFixtureById, getResultForFixture, getTeamById, getOpenPredictionRound } from '../../mock-data'

export function MatchPage() {
  const { id } = useParams()
  const fixture = id ? getFixtureById(id) : undefined

  if (!fixture) return <Navigate to="/dashboard" replace />

  const homeTeam = getTeamById(fixture.homeTeamId)
  const awayTeam = getTeamById(fixture.awayTeamId)
  const result = getResultForFixture(fixture.id)
  const openRound = getOpenPredictionRound(fixture.id)

  if (!homeTeam || !awayTeam) return <Navigate to="/dashboard" replace />

  return (
    <div className="flex flex-col gap-4 pb-4">
      <TopBar title="Match" showBack />
      <LiveScoreHeader fixture={fixture} result={result} homeTeam={homeTeam} awayTeam={awayTeam} />
      <div className="flex flex-col gap-4 px-4">
        {openRound && <PredictionEntryPrompt round={openRound} />}
        {result && <MotmVote result={result} />}
      </div>
    </div>
  )
}
