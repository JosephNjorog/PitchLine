import { useNavigate } from 'react-router-dom'
import { LiveScoreStrip } from './LiveScoreStrip'

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section
      id="live-scores"
      className="grid grid-cols-1 gap-10 px-5 py-10 sm:px-8 sm:py-16 md:grid-cols-2 md:items-center md:gap-16"
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
          Grassroots sport,
          <br />
          right on your phone
        </h1>
        <p className="text-lg text-ink-500">Follow real teams and results, from any phone.</p>
        <button
          type="button"
          onClick={() => navigate('/auth')}
          className="inline-flex w-fit items-center justify-center rounded-xl border border-border bg-paper px-6 py-3.5 text-base font-semibold text-ink-900 hover:bg-sand"
        >
          Continue with Google
        </button>
      </div>

      <LiveScoreStrip />
    </section>
  )
}
