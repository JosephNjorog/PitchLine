import { Navigate } from 'react-router-dom'
import { HeroSection } from '../../features/landing/HeroSection'
import { AudienceSection } from '../../features/landing/AudienceSection'
import { useAuth } from '../../context/AuthContext'

export function LandingPage() {
  const { isAuthenticated, onboardingComplete } = useAuth()
  if (isAuthenticated && onboardingComplete) return <Navigate to="/dashboard" replace />

  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="flex flex-col divide-y divide-ink-500/10 py-2">
        <AudienceSection
          icon="📣"
          title="For fans"
          description="Follow your team, never miss a result."
        />
        <AudienceSection
          icon="📋"
          title="For coaches"
          description="Register your team in minutes, from any phone."
        />
        <AudienceSection
          icon="🔎"
          title="For scouts and sponsors"
          description="Discover talent, back a team, see the impact."
        />
      </div>
    </div>
  )
}
