import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/dashboard', label: 'Home', icon: '🏠', end: true },
  { to: '/dashboard/predictions', label: 'Predict', icon: '⚽' },
  { to: '/dashboard/sponsor', label: 'Sponsor', icon: '🤝' },
  { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
]

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 flex border-t border-ink-500/10 bg-surface-0/95 backdrop-blur">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              isActive ? 'text-pitch-700' : 'text-ink-500'
            }`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
