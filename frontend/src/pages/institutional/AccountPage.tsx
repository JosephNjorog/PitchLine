import { useNavigate } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useMyOrg } from '../../context/MyOrgContext'
import { useAuth } from '../../context/AuthContext'

export function AccountPage() {
  const navigate = useNavigate()
  const { myOrg, activateSubscription } = useMyOrg()
  const { signOut } = useAuth()

  function handleSignOut() {
    signOut()
    navigate('/', { replace: true })
  }

  if (!myOrg) return null

  return (
    <div className="flex max-w-md flex-col gap-4">
      <h2 className="text-lg font-bold text-ink-900">Account</h2>
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-ink-900">{myOrg.name}</p>
          <Badge tone={myOrg.subscriptionStatus === 'trial' ? 'scheduled' : 'success'}>
            {myOrg.subscriptionStatus === 'trial' ? 'Trial' : 'Active'}
          </Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">Type</span>
          <span className="font-medium capitalize text-ink-900">
            {myOrg.kind === 'scout' ? 'Scout / academy' : 'League admin'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">Region</span>
          <span className="font-medium text-ink-900">{myOrg.region}</span>
        </div>
        {myOrg.focusSports.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-ink-500">Focus sports</span>
            <span className="font-medium capitalize text-ink-900">{myOrg.focusSports.join(', ')}</span>
          </div>
        )}
      </Card>
      {myOrg.subscriptionStatus === 'trial' && (
        <Button onClick={() => void activateSubscription()}>Upgrade to active subscription</Button>
      )}
      <Button variant="secondary" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  )
}
