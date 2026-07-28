import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'

export function OtpPage() {
  const navigate = useNavigate()
  const { pendingPhone, verifyOtp, onboardingComplete } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  if (!pendingPhone) return <Navigate to="/auth" replace />

  function handleVerify() {
    const ok = verifyOtp(code)
    if (!ok) {
      setError(true)
      return
    }
    navigate(onboardingComplete ? '/dashboard' : '/onboarding', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 px-4 py-10">
      <div className="text-center">
        <h1 className="text-xl font-bold text-ink-900">Enter the code</h1>
        <p className="mt-1 text-sm text-ink-500">
          Sent to {pendingPhone}. Demo mode: any 6 digits work, e.g. 123456.
        </p>
      </div>
      <Input
        label="6-digit code"
        inputMode="numeric"
        maxLength={6}
        value={code}
        onChange={(e) => {
          setError(false)
          setCode(e.target.value.replace(/\D/g, ''))
        }}
      />
      {error && <p className="text-sm text-danger">Enter a valid 6-digit code.</p>}
      <Button size="lg" onClick={handleVerify} disabled={code.length !== 6}>
        Verify
      </Button>
    </div>
  )
}
