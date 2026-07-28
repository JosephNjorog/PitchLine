import { createContext, useContext, useState, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Account, Role } from '../types'

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

interface AuthContextValue extends Session {
  pendingPhone: string | null
  signInWithGoogle: () => void
  sendOtp: (phone: string) => void
  verifyOtp: (code: string) => boolean
  signOut: () => void
  completeOnboarding: (role: Role) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

let nextAccountId = 1

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useLocalStorage<Session>('pitchline:session', EMPTY_SESSION)
  const [pendingPhone, setPendingPhone] = useState<string | null>(null)

  function signInWithGoogle() {
    setSession((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: prev.user ?? {
        id: `acc-${nextAccountId++}`,
        name: 'Achieng Wanjala',
        email: 'achieng.wanjala@gmail.com',
        role: null,
      },
    }))
  }

  function sendOtp(phone: string) {
    setPendingPhone(phone)
  }

  function verifyOtp(code: string) {
    const isValid = /^\d{6}$/.test(code)
    if (!isValid || !pendingPhone) return false
    setSession((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: prev.user ?? {
        id: `acc-${nextAccountId++}`,
        name: 'Team PitchLine Fan',
        phone: pendingPhone,
        role: null,
      },
    }))
    setPendingPhone(null)
    return true
  }

  function signOut() {
    setSession(EMPTY_SESSION)
    setPendingPhone(null)
  }

  function completeOnboarding(role: Role) {
    setSession((prev) => ({
      ...prev,
      onboardingComplete: true,
      user: prev.user ? { ...prev.user, role } : prev.user,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...session,
        pendingPhone,
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
