import { Outlet } from 'react-router-dom'
import { SiteCard } from './SiteCard'
import { SidebarNav } from './SidebarNav'
import { ShellNav, type ShellNavTab } from './ShellNav'

const TABS: ShellNavTab[] = [
  { to: '/team', label: 'Home', end: true },
  { to: '/team/fixtures', label: 'Fixtures' },
  { to: '/team/followers', label: 'Followers' },
  { to: '/team/profile', label: 'Team' },
]

export function TeamDashboardLayout() {
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
          <ShellNav tabs={TABS} activeClassName="text-amber-600" />
        </div>
      </div>
    </SiteCard>
  )
}
