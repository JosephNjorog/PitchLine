interface AudienceSectionProps {
  icon: string
  title: string
  description: string
}

export function AudienceSection({ icon, title, description }: AudienceSectionProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="text-sm text-ink-500">{description}</p>
      </div>
    </div>
  )
}
