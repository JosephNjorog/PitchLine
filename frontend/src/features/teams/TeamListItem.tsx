import { Avatar } from '../../components/ui/Avatar'
import type { Team } from '../../types'

interface TeamListItemProps {
  team: Team
  selected: boolean
  onToggle: () => void
}

export function TeamListItem({ team, selected, onToggle }: TeamListItemProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
        selected ? 'border-pitch-700 bg-pitch-700/5' : 'border-ink-500/15 bg-surface-0'
      }`}
    >
      <Avatar name={team.name} color={team.crestColor} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink-900">{team.name}</p>
        <p className="truncate text-xs text-ink-500">
          {team.county} · {team.sport}
          {team.category === 'adaptive' ? ` · ${team.disabilityCategory}` : ''}
        </p>
      </div>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs text-white ${
          selected ? 'border-pitch-700 bg-pitch-700' : 'border-ink-500/30 bg-transparent'
        }`}
      >
        {selected ? '✓' : ''}
      </span>
    </button>
  )
}
