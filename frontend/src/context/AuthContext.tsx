import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Account, Role } from '../types'
import { ApiError, apiGet, apiPost, clearToken, getToken, setToken, setUnauthorizedHandler } from '../lib/api'

interface Session {
  user: Account | null
  isAuthenticated: boolean
  onboardingComplete: boolean
}

const EMPTY_SESSION: Session = {
  user: null,
  isAuthenticated: false,
  onboardingComplete: false,
}

interface AccountResponse {
  id: string
  name: string
  email?: string
  phone?: string
  role: Role | null
  onboardingComplete: boolean
}

function toSession(acc: AccountResponse): Session {
  const { onboardingComplete, ...user } = acc
  return { user, isAuthenticated: true, onboardingComplete }
}

interface AuthContextValue extends Session {
  authLoading: boolean
  pendingPhone: string | null
  otpDevCode: string | null
  signInWithGoogle: (idToken: string) => Promise<void>
  sendOtp: (phone: string) => Promise<void>
  verifyOtp: (code: string) => Promise<boolean>
  signOut: () => void
  completeOnboarding: (role: Role) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(EMPTY_SESSION)
  const [authLoading, setAuthLoading] = useState(true)
  const [pendingPhone, setPendingPhone] = useState<string | null>(null)
  const [otpDevCode, setOtpDevCode] = useState<string | null>(null)

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearToken()
      setSession(EMPTY_SESSION)
    })
  }, [])

  useEffect(() => {
    if (!getToken()) {
      setAuthLoading(false)
      return
    }
    apiGet<{ account: AccountResponse }>('/me')
      .then(({ account }) => setSession(toSession(account)))
      .catch(() => clearToken())
      .finally(() => setAuthLoading(false))
  }, [])

  async function signInWithGoogle(idToken: string) {
    const { token, account } = await apiPost<{ token: string; account: AccountResponse }>(
      '/auth/google',
      { idToken },
      false,
    )
    setToken(token)
    setSession(toSession(account))
  }

  async function sendOtp(phone: string) {
    const resp = await apiPost<{ phone: string; expiresAt: string; devCode?: string }>(
      '/auth/otp/request',
      { phone },
      false,
    )
    setPendingPhone(phone)
    setOtpDevCode(resp.devCode ?? null)
  }

  async function verifyOtp(code: string) {
    if (!pendingPhone) return false
    try {
      const { token, account } = await apiPost<{ token: string; account: AccountResponse }>(
        '/auth/otp/verify',
        { phone: pendingPhone, code },
        false,
      )
      setToken(token)
      setSession(toSession(account))
      setPendingPhone(null)
      setOtpDevCode(null)
      return true
    } catch (err) {
      if (err instanceof ApiError) return false
      throw err
    }
  }

  function signOut() {
    void apiPost('/auth/signout').catch(() => {})
    clearToken()
    setSession(EMPTY_SESSION)
    setPendingPhone(null)
    setOtpDevCode(null)
  }

  async function completeOnboarding(role: Role) {
    const { account } = await apiPost<{ account: AccountResponse }>('/onboarding/complete', { role })
    setSession(toSession(account))
  }

  return (
    <AuthContext.Provider
      value={{
        ...session,
        authLoading,
        pendingPhone,
        otpDevCode,
        signInWithGoogle,
        sendOtp,
        verifyOtp,
        signOut,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
