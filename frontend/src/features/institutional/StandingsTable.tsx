import { useMemo, useState } from 'react'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { ExportButton } from './ExportButton'
import { FIXTURES, RESULTS, SPORTS, getCounties, getTeamById } from '../../mock-data'
import { computeStandings } from '../../lib/standings'
import { useAdminFixtures } from '../../context/AdminFixturesContext'
import type { Sport } from '../../types'

export function StandingsTable() {
  const { fixtures: adminFixtures, results: adminResults } = useAdminFixtures()
  const [sport, setSport] = useState<Sport | ''>('')
  const [county, setCounty] = useState('')
  const counties = useMemo(() => getCounties(), [])

  const standings = useMemo(
    () =>
      computeStandings([...FIXTURES, ...adminFixtures], [...RESULTS, ...adminResults], {
        sport: sport || undefined,
        county: county || undefined,
      }),
    [adminFixtures, adminResults, sport, county],
  )

  const exportRows = standings.map((row, i) => {
    const team = getTeamById(row.teamId)
    return {
      rank: i + 1,
      team: team?.name ?? row.teamId,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalDifference: row.goalsFor - row.goalsAgainst,
      points: row.points,
    }
  })

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Standings</h3>
        <ExportButton filename="pitchline-standings.csv" rows={exportRows} />
      </div>
      <div className="flex gap-2">
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value as Sport | '')}
          className="flex-1 rounded-xl border border-ink-500/25 bg-paper px-3 py-2 text-sm capitalize outline-none"
        >
          <option value="">All sports</option>
          {SPORTS.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
        <select
          value={county}
          onChange={(e) => setCounty(e.target.value)}
          className="flex-1 rounded-xl border border-ink-500/25 bg-paper px-3 py-2 text-sm outline-none"
        >
          <option value="">All counties</option>
          {counties.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {standings.length === 0 ? (
        <EmptyState icon="📊" title="No completed fixtures match this filter yet" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-ink-500/10 text-left text-xs uppercase text-ink-500">
                <th className="py-2 pr-2">Team</th>
                <th className="px-2 text-center">P</th>
                <th className="px-2 text-center">W</th>
                <th className="px-2 text-center">D</th>
                <th className="px-2 text-center">L</th>
                <th className="px-2 text-center">GD</th>
                <th className="pl-2 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => {
                const team = getTeamById(row.teamId)
                return (
                  <tr key={row.teamId} className="border-b border-ink-500/5">
                    <td className="py-2 pr-2 font-medium text-ink-900">{team?.name ?? row.teamId}</td>
                    <td className="px-2 text-center text-ink-500">{row.played}</td>
                    <td className="px-2 text-center text-ink-500">{row.won}</td>
                    <td className="px-2 text-center text-ink-500">{row.drawn}</td>
                    <td className="px-2 text-center text-ink-500">{row.lost}</td>
                    <td className="px-2 text-center text-ink-500">{row.goalsFor - row.goalsAgainst}</td>
                    <td className="pl-2 text-center font-bold text-ink-900">{row.points}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
