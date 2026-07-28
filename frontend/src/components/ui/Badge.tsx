import type { ReactNode } from 'react'

type Tone = 'live' | 'scheduled' | 'completed' | 'success' | 'danger' | 'neutral'

const toneClasses: Record<Tone, string> = {
  live: 'bg-danger/10 text-danger',
  scheduled: 'bg-amber-600/15 text-amber-600',
  completed: 'bg-ink-500/10 text-ink-500',
  success: 'bg-mint-tint text-mint-text',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-pitch-900/10 text-pitch-900',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {tone === 'live' && <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse" />}
      {children}
    </span>
  )
}
