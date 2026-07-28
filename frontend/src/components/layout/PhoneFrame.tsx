import type { ReactNode } from 'react'

/**
 * App-like container for the feed-style shells (landing/auth/onboarding, Fan, Team).
 * Full width on phone; centers as a fixed-width card on desktop so the app doesn't
 * stretch into an unstyled column in a wide browser window.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full justify-center md:py-8">
      <div className="flex w-full flex-col bg-surface-50 md:max-w-md md:overflow-hidden md:rounded-2xl md:border md:border-ink-500/10 md:shadow-card">
        {children}
      </div>
    </div>
  )
}
