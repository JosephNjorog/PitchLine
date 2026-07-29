import type { Sport } from '../../types'

interface SportFilterChipsProps {
  sports: Sport[]
  selected: Sport | null
  onSelect: (sport: Sport | null) => void
}

export function SportFilterChips({ sports, selected, onSelect }: SportFilterChipsProps) {
  if (sports.length < 2) return null

  return (
    <div className="scroll-x-hide flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
          selected === null ? 'bg-pitch-900 text-white' : 'bg-sand text-ink-500'
        }`}
      >
        All
      </button>
      {sports.map((sport) => (
        <button
          key={sport}
          type="button"
          onClick={() => onSelect(sport)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
            selected === sport ? 'bg-pitch-900 text-white' : 'bg-sand text-ink-500'
          }`}
        >
          {sport}
        </button>
      ))}
    </div>
  )
}
