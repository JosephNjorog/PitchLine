import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-pitch-500 text-white shadow-[0_4px_14px_rgba(31,165,87,0.35)] hover:bg-pitch-400 hover:shadow-[0_6px_20px_rgba(31,165,87,0.45)] disabled:bg-ink-500/30 disabled:shadow-none',
  secondary: 'bg-paper text-ink-900 border border-border hover:border-ink-900/20 hover:bg-sand',
  ghost: 'bg-transparent text-ink-900 hover:bg-sand',
  danger: 'bg-danger text-white hover:bg-danger/90',
}

const sizeClasses: Record<Size, string> = {
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3.5 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-tight transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
