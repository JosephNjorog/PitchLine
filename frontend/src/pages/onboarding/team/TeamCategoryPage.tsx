import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Toggle } from '../../../components/ui/Toggle'
import { useOnboarding } from '../../../context/OnboardingContext'

export function TeamCategoryPage() {
  const navigate = useNavigate()
  const { teamDraft, updateTeamDraft } = useOnboarding()
  const isAdaptive = teamDraft.category === 'adaptive'

  const canContinue = !isAdaptive || teamDraft.disabilityCategory.trim().length > 0

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Team category" showBack />
      <div className="flex flex-1 flex-col gap-4 px-4 py-6">
        <Card>
          <Toggle
            checked={isAdaptive}
            onChange={(checked) => updateTeamDraft({ category: checked ? 'adaptive' : 'standard' })}
            label="Adaptive / para-sports club"
            description="Turn this on if the team is for athletes with disabilities."
          />
        </Card>
        {isAdaptive && (
          <Input
            label="Disability category"
            placeholder="e.g. Wheelchair basketball, Blind football"
            value={teamDraft.disabilityCategory}
            onChange={(e) => updateTeamDraft({ disabilityCategory: e.target.value })}
          />
        )}
      </div>
      <div className="sticky bottom-0 border-t border-ink-500/10 bg-surface-50 px-4 py-3">
        <Button
          size="lg"
          className="w-full"
          disabled={!canContinue}
          onClick={() => navigate('/onboarding/team/confirm')}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
