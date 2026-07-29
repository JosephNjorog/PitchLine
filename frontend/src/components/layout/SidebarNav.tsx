import { NavLink } from 'react-router-dom'
import { Logo } from '../ui/Logo'
import type { ShellNavTab } from './ShellNav'

export function SidebarNav({ tabs, activeClassName = 'bg-pitch-900 text-white shadow-[0_4px_14px_rgba(31,165,87,0.3)]' }: { tabs: ShellNavTab[]; activeClassName?: string }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-border bg-sand p-5 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <Logo size={30} />
        <span className="text-lg font-extrabold tracking-tight text-ink-900">PitchLine</span>
      </div>
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
              isActive ? activeClassName : 'text-ink-500 hover:bg-paper hover:text-ink-900'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </aside>
  )
}
