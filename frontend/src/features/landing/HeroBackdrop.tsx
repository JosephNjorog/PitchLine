import { useState, type MouseEvent, type ReactNode } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
}

/** Dark animated backdrop for the landing hero: grid overlay, floating dots, mouse-follow glow, click ripples. */
export function HeroBackdrop({ children }: { children: ReactNode }) {
  const [gradientStyle, setGradientStyle] = useState({ left: '0px', top: '0px', opacity: 0 })
  const [ripples, setRipples] = useState<Ripple[]>([])

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    setGradientStyle({ left: `${e.clientX}px`, top: `${e.clientY}px`, opacity: 1 })
  }

  function handleMouseLeave() {
    setGradientStyle((prev) => ({ ...prev, opacity: 0 }))
  }

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 900)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative overflow-hidden bg-gradient-to-br from-pitch-900 via-black to-ink-900 text-white"
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="pitchlineGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(245,165,36,0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pitchlineGrid)" />
        <line x1="0" y1="22%" x2="100%" y2="22%" className="hero-grid-line" style={{ animationDelay: '0.4s' }} />
        <line x1="0" y1="78%" x2="100%" y2="78%" className="hero-grid-line" style={{ animationDelay: '0.9s' }} />
        <circle cx="15%" cy="20%" r="2" className="hero-detail-dot" style={{ animationDelay: '2.4s' }} />
        <circle cx="85%" cy="20%" r="2" className="hero-detail-dot" style={{ animationDelay: '2.6s' }} />
        <circle cx="85%" cy="80%" r="2" className="hero-detail-dot" style={{ animationDelay: '2.8s' }} />
      </svg>

      <div className="hero-float-particle" style={{ top: '22%', left: '12%', animationDelay: '0.3s' }} />
      <div className="hero-float-particle" style={{ top: '65%', left: '88%', animationDelay: '0.8s' }} />
      <div className="hero-float-particle" style={{ top: '45%', left: '8%', animationDelay: '1.3s' }} />

      <div
        className="hero-mouse-gradient h-72 w-72 blur-3xl"
        style={{ left: gradientStyle.left, top: gradientStyle.top, opacity: gradientStyle.opacity }}
      />
      {ripples.map((r) => (
        <div key={r.id} className="hero-ripple" style={{ left: r.x, top: r.y }} />
      ))}

      <div className="relative z-10">{children}</div>
    </div>
  )
}
