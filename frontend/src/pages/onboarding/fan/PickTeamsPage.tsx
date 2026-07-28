import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { TopBar } from '../../../components/layout/TopBar'
import { TeamSearchList } from '../../../features/onboarding/fan/TeamSearchList'
import { useOnboarding } from '../../../context/OnboardingContext'

export function PickTeamsPage() {
  const navigate = useNavigate()
  const { selectedTeamIds, toggleTeam } = useOnboarding()

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Pick your teams" showBack />
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        <p className="text-sm text-ink-500">
          Pick at least one team to follow — this seeds your home feed.
        </p>
        <TeamSearchList selectedTeamIds={selectedTeamIds} onToggle={toggleTeam} />
      </div>
      <div className="sticky bottom-0 border-t border-ink-500/10 bg-surface-50 px-4 py-3">
        <Button
          size="lg"
          className="w-full"
          disabled={selectedTeamIds.length === 0}
          onClick={() => navigate('/onboarding/fan/alerts')}
        >
          Continue{selectedTeamIds.length > 0 ? ` (${selectedTeamIds.length})` : ''}
        </Button>
      </div>
    </div>
  )
}
