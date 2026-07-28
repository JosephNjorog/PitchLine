import { NavLink, Outlet } from 'react-router-dom'
import { SiteCard } from './SiteCard'
import { Logo } from '../ui/Logo'

const TABS = [
  { to: '/institutional/discover', label: 'Discover' },
  { to: '/institutional/manage', label: 'Manage' },
  { to: '/institutional/account', label: 'Account' },
]

export function InstitutionalLayout() {
  return (
    <SiteCard maxWidth="1200px" fullHeight>
      <header className="flex items-center gap-1 border-b border-border px-5 sm:px-8">
        <span className="mr-6 hidden items-center gap-2 font-bold text-ink-900 md:flex">
          <Logo size={24} />
          PitchLine
        </span>
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `border-b-2 px-3 py-4 text-sm font-semibold ${
                isActive ? 'border-pitch-900 text-pitch-900' : 'border-transparent text-ink-500'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </header>
      <main className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
        <Outlet />
      </main>
    </SiteCard>
  )
}
