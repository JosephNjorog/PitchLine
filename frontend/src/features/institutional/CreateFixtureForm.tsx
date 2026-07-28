import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { ScoreStepper } from '../../components/ui/ScoreStepper'
import { Toggle } from '../../components/ui/Toggle'
import { TEAMS } from '../../mock-data'
import { useMyOrg } from '../../context/MyOrgContext'
import { useAdminFixtures } from '../../context/AdminFixturesContext'

export function CreateFixtureForm() {
  const { myOrg } = useMyOrg()
  const { scheduleFixture } = useAdminFixtures()

  const eligibleTeams = useMemo(
    () =>
      myOrg && myOrg.jurisdictionTeamIds.length > 0
        ? TEAMS.filter((t) => myOrg.jurisdictionTeamIds.includes(t.id))
        : TEAMS,
    [myOrg],
  )

  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [kickoffAt, setKickoffAt] = useState('')
  const [venue, setVenue] = useState('')
  const [alreadyPlayed, setAlreadyPlayed] = useState(false)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [confirmation, setConfirmation] = useState('')

  const canSubmit =
    homeTeamId.length > 0 && awayTeamId.length > 0 && homeTeamId !== awayTeamId && kickoffAt.length > 0

  function handleSubmit() {
    if (!canSubmit) return
    scheduleFixture({
      homeTeamId,
      awayTeamId,
      kickoffAt: new Date(kickoffAt).toISOString(),
      venue: venue.trim() || 'TBD',
      playedScore: alreadyPlayed ? { homeScore, awayScore } : undefined,
    })
    setConfirmation('Fixture scheduled.')
    setHomeTeamId('')
    setAwayTeamId('')
    setKickoffAt('')
    setVenue('')
    setAlreadyPlayed(false)
    setHomeScore(0)
    setAwayScore(0)
    setTimeout(() => setConfirmation(''), 3000)
  }

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">
        Create a fixture
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-900">Home team</span>
          <select
            value={homeTeamId}
            onChange={(e) => setHomeTeamId(e.target.value)}
            className="w-full rounded-xl border border-ink-500/25 bg-paper px-3 py-2.5 text-sm outline-none focus:border-pitch-900"
          >
            <option value="">Select team</option>
            {eligibleTeams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-900">Away team</span>
          <select
            value={awayTeamId}
            onChange={(e) => setAwayTeamId(e.target.value)}
            className="w-full rounded-xl border border-ink-500/25 bg-paper px-3 py-2.5 text-sm outline-none focus:border-pitch-900"
          >
            <option value="">Select team</option>
            {eligibleTeams
              .filter((t) => t.id !== homeTeamId)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Kickoff"
          type="datetime-local"
          value={kickoffAt}
          onChange={(e) => setKickoffAt(e.target.value)}
        />
        <Input label="Venue" placeholder="e.g. County Grounds" value={venue} onChange={(e) => setVenue(e.target.value)} />
      </div>
      <Toggle
        checked={alreadyPlayed}
        onChange={setAlreadyPlayed}
        label="Already played? Enter the score"
        description="Feeds this fixture straight into the standings below."
      />
      {alreadyPlayed && (
        <div className="flex items-center justify-around">
          <ScoreStepper value={homeScore} onChange={setHomeScore} />
          <span className="text-ink-500">–</span>
          <ScoreStepper value={awayScore} onChange={setAwayScore} />
        </div>
      )}
      <Button disabled={!canSubmit} onClick={handleSubmit}>
        Schedule fixture
      </Button>
      {confirmation && <p className="text-sm text-success">{confirmation}</p>}
    </Card>
  )
}
