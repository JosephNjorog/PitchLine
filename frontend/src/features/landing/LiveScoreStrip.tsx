import { useCatalog } from '../../context/CatalogContext'
import { ScoreCard } from './ScoreCard'

export function LiveScoreStrip() {
  const { fixtures, resultsByFixtureId, getTeamById } = useCatalog()

  const featured = [...fixtures]
    .filter((f) => f.status === 'live' || f.status === 'completed')
    .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime())
    .slice(0, 2)

  return (
    <div className="flex flex-col gap-3">
      {featured.map((fixture) => {
        const homeTeam = getTeamById(fixture.homeTeamId)
        const awayTeam = getTeamById(fixture.awayTeamId)
        const result = resultsByFixtureId[fixture.id]
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
