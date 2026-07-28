import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Logo } from '../../components/ui/Logo'
import { SiteCard } from '../../components/layout/SiteCard'
import { GoogleMockButton } from '../../features/auth/GoogleMockButton'
import { PhoneInput } from '../../features/auth/PhoneInput'
import { useAuth } from '../../context/AuthContext'
import { dashboardPathForRole } from '../../lib/roleRouting'

export function AuthPage() {
  const navigate = useNavigate()
  const { signInWithGoogle, sendOtp, isAuthenticated, onboardingComplete, user } = useAuth()
  const [phone, setPhone] = useState('')

  if (isAuthenticated) {
    return <Navigate to={onboardingComplete ? dashboardPathForRole(user?.role) : '/onboarding'} replace />
  }

  function goPastAuth() {
    navigate(onboardingComplete ? dashboardPathForRole(user?.role) : '/onboarding', { replace: true })
  }

  function handleGoogle() {
    signInWithGoogle()
    goPastAuth()
  }

  function handleSendCode() {
    if (phone.trim().length < 9) return
    sendOtp(phone.trim())
    navigate('/auth/otp')
  }

  return (
    <SiteCard maxWidth="480px">
      <div className="flex flex-col items-center gap-6 px-8 py-12 sm:px-12">
        <Logo size={56} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink-900">Welcome to PitchLine</h1>
          <p className="mt-1 text-ink-500">Grassroots sport, right on your phone</p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <GoogleMockButton onClick={handleGoogle} />
          <p className="text-center text-sm text-ink-500">or</p>
          <PhoneInput value={phone} onChange={setPhone} />
          <Button size="lg" onClick={handleSendCode} disabled={phone.trim().length < 9}>
            Send code
          </Button>
        </div>

        <p className="text-center text-sm text-ink-500">By continuing you agree to the Terms</p>
      </div>
    </SiteCard>
  )
}
