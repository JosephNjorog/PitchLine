import { useMemo, useState } from 'react'
import { Avatar } from '../../components/ui/Avatar'
import { Input } from '../../components/ui/Input'
import { SearchBar } from '../../components/ui/SearchBar'
import { searchTeams } from '../../mock-data'
import type { Team } from '../../types'

export type SponsorTargetType = 'team' | 'player'

interface SponsorTargetPickerProps {
  selectedTeam: Team | null
  onSelectTeam: (team: Team) => void
  targetType: SponsorTargetType
  onTargetTypeChange: (type: SponsorTargetType) => void
  playerName: string
  onPlayerNameChange: (name: string) => void
}

export function SponsorTargetPicker({
  selectedTeam,
  onSelectTeam,
  targetType,
  onTargetTypeChange,
  playerName,
  onPlayerNameChange,
}: SponsorTargetPickerProps) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchTeams(query).slice(0, 8), [query])

  if (!selectedTeam) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-ink-500">Which team do you want to back?</p>
        <SearchBar
          placeholder="Search by team or county"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          {results.map((team) => (
            <button
              key={team.id}
              type="button"
              onClick={() => onSelectTeam(team)}
              className="flex items-center gap-3 rounded-xl border border-ink-500/15 bg-paper p-3 text-left"
            >
              <Avatar name={team.name} color={team.crestColor} size={36} />
              <div>
                <p className="font-medium text-ink-900">{team.name}</p>
                <p className="text-xs text-ink-500">
                  {team.county} · {team.sport}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-pitch-900 bg-pitch-900/5 p-3">
        <Avatar name={selectedTeam.name} color={selectedTeam.crestColor} size={36} />
        <div>
          <p className="font-medium text-ink-900">{selectedTeam.name}</p>
          <p className="text-xs text-ink-500">{selectedTeam.county}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {(['team', 'player'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTargetTypeChange(type)}
            className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold ${
              targetType === type
                ? 'border-pitch-900 bg-pitch-900 text-white'
                : 'border-ink-500/20 text-ink-900'
            }`}
          >
            {type === 'team' ? 'Support the team' : 'Support a player'}
          </button>
        ))}
      </div>
      {targetType === 'player' && (
        <Input
          label="Player's name"
          placeholder="e.g. Brian Otieno"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
        />
      )}
    </div>
  )
}
