interface AudienceSectionProps {
  icon: string
  title: string
  description: string
}

export function AudienceSection({ icon, title, description }: AudienceSectionProps) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-border bg-paper p-6 shadow-(--shadow-xs) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-md)">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-pitch-500/10 text-2xl transition-colors group-hover:bg-pitch-500/15">
        {icon}
      </span>
      <div>
        <p className="text-lg font-bold tracking-tight text-ink-900">{title}</p>
        <p className="mt-1 text-sm text-ink-500">{description}</p>
      </div>
    </div>
  )
}
