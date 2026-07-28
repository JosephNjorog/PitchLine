import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-surface-0 p-4 shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
