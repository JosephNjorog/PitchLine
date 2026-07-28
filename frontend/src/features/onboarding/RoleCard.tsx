interface RoleCardProps {
  icon: string
  label: string
  onClick: () => void
}

export function RoleCard({ icon, label, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start gap-3 rounded-2xl bg-surface-0 p-5 text-left shadow-card transition-transform active:scale-[0.98]"
    >
      <span className="text-3xl">{icon}</span>
      <span className="font-semibold text-ink-900">{label}</span>
    </button>
  )
}
