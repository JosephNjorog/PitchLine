interface RoleCardProps {
  icon: string
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

export function RoleCard({ icon, title, description, selected, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-row items-center gap-4 rounded-2xl p-5 text-left transition-colors sm:flex-col sm:items-center sm:text-center ${
        selected ? 'bg-pitch-900/10 ring-2 ring-pitch-900' : 'bg-sand ring-2 ring-transparent'
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pitch-900 text-lg">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="mt-0.5 text-sm text-ink-500">{description}</p>
      </div>
    </button>
  )
}
