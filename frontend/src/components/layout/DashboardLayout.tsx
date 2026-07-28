import { Outlet } from 'react-router-dom'
import { ShellNav, type ShellNavTab } from './ShellNav'

const TABS: ShellNavTab[] = [
  { to: '/dashboard', label: 'Home', icon: '🏠', end: true },
  { to: '/dashboard/predictions', label: 'Predict', icon: '⚽' },
  { to: '/dashboard/sponsor', label: 'Sponsor', icon: '🤝' },
  { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
]

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <main className="flex-1 overflow-y-auto pb-4">
        <Outlet />
      </main>
      <ShellNav tabs={TABS} activeClassName="text-pitch-700" />
    </div>
  )
}
