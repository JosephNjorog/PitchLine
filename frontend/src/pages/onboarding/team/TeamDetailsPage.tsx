import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { SPORTS } from '../../../mock-data'
import { useOnboarding } from '../../../context/OnboardingContext'
import type { Sport } from '../../../types'

export function TeamDetailsPage() {
  const navigate = useNavigate()
  const { teamDraft, updateTeamDraft } = useOnboarding()

  const canContinue = teamDraft.name.trim().length > 0 && teamDraft.county.trim().length > 0

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Register your team" showBack />
      <div className="flex flex-1 flex-col gap-4 px-4 py-6">
        <Input
          label="Team name"
          placeholder="e.g. Kibera Rangers"
          value={teamDraft.name}
          onChange={(e) => updateTeamDraft({ name: e.target.value })}
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-900">Sport</span>
          <select
            value={teamDraft.sport}
            onChange={(e) => updateTeamDraft({ sport: e.target.value as Sport })}
            className="w-full rounded-xl border border-ink-500/25 bg-paper px-4 py-3 text-base text-ink-900 outline-none focus:border-pitch-900 focus:ring-2 focus:ring-pitch-900/20"
          >
            {SPORTS.map((sport) => (
              <option key={sport} value={sport}>
                {sport[0].toUpperCase() + sport.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="County"
          placeholder="e.g. Nairobi"
          value={teamDraft.county}
          onChange={(e) => updateTeamDraft({ county: e.target.value })}
        />
      </div>
      <div className="sticky bottom-0 border-t border-ink-500/10 bg-cream px-4 py-3">
        <Button
          size="lg"
          className="w-full"
          disabled={!canContinue}
          onClick={() => navigate('/onboarding/team/category')}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
