import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { useShortlist } from '../../context/ShortlistContext'
import type { Team } from '../../types'

export function TeamResultCard({ team }: { team: Team }) {
  const { isTeamShortlisted, toggleTeam } = useShortlist()
  const shortlisted = isTeamShortlisted(team.id)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-500/15 bg-paper p-3">
      <Avatar name={team.name} color={team.crestColor} size={40} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink-900">{team.name}</p>
        <p className="truncate text-xs text-ink-500 capitalize">
          {team.county} · {team.sport}
          {team.category === 'adaptive' ? ` · ${team.disabilityCategory}` : ''}
        </p>
      </div>
      <Badge tone="neutral">{team.followerCount} followers</Badge>
      <button
        type="button"
        onClick={() => toggleTeam(team.id)}
        aria-label={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
        className={`shrink-0 text-lg ${shortlisted ? 'text-amber-600' : 'text-ink-500/40 hover:text-ink-500'}`}
      >
        {shortlisted ? '★' : '☆'}
      </button>
    </div>
  )
}
