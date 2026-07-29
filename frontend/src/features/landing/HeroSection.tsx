import { useNavigate } from 'react-router-dom'
import { LandingNav } from './LandingNav'
import { LiveScoreStrip } from './LiveScoreStrip'

const STATS = [
  { value: '500+', label: 'registered teams' },
  { value: '40K+', label: 'fans following' },
  { value: '47', label: 'counties covered' },
]

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <div className="hero-gradient relative overflow-hidden">
      <LandingNav />

      <section
        id="live-scores"
        className="relative z-10 grid grid-cols-1 gap-10 px-5 pb-14 pt-6 sm:px-8 sm:pb-20 md:grid-cols-2 md:items-center md:gap-16 md:pt-10"
      >
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-500">
            Built for grassroots sport
          </span>
          <h1 className="text-5xl font-black leading-[0.98] tracking-tighter text-white sm:text-6xl">
            Grassroots sport,
            <br />
            right on your <span className="text-pitch-400">phone</span>.
          </h1>
          <p className="max-w-md text-lg text-white/60">
            Follow real teams and results, from any phone — no data bundle required.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="inline-flex items-center justify-center rounded-xl bg-pitch-500 px-7 py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(31,165,87,0.45)] transition-all hover:bg-pitch-400 hover:shadow-[0_10px_30px_rgba(31,165,87,0.55)] active:scale-[0.98]"
            >
              Get started free
            </button>
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Continue with Google
            </button>
          </div>

          <div className="mt-2 flex gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-white/45">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <LiveScoreStrip />
      </section>
    </div>
  )
}
