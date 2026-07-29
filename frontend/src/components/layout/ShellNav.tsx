import { NavLink } from 'react-router-dom'

export interface ShellNavTab {
  to: string
  label: string
  icon?: string
  end?: boolean
}

export function ShellNav({ tabs, activeClassName = 'text-pitch-900' }: { tabs: ShellNavTab[]; activeClassName?: string }) {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-border bg-paper pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex w-full max-w-2xl">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex-1 py-3.5 text-center text-sm transition-colors ${isActive ? `font-bold ${activeClassName}` : 'font-medium text-ink-500'}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
