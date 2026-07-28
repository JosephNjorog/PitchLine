import type { InputHTMLAttributes } from 'react'

export function SearchBar({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">
        🔍
      </span>
      <input
        type="search"
        className="w-full rounded-xl border border-transparent bg-sand py-3 pl-10 pr-4 text-base text-ink-900 outline-none placeholder:text-ink-500 focus:border-pitch-900/30 focus:ring-2 focus:ring-pitch-900/15"
        {...rest}
      />
    </div>
  )
}
