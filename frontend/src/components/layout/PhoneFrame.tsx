import type { ReactNode } from 'react'

/**
 * Full-bleed pass-through wrapper. Backgrounds fill the whole viewport at any width;
 * individual shells/pages center their own readable content column where needed.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen w-full flex-1 flex-col">{children}</div>
}
