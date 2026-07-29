import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { useCatalog } from '../../context/CatalogContext'
import { useShortlist } from '../../context/ShortlistContext'
import type { Athlete } from '../../types'

export function AthleteResultCard({ athlete }: { athlete: Athlete }) {
  const { getTeamById } = useCatalog()
  const team = getTeamById(athlete.teamId)
  const { isAthleteShortlisted, toggleAthlete } = useShortlist()
  const shortlisted = isAthleteShortlisted(athlete.id)

  if (!team) return null

  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-500/15 bg-paper p-3">
      <Avatar name={athlete.name} color={team.crestColor} size={40} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink-900">{athlete.name}</p>
        <p className="truncate text-xs text-ink-500">
          {athlete.position} · {athlete.ageGroup} · {team.name}
        </p>
      </div>
      <Badge tone="neutral">{team.county}</Badge>
      <button
        type="button"
        onClick={() => toggleAthlete(athlete.id)}
        aria-label={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
        className={`shrink-0 text-lg ${shortlisted ? 'text-amber-600' : 'text-ink-500/40 hover:text-ink-500'}`}
      >
        {shortlisted ? '★' : '☆'}
      </button>
    </div>
  )
}
