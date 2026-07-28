import { Outlet } from 'react-router-dom'
import { SiteCard } from './SiteCard'
import { SidebarNav } from './SidebarNav'
import { ShellNav, type ShellNavTab } from './ShellNav'

const TABS: ShellNavTab[] = [
  { to: '/dashboard', label: 'Home', end: true },
  { to: '/dashboard/predictions', label: 'Predict' },
  { to: '/dashboard/sponsor', label: 'Sponsor' },
  { to: '/dashboard/profile', label: 'Profile' },
]

export function DashboardLayout() {
  return (
    <SiteCard maxWidth="1200px" fullHeight>
      <div className="flex flex-1 flex-col md:flex-row">
        <SidebarNav tabs={TABS} />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
              <Outlet />
            </div>
          </main>
          <ShellNav tabs={TABS} activeClassName="text-pitch-900" />
        </div>
      </div>
    </SiteCard>
  )
}
