import { Navigate } from 'react-router-dom'
import { useMyOrg } from '../../context/MyOrgContext'

export function IndexRedirect() {
  const { myOrg } = useMyOrg()
  return <Navigate to={myOrg?.kind === 'league' ? '/institutional/manage' : '/institutional/discover'} replace />
}
