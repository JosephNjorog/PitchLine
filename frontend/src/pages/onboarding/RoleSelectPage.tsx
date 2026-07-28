import { useNavigate } from 'react-router-dom'
import { RoleCard } from '../../features/onboarding/RoleCard'

export function RoleSelectPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10">
      <div className="text-center">
        <h1 className="text-xl font-bold text-ink-900">What brings you to PitchLine?</h1>
        <p className="mt-1 text-sm text-ink-500">This decides what your home screen looks like.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RoleCard
          icon="📋"
          label="I coach or manage a team"
          onClick={() => navigate('/onboarding/team/details')}
        />
        <RoleCard icon="🙌" label="I'm a fan" onClick={() => navigate('/onboarding/fan/teams')} />
        <RoleCard
          icon="🔎"
          label="I'm a scout or from an academy"
          onClick={() => navigate('/onboarding/institutional/scout/org')}
        />
        <RoleCard
          icon="🏛️"
          label="I represent a league, school, or federation"
          onClick={() => navigate('/onboarding/institutional/league/org')}
        />
      </div>
    </div>
  )
}
