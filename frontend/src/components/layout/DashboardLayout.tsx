import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-y-auto pb-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
