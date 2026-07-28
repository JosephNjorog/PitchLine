import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Only the fan dashboard shell is built; other roles land on their coming-soon stub. */
export function RequireFanRole() {
  const { user } = useAuth()
  if (user?.role && user.role !== 'fan') {
    return <Navigate to={`/onboarding/coming-soon/${user.role}`} replace />
  }
  return <Outlet />
}
