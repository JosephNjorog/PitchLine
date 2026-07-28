import { useState } from 'react'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ScoreStepper } from '../../components/ui/ScoreStepper'
import type { CardEvent, Scorer, Team } from '../../types'

interface ResultFormProps {
  homeTeam: Team
  awayTeam: Team
  onSubmit: (result: {
    homeScore: number
    awayScore: number
    scorers: Scorer[]
    cards: CardEvent[]
    motmNominees: string[]
  }) => void
}

export function ResultForm({ homeTeam, awayTeam, onSubmit }: ResultFormProps) {
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [scorers, setScorers] = useState<Scorer[]>([])
  const [scorerName, setScorerName] = useState('')
  const [cards, setCards] = useState<CardEvent[]>([])
  const [cardName, setCardName] = useState('')
  const [cardType, setCardType] = useState<'yellow' | 'red'>('yellow')
  const [nominees, setNominees] = useState<string[]>([])
  const [nomineeName, setNomineeName] = useState('')

  function addScorer() {
    if (!scorerName.trim()) return
    setScorers((prev) => [...prev, { teamId: homeTeam.id, playerName: scorerName.trim() }])
    setScorerName('')
  }

  function addCard() {
    if (!cardName.trim()) return
    setCards((prev) => [...prev, { teamId: homeTeam.id, playerName: cardName.trim(), type: cardType }])
    setCardName('')
  }

  function addNominee() {
    if (!nomineeName.trim() || nominees.includes(nomineeName.trim())) return
    setNominees((prev) => [...prev, nomineeName.trim()])
    setNomineeName('')
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-2">
          <Avatar name={homeTeam.name} color={homeTeam.crestColor} size={40} />
          <span className="text-sm font-medium text-ink-900">{homeTeam.name}</span>
          <ScoreStepper value={homeScore} onChange={setHomeScore} />
        </div>
        <span className="text-lg font-bold text-ink-500">–</span>
        <div className="flex flex-col items-center gap-2">
          <Avatar name={awayTeam.name} color={awayTeam.crestColor} size={40} />
          <span className="text-sm font-medium text-ink-900">{awayTeam.name}</span>
          <ScoreStepper value={awayScore} onChange={setAwayScore} />
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Scorers</h3>
        {scorers.map((scorer, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-ink-900">{scorer.playerName}</span>
            <button
              type="button"
              className="text-xs text-danger"
              onClick={() => setScorers((prev) => prev.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            value={scorerName}
            onChange={(e) => setScorerName(e.target.value)}
            placeholder="Player name"
            className="flex-1 rounded-xl border border-ink-500/25 bg-surface-0 px-3 py-2 text-sm outline-none focus:border-pitch-700"
          />
          <Button size="md" onClick={addScorer}>
            Add
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Cards</h3>
        {cards.map((card, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-ink-900">
              {card.type === 'yellow' ? '🟨' : '🟥'} {card.playerName}
            </span>
            <button
              type="button"
              className="text-xs text-danger"
              onClick={() => setCards((prev) => prev.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Player name"
            className="flex-1 rounded-xl border border-ink-500/25 bg-surface-0 px-3 py-2 text-sm outline-none focus:border-pitch-700"
          />
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value as 'yellow' | 'red')}
            className="rounded-xl border border-ink-500/25 bg-surface-0 px-2 py-2 text-sm outline-none"
          >
            <option value="yellow">Yellow</option>
            <option value="red">Red</option>
          </select>
          <Button size="md" onClick={addCard}>
            Add
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          Man of the match nominees
        </h3>
        <div className="flex flex-wrap gap-2">
          {nominees.map((name) => (
            <span
              key={name}
              className="flex items-center gap-1.5 rounded-full bg-pitch-700/10 px-3 py-1 text-xs font-medium text-pitch-700"
            >
              {name}
              <button
                type="button"
                onClick={() => setNominees((prev) => prev.filter((n) => n !== name))}
                aria-label={`Remove ${name}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={nomineeName}
            onChange={(e) => setNomineeName(e.target.value)}
            placeholder="Player name"
            className="flex-1 rounded-xl border border-ink-500/25 bg-surface-0 px-3 py-2 text-sm outline-none focus:border-pitch-700"
          />
          <Button size="md" onClick={addNominee}>
            Add
          </Button>
        </div>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={() => onSubmit({ homeScore, awayScore, scorers, cards, motmNominees: nominees })}
      >
        Submit result
      </Button>
    </div>
  )
}
