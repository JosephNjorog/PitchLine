import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { getTeamById } from '../../mock-data'
import { useTeamOps } from '../../context/TeamOpsContext'

function toDatetimeLocal(iso: string) {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function EditFixturePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fixtures, updateFixture } = useTeamOps()
  const fixture = fixtures.find((f) => f.id === id)

  const [kickoffAt, setKickoffAt] = useState(fixture ? toDatetimeLocal(fixture.kickoffAt) : '')
  const [venue, setVenue] = useState(fixture?.venue ?? '')

  if (!fixture) return <Navigate to="/team/fixtures" replace />

  const opponent = getTeamById(fixture.awayTeamId)
  const canSubmit = kickoffAt.length > 0 && venue.trim().length > 0

  function handleSubmit() {
    if (!fixture) return
    updateFixture(fixture.id, { kickoffAt: new Date(kickoffAt).toISOString(), venue: venue.trim() })
    navigate('/team/fixtures', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Edit fixture" showBack />
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        <p className="text-sm text-ink-500">vs {opponent?.name ?? 'Opponent'}</p>
        <Input
          label="Kickoff"
          type="datetime-local"
          value={kickoffAt}
          onChange={(e) => setKickoffAt(e.target.value)}
        />
        <Input
          label="Venue"
          placeholder="e.g. City Stadium, Nairobi"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />
      </div>
      <div className="sticky bottom-0 border-t border-ink-500/10 bg-cream px-4 py-3">
        <Button size="lg" className="w-full" disabled={!canSubmit} onClick={handleSubmit}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
