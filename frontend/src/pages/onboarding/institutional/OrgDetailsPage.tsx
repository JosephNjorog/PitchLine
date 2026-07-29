import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { SPORTS } from '../../../lib/sports'
import { useOnboarding } from '../../../context/OnboardingContext'
import type { Sport } from '../../../types'

export function OrgDetailsPage() {
  const { role } = useParams<{ role: 'scout' | 'league' }>()
  const navigate = useNavigate()
  const { orgDraft, updateOrgDraft } = useOnboarding()

  if (role !== 'scout' && role !== 'league') return <Navigate to="/onboarding" replace />

  function toggleSport(sport: Sport) {
    const has = orgDraft.focusSports.includes(sport)
    updateOrgDraft({
      focusSports: has
        ? orgDraft.focusSports.filter((s) => s !== sport)
        : [...orgDraft.focusSports, sport],
    })
  }

  const canContinue =
    orgDraft.name.trim().length > 0 &&
    orgDraft.region.trim().length > 0 &&
    (role !== 'scout' || orgDraft.focusSports.length > 0)

  function handleContinue() {
    updateOrgDraft({ kind: role })
    navigate(
      role === 'scout' ? '/onboarding/institutional/scout/subscription' : '/onboarding/institutional/league/jurisdiction',
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        title={role === 'scout' ? 'Your organization' : 'Your league / federation'}
        showBack
      />
      <div className="flex flex-1 flex-col gap-4 px-4 py-6">
        <Input
          label={role === 'scout' ? 'Organization name' : 'Federation / county office name'}
          placeholder={role === 'scout' ? 'e.g. Rift Valley Talent Academy' : 'e.g. Nakuru County Sports Office'}
          value={orgDraft.name}
          onChange={(e) => updateOrgDraft({ name: e.target.value })}
        />
        <Input
          label="Region"
          placeholder="e.g. Nakuru, or All counties"
          value={orgDraft.region}
          onChange={(e) => updateOrgDraft({ region: e.target.value })}
        />
        {role === 'scout' && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink-900">Focus sport(s)</span>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((sport) => {
                const active = orgDraft.focusSports.includes(sport)
                return (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                      active ? 'bg-pitch-900 text-white' : 'bg-ink-500/10 text-ink-500'
                    }`}
                  >
                    {sport}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 border-t border-ink-500/10 bg-cream px-4 py-3">
        <Button size="lg" className="w-full" disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
