import type { ReactNode } from 'react'

/**
 * The app's signature "inset sheet" frame: a wide rounded card floating on a
 * cream page background, per the approved mockups. Used for pages that want
 * the full editorial treatment (landing, auth, role select, dashboards).
 */
export function SiteCard({
  children,
  maxWidth = '1400px',
  fullHeight = false,
}: {
  children: ReactNode
  maxWidth?: string
  fullHeight?: boolean
}) {
  return (
    <div className="min-h-screen w-full bg-cream px-2 py-2 sm:px-6 sm:py-6">
      <div
        className={`mx-auto flex w-full flex-col overflow-hidden rounded-[20px] border border-border bg-paper sm:rounded-[28px] ${
          fullHeight ? 'md:min-h-[calc(100vh-3rem)]' : ''
        }`}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  )
}
