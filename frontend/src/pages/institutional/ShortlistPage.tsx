import { EmptyState } from '../../components/ui/EmptyState'
import { ExportButton } from '../../features/institutional/ExportButton'
import { TeamResultCard } from '../../features/institutional/TeamResultCard'
import { AthleteResultCard } from '../../features/institutional/AthleteResultCard'
import { ATHLETES, TEAMS, getTeamById } from '../../mock-data'
import { useShortlist } from '../../context/ShortlistContext'

export function ShortlistPage() {
  const { shortlistedTeamIds, shortlistedAthleteIds } = useShortlist()

  const teams = TEAMS.filter((team) => shortlistedTeamIds.includes(team.id))
  const athletes = ATHLETES.filter((athlete) => shortlistedAthleteIds.includes(athlete.id))

  const exportRows = [
    ...teams.map((t) => ({ type: 'team', name: t.name, county: t.county, sport: t.sport })),
    ...athletes.map((a) => ({
      type: 'athlete',
      name: a.name,
      county: getTeamById(a.teamId)?.county ?? '',
      sport: getTeamById(a.teamId)?.sport ?? '',
    })),
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink-900">Shortlist</h2>
        <ExportButton filename="pitchline-shortlist.csv" rows={exportRows} />
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          Teams ({teams.length})
        </h3>
        {teams.length === 0 ? (
          <EmptyState icon="⭐" title="No teams shortlisted yet" />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamResultCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          Athletes ({athletes.length})
        </h3>
        {athletes.length === 0 ? (
          <EmptyState icon="⭐" title="No athletes shortlisted yet" />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {athletes.map((athlete) => (
              <AthleteResultCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
