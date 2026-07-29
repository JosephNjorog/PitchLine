import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Toggle } from '../../../components/ui/Toggle'
import { TopBar } from '../../../components/layout/TopBar'
import { useOnboarding } from '../../../context/OnboardingContext'
import { useFollowedTeams } from '../../../context/FollowedTeamsContext'
import { useAuth } from '../../../context/AuthContext'
import { useAlertPreference } from '../../../hooks/useAlertPreference'

export function AlertPrefsPage() {
  const navigate = useNavigate()
  const { selectedTeamIds, reset } = useOnboarding()
  const { followMany } = useFollowedTeams()
  const { completeOnboarding } = useAuth()
  const [alertPreference, setAlertPreference] = useAlertPreference()

  async function handleFinish() {
    followMany(selectedTeamIds)
    await completeOnboarding('fan')
    reset()
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Result alerts" showBack />
      <div className="flex flex-1 flex-col gap-4 px-4 py-6">
        <p className="text-sm text-ink-500">
          You'll always get in-app results. Want them by SMS too? SMS costs money to send, so it's
          off by default.
        </p>
        <Card>
          <Toggle
            checked={alertPreference === 'in-app+sms'}
            onChange={(checked) => setAlertPreference(checked ? 'in-app+sms' : 'in-app')}
            label="Also send result alerts by SMS"
            description="Otherwise you'll just get them in-app."
          />
        </Card>
      </div>
      <div className="sticky bottom-0 border-t border-ink-500/10 bg-cream px-4 py-3">
        <Button size="lg" className="w-full" onClick={handleFinish}>
          Finish
        </Button>
      </div>
    </div>
  )
}
