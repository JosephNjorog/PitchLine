import type { InputHTMLAttributes } from 'react'

export function SearchBar({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">
        🔍
      </span>
      <input
        type="search"
        className="w-full rounded-xl border border-ink-500/25 bg-surface-0 py-3 pl-10 pr-4 text-base text-ink-900 outline-none placeholder:text-ink-500 focus:border-pitch-700 focus:ring-2 focus:ring-pitch-700/20"
        {...rest}
      />
    </div>
  )
}
