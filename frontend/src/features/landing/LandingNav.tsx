import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/ui/Logo'

export function LandingNav() {
  const navigate = useNavigate()

  return (
    <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
      <div className="flex items-center gap-2.5">
        <Logo size={30} />
        <span className="text-lg font-extrabold tracking-tight text-white">PitchLine</span>
      </div>

      <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
        <a href="#live-scores" className="transition-colors hover:text-white">
          Live scores
        </a>
        <a href="#for-coaches" className="transition-colors hover:text-white">
          For coaches
        </a>
      </nav>

      <button
        type="button"
        onClick={() => navigate('/auth')}
        className="rounded-full bg-pitch-500 px-4 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(31,165,87,0.4)] transition-all hover:bg-pitch-400 active:scale-95"
      >
        Get started
      </button>
    </header>
  )
}
