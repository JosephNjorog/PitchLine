import { formatKes } from '../../lib/currency'

const PRESETS = [50, 100, 250, 500, 1000]

interface AmountPickerProps {
  amount: number
  onChange: (amount: number) => void
}

export function AmountPicker({ amount, onChange }: AmountPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink-500">How much would you like to send?</p>
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
              amount === preset
                ? 'border-pitch-700 bg-pitch-700 text-white'
                : 'border-ink-500/20 text-ink-900'
            }`}
          >
            {formatKes(preset)}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-900">Or enter a custom amount (KES)</span>
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={amount || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-xl border border-ink-500/25 bg-surface-0 px-4 py-3 text-base text-ink-900 outline-none focus:border-pitch-700 focus:ring-2 focus:ring-pitch-700/20"
        />
      </label>
    </div>
  )
}
