import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Guards routes that need a completed onboarding step (i.e. the dashboard). */
export function RequireOnboarded() {
  const { onboardingComplete } = useAuth()
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />
  return <Outlet />
}
