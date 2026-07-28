import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-500/25 px-6 py-10 text-center">
      {icon && <div className="text-3xl">{icon}</div>}
      <p className="font-semibold text-ink-900">{title}</p>
      {description && <p className="text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
