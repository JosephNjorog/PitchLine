import { useMemo, useState } from 'react'
import { SearchBar } from '../../components/ui/SearchBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { ExportButton } from '../../features/institutional/ExportButton'
import { TeamResultCard } from '../../features/institutional/TeamResultCard'
import { AthleteResultCard } from '../../features/institutional/AthleteResultCard'
import { SPORTS, getCounties, getPositions, getTeamById, searchTeams, searchAthletes } from '../../mock-data'
import type { AgeGroup, Sport } from '../../types'

const AGE_GROUPS: AgeGroup[] = ['U15', 'U17', 'U20', 'Senior']

export function DiscoverPage() {
  const [mode, setMode] = useState<'teams' | 'athletes'>('teams')
  const [query, setQuery] = useState('')
  const [county, setCounty] = useState('')
  const [sport, setSport] = useState<Sport | ''>('')
  const [category, setCategory] = useState<'' | 'standard' | 'adaptive'>('')
  const [position, setPosition] = useState('')
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('')
  const counties = useMemo(() => getCounties(), [])
  const positions = useMemo(() => getPositions(), [])

  const teamResults = useMemo(() => {
    const base = searchTeams(query, { county: county || undefined, sport: sport || undefined })
    return category ? base.filter((t) => t.category === category) : base
  }, [query, county, sport, category])

  const athleteResults = useMemo(
    () =>
      searchAthletes(query, {
        county: county || undefined,
        sport: sport || undefined,
        position: position || undefined,
        ageGroup: ageGroup || undefined,
      }),
    [query, county, sport, position, ageGroup],
  )

  const teamExportRows = teamResults.map((t) => ({
    name: t.name,
    county: t.county,
    sport: t.sport,
    category: t.category,
    followers: t.followerCount,
  }))

  const athleteExportRows = athleteResults.map((a) => ({
    name: a.name,
    position: a.position,
    ageGroup: a.ageGroup,
    team: getTeamById(a.teamId)?.name ?? '',
    county: getTeamById(a.teamId)?.county ?? '',
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-bold text-ink-900">Discover teams &amp; athletes</h2>
        <ExportButton
          filename={mode === 'teams' ? 'pitchline-teams.csv' : 'pitchline-athletes.csv'}
          rows={mode === 'teams' ? teamExportRows : athleteExportRows}
        />
      </div>

      <div className="flex gap-2">
        {(['teams', 'athletes'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
              mode === m ? 'bg-pitch-900 text-white' : 'bg-sand text-ink-500'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <SearchBar
            placeholder={mode === 'teams' ? 'Search by team or county' : 'Search by athlete or team'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          value={county}
          onChange={(e) => setCounty(e.target.value)}
          className="rounded-xl border border-ink-500/25 bg-paper px-3 py-3 text-sm outline-none md:w-40"
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
          className="rounded-xl border border-ink-500/25 bg-paper px-3 py-3 text-sm capitalize outline-none md:w-40"
        >
          <option value="">All sports</option>
          {SPORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {mode === 'teams' ? (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as '' | 'standard' | 'adaptive')}
            className="rounded-xl border border-ink-500/25 bg-paper px-3 py-3 text-sm outline-none md:w-44"
          >
            <option value="">Standard + adaptive</option>
            <option value="standard">Standard only</option>
            <option value="adaptive">Adaptive only</option>
          </select>
        ) : (
          <>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="rounded-xl border border-ink-500/25 bg-paper px-3 py-3 text-sm outline-none md:w-40"
            >
              <option value="">All positions</option>
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup | '')}
              className="rounded-xl border border-ink-500/25 bg-paper px-3 py-3 text-sm outline-none md:w-32"
            >
              <option value="">All ages</option>
              {AGE_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {mode === 'teams' ? (
        teamResults.length === 0 ? (
          <EmptyState icon="🔎" title="No teams match these filters" />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {teamResults.map((team) => (
              <TeamResultCard key={team.id} team={team} />
            ))}
          </div>
        )
      ) : athleteResults.length === 0 ? (
        <EmptyState icon="🔎" title="No athletes match these filters" />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {athleteResults.map((athlete) => (
            <AthleteResultCard key={athlete.id} athlete={athlete} />
          ))}
        </div>
      )}
    </div>
  )
}
