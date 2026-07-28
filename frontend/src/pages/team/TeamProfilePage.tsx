import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useMyTeam } from '../../context/MyTeamContext'
import { useAuth } from '../../context/AuthContext'

export function TeamProfilePage() {
  const navigate = useNavigate()
  const { myTeam } = useMyTeam()
  const { signOut } = useAuth()

  function handleSignOut() {
    signOut()
    navigate('/', { replace: true })
  }

  if (!myTeam) return null

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PageHeader title="Team profile" />
      <div className="flex items-center gap-3 px-4">
        <Avatar name={myTeam.name} color={myTeam.crestColor} size={56} />
        <div>
          <p className="font-bold text-ink-900">{myTeam.name}</p>
          <p className="text-sm text-ink-500">{myTeam.county}</p>
        </div>
      </div>
      <div className="px-4">
        <Card className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-500">Sport</span>
            <span className="font-medium capitalize text-ink-900">{myTeam.sport}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">Category</span>
            <span className="font-medium capitalize text-ink-900">{myTeam.category}</span>
          </div>
          {myTeam.category === 'adaptive' && (
            <div className="flex justify-between">
              <span className="text-ink-500">Disability category</span>
              <span className="font-medium text-ink-900">{myTeam.disabilityCategory}</span>
            </div>
          )}
        </Card>
      </div>
      <div className="px-4">
        <Button variant="secondary" className="w-full" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}
