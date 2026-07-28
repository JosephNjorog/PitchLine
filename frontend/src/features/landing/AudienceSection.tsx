import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'

interface AudienceSectionProps {
  icon: string
  title: string
  description: string
  delayMs?: number
}

export function AudienceSection({ icon, title, description, delayMs = 0 }: AudienceSectionProps) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </div>
  )
}
