import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { useOnboarding } from '../../../context/OnboardingContext'
import { useAuth } from '../../../context/AuthContext'
import { useMyOrg } from '../../../context/MyOrgContext'

export function SubscriptionTrialPage() {
  const navigate = useNavigate()
  const { orgDraft, reset } = useOnboarding()
  const { completeOnboarding } = useAuth()
  const { registerOrg, startTrial } = useMyOrg()

  function handleStartTrial() {
    registerOrg({ name: orgDraft.name, kind: 'scout', focusSports: orgDraft.focusSports, region: orgDraft.region })
    startTrial()
    completeOnboarding('scout')
    reset()
    navigate('/institutional', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Start your trial" showBack />
      <div className="flex flex-1 flex-col gap-4 px-4 py-6">
        <Card className="flex flex-col gap-2">
          <p className="font-semibold text-ink-900">14-day free trial</p>
          <p className="text-sm text-ink-500">
            Full access to the participation database, athlete search, and CSV export for {orgDraft.name || 'your organization'}. No card required for this demo.
          </p>
        </Card>
      </div>
      <div className="sticky bottom-0 border-t border-ink-500/10 bg-surface-50 px-4 py-3">
        <Button size="lg" className="w-full" onClick={handleStartTrial}>
          Start trial
        </Button>
      </div>
    </div>
  )
}
