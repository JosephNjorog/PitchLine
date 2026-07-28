import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { LiveScoreStrip } from './LiveScoreStrip'

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="flex flex-col gap-5 bg-pitch-700 pb-6 pt-10 text-white">
      <div className="flex flex-col gap-3 px-4 text-center">
        <span className="mx-auto rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sun-500">
          PitchLine
        </span>
        <h1 className="text-2xl font-extrabold leading-tight">
          Grassroots sport, real teams, real fans — right on your phone.
        </h1>
      </div>
      <LiveScoreStrip />
      <div className="px-4">
        <Button size="lg" className="w-full" onClick={() => navigate('/auth')}>
          Get started
        </Button>
      </div>
    </section>
  )
}
