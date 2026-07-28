import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { SiteCard } from '../../components/layout/SiteCard'
import { RoleCard } from '../../features/onboarding/RoleCard'

const ROLES = [
  {
    id: 'team',
    icon: '📋',
    title: 'Team rep / coach',
    description: 'Register a team, submit results',
    path: '/onboarding/team/details',
  },
  {
    id: 'fan',
    icon: '🙌',
    title: 'Fan',
    description: 'Follow teams, vote, back a player',
    path: '/onboarding/fan/teams',
  },
  {
    id: 'scout',
    icon: '🔎',
    title: 'Scout / academy',
    description: 'Search athletes and teams',
    path: '/onboarding/institutional/scout/org',
  },
  {
    id: 'league',
    icon: '🏛️',
    title: 'League admin',
    description: 'Manage fixtures and standings',
    path: '/onboarding/institutional/league/org',
  },
] as const

export function RoleSelectPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<(typeof ROLES)[number]['id'] | null>(null)

  function handleContinue() {
    const role = ROLES.find((r) => r.id === selected)
    if (role) navigate(role.path)
  }

  return (
    <SiteCard maxWidth="1040px">
      <div className="flex flex-col gap-8 px-6 py-12 sm:px-10">
        <h1 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">
          What brings you to PitchLine?
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {ROLES.map((role) => (
            <RoleCard
              key={role.id}
              icon={role.icon}
              title={role.title}
              description={role.description}
              selected={selected === role.id}
              onClick={() => setSelected(role.id)}
            />
          ))}
        </div>

        <Button size="lg" className="mx-auto w-full sm:w-auto sm:px-16" disabled={!selected} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </SiteCard>
  )
}
