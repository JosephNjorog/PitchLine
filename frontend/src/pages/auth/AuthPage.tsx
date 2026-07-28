import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { GoogleMockButton } from '../../features/auth/GoogleMockButton'
import { PhoneInput } from '../../features/auth/PhoneInput'
import { useAuth } from '../../context/AuthContext'

export function AuthPage() {
  const navigate = useNavigate()
  const { signInWithGoogle, sendOtp, isAuthenticated, onboardingComplete } = useAuth()
  const [showPhoneEntry, setShowPhoneEntry] = useState(false)
  const [phone, setPhone] = useState('')

  if (isAuthenticated) {
    return <Navigate to={onboardingComplete ? '/dashboard' : '/onboarding'} replace />
  }

  function goPastAuth() {
    navigate(onboardingComplete ? '/dashboard' : '/onboarding', { replace: true })
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
    <div className="flex flex-1 flex-col justify-center gap-6 px-4 py-10">
      <div className="text-center">
        <h1 className="text-xl font-bold text-ink-900">Welcome to PitchLine</h1>
        <p className="mt-1 text-sm text-ink-500">No passwords. Just pick a way in.</p>
      </div>

      {!showPhoneEntry ? (
        <div className="flex flex-col gap-3">
          <GoogleMockButton onClick={handleGoogle} />
          <Button variant="ghost" size="lg" onClick={() => setShowPhoneEntry(true)}>
            Use phone number instead
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <PhoneInput value={phone} onChange={setPhone} />
          <Button size="lg" onClick={handleSendCode} disabled={phone.trim().length < 9}>
            Send code
          </Button>
          <Button variant="ghost" onClick={() => setShowPhoneEntry(false)}>
            Back
          </Button>
        </div>
      )}
    </div>
  )
}
