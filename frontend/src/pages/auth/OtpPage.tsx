import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/ui/Logo'
import { SiteCard } from '../../components/layout/SiteCard'
import { useAuth } from '../../context/AuthContext'
import { dashboardPathForRole } from '../../lib/roleRouting'

export function OtpPage() {
  const navigate = useNavigate()
  const { pendingPhone, verifyOtp, onboardingComplete, user, otpDevCode } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!pendingPhone) return <Navigate to="/auth" replace />

  async function handleVerify() {
    if (submitting) return
    setSubmitting(true)
    const ok = await verifyOtp(code)
    setSubmitting(false)
    if (!ok) {
      setError(true)
      return
    }
    navigate(onboardingComplete ? dashboardPathForRole(user?.role) : '/onboarding', { replace: true })
  }

  return (
    <SiteCard maxWidth="480px">
      <div className="flex flex-col items-center gap-6 px-8 py-12 sm:px-12">
        <Logo size={56} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink-900">Enter the code</h1>
          <p className="mt-1 text-ink-500">Sent to {pendingPhone}.</p>
          {otpDevCode && <p className="mt-1 text-sm text-ink-400">Dev mode code: {otpDevCode}</p>}
        </div>

        <div className="flex w-full flex-col gap-4">
          <Input
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            aria-label="6-digit code"
            value={code}
            onChange={(e) => {
              setError(false)
              setCode(e.target.value.replace(/\D/g, ''))
            }}
          />
          {error && <p className="text-sm text-danger">Enter a valid 6-digit code.</p>}
          <Button size="lg" onClick={handleVerify} disabled={code.length !== 6 || submitting}>
            {submitting ? 'Verifying…' : 'Verify'}
          </Button>
        </div>
      </div>
    </SiteCard>
  )
}
