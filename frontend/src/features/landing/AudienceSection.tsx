interface AudienceSectionProps {
  icon: string
  title: string
  description: string
}

export function AudienceSection({ icon, title, description }: AudienceSectionProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-sand px-6 py-7">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="mt-1 text-sm text-ink-500">{description}</p>
      </div>
    </div>
  )
}
