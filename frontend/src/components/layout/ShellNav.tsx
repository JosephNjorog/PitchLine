import { NavLink } from 'react-router-dom'

export interface ShellNavTab {
  to: string
  label: string
  icon: string
  end?: boolean
}

export function ShellNav({ tabs, activeClassName = 'text-pitch-700' }: { tabs: ShellNavTab[]; activeClassName?: string }) {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-ink-500/10 bg-surface-0/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-2xl">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                isActive ? activeClassName : 'text-ink-500'
              }`
            }
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
