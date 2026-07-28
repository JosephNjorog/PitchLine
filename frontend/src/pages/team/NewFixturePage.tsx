import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { TeamSearchList } from '../../features/teams/TeamSearchList'
import { useMyTeam } from '../../context/MyTeamContext'
import { useTeamOps } from '../../context/TeamOpsContext'

export function NewFixturePage() {
  const navigate = useNavigate()
  const { myTeam } = useMyTeam()
  const { createFixture } = useTeamOps()
  const [opponentId, setOpponentId] = useState<string | null>(null)
  const [kickoffAt, setKickoffAt] = useState('')
  const [venue, setVenue] = useState('')

  const selectedIds = useMemo(() => (opponentId ? [opponentId] : []), [opponentId])

  if (!myTeam) return <Navigate to="/onboarding/team/details" replace />

  const canSubmit = Boolean(opponentId) && kickoffAt.length > 0 && venue.trim().length > 0

  function handleSubmit() {
    if (!myTeam || !opponentId) return
    const kickoffIso = new Date(kickoffAt).toISOString()
    createFixture(myTeam.id, opponentId, kickoffIso, venue.trim())
    navigate('/team/fixtures', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="New fixture" showBack />
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        <p className="text-sm text-ink-500">Who are you playing?</p>
        <TeamSearchList selectedTeamIds={selectedIds} onToggle={(id) => setOpponentId(id)} />
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
      <div className="sticky bottom-0 border-t border-ink-500/10 bg-surface-50 px-4 py-3">
        <Button size="lg" className="w-full" disabled={!canSubmit} onClick={handleSubmit}>
          Create fixture
        </Button>
      </div>
    </div>
  )
}
