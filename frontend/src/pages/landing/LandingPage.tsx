import { Navigate } from 'react-router-dom'
import { HeroSection } from '../../features/landing/HeroSection'
import { AudienceSection } from '../../features/landing/AudienceSection'
import { useAuth } from '../../context/AuthContext'
import { dashboardPathForRole } from '../../lib/roleRouting'

export function LandingPage() {
  const { isAuthenticated, onboardingComplete, user } = useAuth()
  if (isAuthenticated && onboardingComplete) {
    return <Navigate to={dashboardPathForRole(user?.role)} replace />
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gradient-to-b from-ink-900 to-pitch-900">
      <HeroSection />
      <div className="flex flex-col gap-3 px-4 py-8">
        <AudienceSection
          icon="📣"
          title="For fans"
          description="Follow your team, never miss a result."
        />
        <AudienceSection
          icon="📋"
          title="For coaches"
          description="Register your team in minutes, from any phone."
          delayMs={80}
        />
        <AudienceSection
          icon="🔎"
          title="For scouts and sponsors"
          description="Discover talent, back a team, see the impact."
          delayMs={160}
        />
      </div>
    </div>
  )
}
