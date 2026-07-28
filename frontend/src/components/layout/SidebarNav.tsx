import { NavLink } from 'react-router-dom'
import { Logo } from '../ui/Logo'
import type { ShellNavTab } from './ShellNav'

export function SidebarNav({ tabs }: { tabs: ShellNavTab[] }) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-border bg-sand p-6 md:flex">
      <div className="mb-8 flex items-center gap-2.5">
        <Logo size={28} />
        <span className="text-lg font-bold text-ink-900">PitchLine</span>
      </div>
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium ${
              isActive ? 'font-semibold text-ink-900' : 'text-ink-500 hover:text-ink-900'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </aside>
  )
}
