import { Outlet } from 'react-router-dom'
import { ShellNav, type ShellNavTab } from './ShellNav'

const TABS: ShellNavTab[] = [
  { to: '/team', label: 'Home', icon: '🏠', end: true },
  { to: '/team/fixtures', label: 'Fixtures', icon: '📅' },
  { to: '/team/followers', label: 'Followers', icon: '📈' },
  { to: '/team/profile', label: 'Team', icon: '🛡️' },
]

export function TeamDashboardLayout() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <main className="flex-1 overflow-y-auto pb-4">
        <Outlet />
      </main>
      <ShellNav tabs={TABS} activeClassName="text-sun-500" />
    </div>
  )
}
