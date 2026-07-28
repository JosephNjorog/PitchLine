import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import type { Team } from '../../types'

export function TeamResultCard({ team }: { team: Team }) {
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
    </div>
  )
}
