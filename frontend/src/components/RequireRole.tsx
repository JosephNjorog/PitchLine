import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardPathForRole } from '../lib/roleRouting'
import type { Role } from '../types'

/** Gates a dashboard shell to the roles it was built for; anything else is sent to its own shell. */
export function RequireRole({ allow }: { allow: Role[] }) {
  const { user } = useAuth()
  if (user?.role && !allow.includes(user.role)) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }
  return <Outlet />
}
