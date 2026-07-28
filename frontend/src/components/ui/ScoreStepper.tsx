interface ScoreStepperProps {
  value: number
  onChange: (value: number) => void
}

export function ScoreStepper({ value, onChange }: ScoreStepperProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-9 w-9 rounded-full bg-ink-500/10 text-lg font-bold text-ink-900"
      >
        −
      </button>
      <span className="w-8 text-center text-2xl font-extrabold text-ink-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="h-9 w-9 rounded-full bg-ink-500/10 text-lg font-bold text-ink-900"
      >
        +
      </button>
    </div>
  )
}
