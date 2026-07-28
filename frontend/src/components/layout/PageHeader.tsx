import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  showBack?: boolean
  action?: ReactNode
}

export function PageHeader({ title, showBack, action }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="-ml-1 rounded-full p-1.5 text-ink-500 hover:bg-sand"
          >
            ←
          </button>
        )}
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
      </div>
      {action}
    </div>
  )
}
