import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/ui/Logo'

export function LandingNav() {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-8">
      <div className="flex items-center gap-2.5">
        <Logo size={28} />
        <span className="text-lg font-bold text-ink-900">PitchLine</span>
      </div>

      <nav className="hidden items-center gap-8 text-sm font-medium text-ink-500 md:flex">
        <a href="#live-scores" className="hover:text-ink-900">
          Live scores
        </a>
        <a href="#for-coaches" className="hover:text-ink-900">
          For coaches
        </a>
      </nav>

      <button
        type="button"
        onClick={() => navigate('/auth')}
        className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-sand"
      >
        Get started
      </button>
    </header>
  )
}
