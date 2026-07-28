import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../ui/Logo'

const TABS = [
  { to: '/institutional/discover', label: 'Discover' },
  { to: '/institutional/manage', label: 'Manage' },
  { to: '/institutional/account', label: 'Account' },
]

export function InstitutionalLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col bg-surface-50 px-4 md:px-8">
      <header className="sticky top-0 z-30 -mx-4 flex items-center gap-1 border-b border-ink-500/10 bg-surface-50/95 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur md:-mx-8 md:px-8">
        <span className="mr-4 hidden items-center gap-2 font-bold text-ink-900 md:flex">
          <Logo size={24} />
          PitchLine
        </span>
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `rounded-t-lg border-b-2 px-3 py-3 text-sm font-semibold ${
                isActive ? 'border-pitch-700 text-pitch-700' : 'border-transparent text-ink-500'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </header>
      <main className="flex-1 overflow-y-auto py-4">
        <Outlet />
      </main>
    </div>
  )
}
