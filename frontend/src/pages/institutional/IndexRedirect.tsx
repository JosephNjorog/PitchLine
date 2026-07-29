import { Navigate } from 'react-router-dom'
import { useMyOrg } from '../../context/MyOrgContext'

export function IndexRedirect() {
  const { myOrg, myOrgLoading } = useMyOrg()
  if (myOrgLoading) return null
  return <Navigate to={myOrg?.kind === 'league' ? '/institutional/manage' : '/institutional/discover'} replace />
}
