import { getTeamById } from '../mock-data'
import type { Fixture, Result, Sport } from '../types'

export interface StandingsRow {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export function computeStandings(
  fixtures: Fixture[],
  results: Result[],
  filter: { sport?: Sport; county?: string },
): StandingsRow[] {
  const rows = new Map<string, StandingsRow>()

  function ensureRow(teamId: string) {
    if (!rows.has(teamId)) {
      rows.set(teamId, { teamId, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 })
    }
    return rows.get(teamId)!
  }

  for (const fixture of fixtures) {
    if (fixture.status !== 'completed') continue
    const homeTeam = getTeamById(fixture.homeTeamId)
    const awayTeam = getTeamById(fixture.awayTeamId)
    if (!homeTeam || !awayTeam) continue
    if (filter.sport && (homeTeam.sport !== filter.sport || awayTeam.sport !== filter.sport)) continue
    if (filter.county && homeTeam.county !== filter.county && awayTeam.county !== filter.county) continue

    const result = results.find((r) => r.fixtureId === fixture.id)
    if (!result) continue

    const home = ensureRow(homeTeam.id)
    const away = ensureRow(awayTeam.id)
    home.played += 1
    away.played += 1
    home.goalsFor += result.homeScore
    home.goalsAgainst += result.awayScore
    away.goalsFor += result.awayScore
    away.goalsAgainst += result.homeScore

    if (result.homeScore > result.awayScore) {
      home.won += 1
      home.points += 3
      away.lost += 1
    } else if (result.homeScore < result.awayScore) {
      away.won += 1
      away.points += 3
      home.lost += 1
    } else {
      home.drawn += 1
      away.drawn += 1
      home.points += 1
      away.points += 1
    }
  }

  return Array.from(rows.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    const gdA = a.goalsFor - a.goalsAgainst
    const gdB = b.goalsFor - b.goalsAgainst
    return gdB - gdA
  })
}
