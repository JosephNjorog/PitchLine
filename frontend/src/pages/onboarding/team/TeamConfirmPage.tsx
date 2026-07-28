import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useOnboarding } from '../../../context/OnboardingContext'
import { useAuth } from '../../../context/AuthContext'
import { useMyTeam } from '../../../context/MyTeamContext'

export function TeamConfirmPage() {
  const navigate = useNavigate()
  const { teamDraft, updateTeamDraft, reset } = useOnboarding()
  const { user, completeOnboarding } = useAuth()
  const { registerTeam } = useMyTeam()
  const [phone, setPhone] = useState(teamDraft.phone || user?.phone || '')
  const [confirmed, setConfirmed] = useState(false)

  function handleConfirm() {
    updateTeamDraft({ phone })
    registerTeam({
      name: teamDraft.name,
      sport: teamDraft.sport,
      county: teamDraft.county,
      category: teamDraft.category,
      disabilityCategory: teamDraft.category === 'adaptive' ? teamDraft.disabilityCategory : undefined,
      crestColor: '#14532D',
    })
    completeOnboarding('team')
    setConfirmed(true)
  }

  function handleContinue() {
    reset()
    navigate('/team', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Confirm your number" showBack />
      <div className="flex flex-1 flex-col gap-4 px-4 py-6">
        {!confirmed ? (
          <>
            <p className="text-sm text-ink-500">
              We'll send your team's follow code and a confirmation SMS to this number.
            </p>
            <Input
              label="Phone number"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </>
        ) : (
          <div className="flex flex-col gap-2 rounded-2xl bg-pitch-900/5 p-4">
            <p className="font-semibold text-ink-900">✅ Confirmation SMS sent</p>
            <p className="text-sm text-ink-500">
              "Your PitchLine team account is set up. Follow code: {teamDraft.name.slice(0, 3).toUpperCase()}
              {String(Date.now()).slice(-4)}. [PWA link]"
            </p>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 border-t border-ink-500/10 bg-cream px-4 py-3">
        {!confirmed ? (
          <Button size="lg" className="w-full" disabled={phone.trim().length < 9} onClick={handleConfirm}>
            Confirm
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={handleContinue}>
            Go to my team dashboard
          </Button>
        )}
      </div>
    </div>
  )
}
