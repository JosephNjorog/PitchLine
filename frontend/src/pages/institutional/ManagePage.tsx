import { CreateFixtureForm } from '../../features/institutional/CreateFixtureForm'
import { StandingsTable } from '../../features/institutional/StandingsTable'

export function ManagePage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-ink-900">Manage fixtures &amp; standings</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CreateFixtureForm />
        <StandingsTable />
      </div>
    </div>
  )
}
