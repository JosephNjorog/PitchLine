import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth() {
  const { isAuthenticated, authLoading } = useAuth()
  if (authLoading) return null
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <Outlet />
}
