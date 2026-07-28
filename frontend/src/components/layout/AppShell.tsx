import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-50">
      {children}
    </div>
  )
}
