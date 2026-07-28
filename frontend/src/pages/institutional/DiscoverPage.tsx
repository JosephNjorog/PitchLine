import { useMemo, useState } from 'react'
import { SearchBar } from '../../components/ui/SearchBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { ExportButton } from '../../features/institutional/ExportButton'
import { TeamResultCard } from '../../features/institutional/TeamResultCard'
import { SPORTS, getCounties, searchTeams } from '../../mock-data'
import type { Sport } from '../../types'

export function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [county, setCounty] = useState('')
  const [sport, setSport] = useState<Sport | ''>('')
  const [category, setCategory] = useState<'' | 'standard' | 'adaptive'>('')
  const counties = useMemo(() => getCounties(), [])

  const results = useMemo(() => {
    const base = searchTeams(query, { county: county || undefined, sport: sport || undefined })
    return category ? base.filter((t) => t.category === category) : base
  }, [query, county, sport, category])

  const exportRows = results.map((t) => ({
    name: t.name,
    county: t.county,
    sport: t.sport,
    category: t.category,
    followers: t.followerCount,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-bold text-ink-900">Discover teams &amp; athletes</h2>
        <ExportButton filename="pitchline-discover.csv" rows={exportRows} />
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <SearchBar placeholder="Search by team or county" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select
          value={county}
          onChange={(e) => setCounty(e.target.value)}
          className="rounded-xl border border-ink-500/25 bg-surface-0 px-3 py-3 text-sm outline-none md:w-40"
        >
          <option value="">All counties</option>
          {counties.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value as Sport | '')}
          className="rounded-xl border border-ink-500/25 bg-surface-0 px-3 py-3 text-sm capitalize outline-none md:w-40"
        >
          <option value="">All sports</option>
          {SPORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as '' | 'standard' | 'adaptive')}
          className="rounded-xl border border-ink-500/25 bg-surface-0 px-3 py-3 text-sm outline-none md:w-44"
        >
          <option value="">Standard + adaptive</option>
          <option value="standard">Standard only</option>
          <option value="adaptive">Adaptive only</option>
        </select>
      </div>
      {results.length === 0 ? (
        <EmptyState icon="🔎" title="No teams match these filters" />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {results.map((team) => (
            <TeamResultCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  )
}
