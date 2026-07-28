import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, id, className = '', ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <label htmlFor={inputId} className="flex flex-col gap-1.5">
        {label && <span className="text-sm font-medium text-ink-900">{label}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border border-ink-500/25 bg-surface-0 px-4 py-3 text-base text-ink-900 outline-none placeholder:text-ink-500 focus:border-pitch-700 focus:ring-2 focus:ring-pitch-700/20 ${className}`}
          {...rest}
        />
        {hint && <span className="text-xs text-ink-500">{hint}</span>}
      </label>
    )
  },
)
Input.displayName = 'Input'
