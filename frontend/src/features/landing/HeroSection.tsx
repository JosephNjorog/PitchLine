import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Logo } from '../../components/ui/Logo'
import { AnimatedWords } from './AnimatedWords'
import { HeroBackdrop } from './HeroBackdrop'
import { LiveScoreStrip } from './LiveScoreStrip'

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <HeroBackdrop>
      <div className="flex flex-col gap-8 px-6 pb-8 pt-14 text-center sm:pt-20">
        <div>
          <div
            className="mx-auto opacity-0"
            style={{ animation: 'word-appear 0.8s ease-out forwards', animationDelay: '0ms' }}
          >
            <Logo size={44} />
          </div>
          <h2 className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-white/60">
            <AnimatedWords text="Every match. Every county." startDelay={100} />
          </h2>
          <div
            className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-sun-500/60 to-transparent opacity-0"
            style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '900ms' }}
          />
        </div>

        <h1 className="mx-auto max-w-md">
          <span className="hero-underline mb-3 block text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            <AnimatedWords text="Grassroots sport," startDelay={1000} />
          </span>
          <span className="block text-lg font-light leading-snug text-white/70 sm:text-xl">
            <AnimatedWords text="real teams, real fans, right on your phone." startDelay={1600} stagger={90} />
          </span>
        </h1>

        <div
          className="opacity-0"
          style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '3200ms' }}
        >
          <LiveScoreStrip />
        </div>

        <div
          className="flex flex-col items-center gap-3 opacity-0"
          style={{ animation: 'word-appear 0.8s ease-out forwards', animationDelay: '3600ms' }}
        >
          <Button size="lg" className="w-full max-w-xs" onClick={() => navigate('/auth')}>
            Get started
          </Button>
          <p className="text-xs uppercase tracking-[0.15em] text-white/40">
            Follow · Vote · Back your team
          </p>
        </div>
      </div>
    </HeroBackdrop>
  )
}
