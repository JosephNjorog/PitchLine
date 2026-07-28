import { useMemo, useState } from 'react'
import { SearchBar } from '../../../components/ui/SearchBar'
import { searchTeams, getCounties } from '../../../mock-data'
import { TeamListItem } from './TeamListItem'

interface TeamSearchListProps {
  selectedTeamIds: string[]
  onToggle: (teamId: string) => void
}

export function TeamSearchList({ selectedTeamIds, onToggle }: TeamSearchListProps) {
  const [query, setQuery] = useState('')
  const [county, setCounty] = useState('')
  const counties = useMemo(() => getCounties(), [])
  const results = useMemo(
    () => searchTeams(query, { county: county || undefined }),
    [query, county],
  )

  return (
    <div className="flex flex-col gap-3">
      <SearchBar
        placeholder="Search by team or county"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCounty('')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
            county === '' ? 'bg-pitch-700 text-white' : 'bg-ink-500/10 text-ink-500'
          }`}
        >
          All counties
        </button>
        {counties.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCounty(c)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              county === c ? 'bg-pitch-700 text-white' : 'bg-ink-500/10 text-ink-500'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {results.map((team) => (
          <TeamListItem
            key={team.id}
            team={team}
            selected={selectedTeamIds.includes(team.id)}
            onToggle={() => onToggle(team.id)}
          />
        ))}
      </div>
    </div>
  )
}
