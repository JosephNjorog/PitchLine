import { BADGE_DEFINITIONS, type BadgeStats } from '../../lib/badges'

export function BadgesSection({ stats }: { stats: BadgeStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {BADGE_DEFINITIONS.map((badge) => {
        const earned = badge.isEarned(stats)
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1.5 rounded-2xl px-3 py-4 text-center ${
              earned ? 'bg-amber-tint' : 'bg-sand opacity-50'
            }`}
          >
            <span className="text-2xl">{badge.icon}</span>
            <p className="text-xs font-semibold text-ink-900">{badge.title}</p>
            <p className="text-[11px] text-ink-500">{badge.description}</p>
          </div>
        )
      })}
    </div>
  )
}
