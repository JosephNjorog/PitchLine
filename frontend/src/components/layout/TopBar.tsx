import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface TopBarProps {
  title: string
  showBack?: boolean
  action?: ReactNode
}

export function TopBar({ title, showBack, action }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-500/10 bg-surface-50/95 px-4 py-3 backdrop-blur">
      {showBack && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="-ml-1 rounded-full p-1.5 text-ink-900 hover:bg-ink-900/5"
        >
          ←
        </button>
      )}
      <h1 className="flex-1 truncate text-lg font-bold text-ink-900">{title}</h1>
      {action}
    </header>
  )
}
