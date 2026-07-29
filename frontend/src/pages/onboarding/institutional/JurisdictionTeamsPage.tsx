import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { TeamSearchList } from '../../../features/teams/TeamSearchList'
import { useOnboarding } from '../../../context/OnboardingContext'
import { useAuth } from '../../../context/AuthContext'
import { useMyOrg } from '../../../context/MyOrgContext'

export function JurisdictionTeamsPage() {
  const navigate = useNavigate()
  const { orgDraft, jurisdictionTeamIds, toggleJurisdictionTeam, reset } = useOnboarding()
  const { completeOnboarding } = useAuth()
  const { registerOrg, setJurisdictionTeams } = useMyOrg()

  async function finish() {
    registerOrg({ name: orgDraft.name, kind: 'league', focusSports: [], region: orgDraft.region })
    setJurisdictionTeams(jurisdictionTeamIds)
    await completeOnboarding('league')
    reset()
    navigate('/institutional', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Teams under your jurisdiction" showBack />
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        <p className="text-sm text-ink-500">
          Optional — pick the registered teams your federation covers. You can add more later.
        </p>
        <TeamSearchList selectedTeamIds={jurisdictionTeamIds} onToggle={toggleJurisdictionTeam} />
      </div>
      <div className="sticky bottom-0 flex gap-2 border-t border-ink-500/10 bg-cream px-4 py-3">
        <Button variant="secondary" className="flex-1" onClick={finish}>
          Skip for now
        </Button>
        <Button className="flex-1" onClick={finish}>
          Continue{jurisdictionTeamIds.length > 0 ? ` (${jurisdictionTeamIds.length})` : ''}
        </Button>
      </div>
    </div>
  )
}
