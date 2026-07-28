import { Navigate } from 'react-router-dom'
import { SiteCard } from '../../components/layout/SiteCard'
import { LandingNav } from '../../features/landing/LandingNav'
import { HeroSection } from '../../features/landing/HeroSection'
import { AudienceSection } from '../../features/landing/AudienceSection'
import { TrustedBySection } from '../../features/landing/TrustedBySection'
import { LandingFooter } from '../../features/landing/LandingFooter'
import { useAuth } from '../../context/AuthContext'
import { dashboardPathForRole } from '../../lib/roleRouting'

export function LandingPage() {
  const { isAuthenticated, onboardingComplete, user } = useAuth()
  if (isAuthenticated && onboardingComplete) {
    return <Navigate to={dashboardPathForRole(user?.role)} replace />
  }

  return (
    <SiteCard>
      <LandingNav />
      <HeroSection />

      <div id="for-coaches" className="grid grid-cols-1 gap-4 px-5 pb-10 sm:px-8 md:grid-cols-3">
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
          title="For scouts"
          description="Discover talent, back a team, see the impact."
        />
      </div>

      <div className="px-5 pb-10 sm:px-8">
        <TrustedBySection />
      </div>

      <LandingFooter />
    </SiteCard>
  )
}
