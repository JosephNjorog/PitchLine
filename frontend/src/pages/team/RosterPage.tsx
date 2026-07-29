import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { useRoster } from '../../context/RosterContext'

export function RosterPage() {
  const { players, addPlayer, removePlayer } = useRoster()
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState('')

  function handleAdd() {
    if (!name.trim() || !position.trim()) return
    addPlayer(name.trim(), position.trim(), jerseyNumber ? Number(jerseyNumber) : undefined)
    setName('')
    setPosition('')
    setJerseyNumber('')
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PageHeader title="Roster" />

      <div className="px-4">
        <Card className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Add a player</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Player name"
              className="flex-1 rounded-xl border border-transparent bg-sand px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-500 focus:border-pitch-900/30 focus:ring-2 focus:ring-pitch-900/15"
            />
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position"
              className="flex-1 rounded-xl border border-transparent bg-sand px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-500 focus:border-pitch-900/30 focus:ring-2 focus:ring-pitch-900/15"
            />
            <input
              value={jerseyNumber}
              onChange={(e) => setJerseyNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="No."
              inputMode="numeric"
              className="w-full rounded-xl border border-transparent bg-sand px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-500 focus:border-pitch-900/30 focus:ring-2 focus:ring-pitch-900/15 sm:w-16"
            />
          </div>
          <Button onClick={handleAdd} disabled={!name.trim() || !position.trim()}>
            Add player
          </Button>
        </Card>
      </div>

      <div className="flex flex-col gap-3 px-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          {players.length} player{players.length === 1 ? '' : 's'}
        </h2>
        {players.length === 0 ? (
          <EmptyState icon="👥" title="No players added yet" />
        ) : (
          <div className="flex flex-col gap-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-xl border border-border bg-paper px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {player.jerseyNumber !== undefined && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand text-xs font-bold text-ink-900">
                      {player.jerseyNumber}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-ink-900">{player.name}</p>
                    <p className="text-xs text-ink-500">{player.position}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removePlayer(player.id)}
                  className="text-xs text-danger"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
