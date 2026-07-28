import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { LiveScoreHeader } from '../../features/matches/LiveScoreHeader'
import { MotmVote } from '../../features/matches/MotmVote'
import { PredictionEntryPrompt } from '../../features/predictions/PredictionEntryPrompt'
import { getFixtureById, getResultForFixture, getTeamById, getOpenPredictionRound } from '../../mock-data'
import { shareResult } from '../../lib/share'

export function MatchPage() {
  const { id } = useParams()
  const fixture = id ? getFixtureById(id) : undefined
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')

  if (!fixture) return <Navigate to="/dashboard" replace />

  const homeTeam = getTeamById(fixture.homeTeamId)
  const awayTeam = getTeamById(fixture.awayTeamId)
  const result = getResultForFixture(fixture.id)
  const openRound = getOpenPredictionRound(fixture.id)

  if (!homeTeam || !awayTeam) return <Navigate to="/dashboard" replace />

  async function handleShare() {
    if (!homeTeam || !awayTeam) return
    const text = result
      ? `${homeTeam.name} ${result.homeScore} - ${result.awayScore} ${awayTeam.name} — via PitchLine`
      : `${homeTeam.name} vs ${awayTeam.name} — follow along on PitchLine`
    const outcome = await shareResult(text)
    if (outcome === 'copied') {
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <PageHeader
        title="Match"
        showBack
        action={
          <Button variant="ghost" size="md" onClick={handleShare}>
            {shareStatus === 'copied' ? 'Copied!' : '📤 Share'}
          </Button>
        }
      />
      <LiveScoreHeader fixture={fixture} result={result} homeTeam={homeTeam} awayTeam={awayTeam} />
      <div className="flex flex-col gap-4 px-4">
        {openRound && <PredictionEntryPrompt round={openRound} />}
        {result && <MotmVote result={result} />}
      </div>
    </div>
  )
}
