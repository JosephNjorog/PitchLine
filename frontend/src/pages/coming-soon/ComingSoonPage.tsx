import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'

const COPY: Record<string, { icon: string; title: string; description: string }> = {
  team: {
    icon: '📋',
    title: 'Team management is coming soon',
    description:
      "We're still building the coach dashboard — fixture creation, result submission, and follower stats. For now, explore PitchLine as a fan.",
  },
  scout: {
    icon: '🔎',
    title: 'Scout tools are coming soon',
    description:
      "Athlete and team search, filters by region and age group, and export are on the way. For now, explore PitchLine as a fan.",
  },
  league: {
    icon: '🏛️',
    title: 'League admin tools are coming soon',
    description:
      'Fixture and standings management for county and school federations is on the way. For now, explore PitchLine as a fan.',
  },
}

export function ComingSoonPage() {
  const { role } = useParams()
  const navigate = useNavigate()
  const copy = (role && COPY[role]) || COPY.team

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10">
      <EmptyState icon={copy.icon} title={copy.title} description={copy.description} />
      <Button size="lg" onClick={() => navigate('/onboarding/fan/teams')}>
        Continue as a fan instead
      </Button>
      <Button variant="ghost" onClick={() => navigate('/onboarding')}>
        Back to role selection
      </Button>
    </div>
  )
}
