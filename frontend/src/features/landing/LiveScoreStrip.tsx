import { FIXTURES, RESULTS, getTeamById } from '../../mock-data'
import { ScoreCard } from './ScoreCard'

const FEATURED_FIXTURE_IDS = ['fixture-005', 'fixture-001']

export function LiveScoreStrip() {
  const featured = FEATURED_FIXTURE_IDS.map((id) => FIXTURES.find((f) => f.id === id)).filter(
    (f) => f !== undefined,
  )

  return (
    <div className="flex flex-col gap-3">
      {featured.map((fixture) => {
        const homeTeam = getTeamById(fixture.homeTeamId)
        const awayTeam = getTeamById(fixture.awayTeamId)
        const result = RESULTS.find((r) => r.fixtureId === fixture.id)
        if (!homeTeam || !awayTeam) return null
        return (
          <ScoreCard
            key={fixture.id}
            fixture={fixture}
            result={result}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
          />
        )
      })}
    </div>
  )
}
