import React from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'

const API_BASE = 'https://f1api.dev/api'

export default function TeamDetailPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const season = searchParams.get('season') || 'current'

  const teamUrl = season === 'current' ? `${API_BASE}/current/teams/${slug}` : `${API_BASE}/${season}/teams/${slug}`
  const driversUrl = season === 'current' ? `${API_BASE}/current/teams/${slug}/drivers` : `${API_BASE}/${season}/teams/${slug}/drivers`

  const { data: teamData, loading: loadingTeam } = useApi(teamUrl)
  const { data: driversData, loading: loadingDrivers } = useApi(driversUrl)

  const team = teamData?.team || teamData
  const drivers = driversData?.drivers || driversData?.teamDrivers || driversData

  // Compute simple team driver stats (aggregate points & wins for displayed season if data structure allows)
  let driverStatSummary = null
  if (Array.isArray(drivers)) {
    driverStatSummary = {
      drivers: drivers.length
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Button variant="outline" as-child="true" onClick={() => window.history.back()}>← Back</Button>
  <h1 className="text-3xl font-extrabold tracking-tight">{team?.name || team?.teamName || slug}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Team Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {loadingTeam && <p className="text-neutral-500">Loading team...</p>}
            {team && !loadingTeam && (
              <ul className="space-y-2">
                {team.fullTeamName && <li><span className="font-medium">Full Name:</span> {team.fullTeamName}</li>}
                {team.base && <li><span className="font-medium">Base:</span> {team.base}</li>}
                {team.chiefTechnical && <li><span className="font-medium">Technical Chief:</span> {team.chiefTechnical}</li>}
                {team.powerUnit && <li><span className="font-medium">Power Unit:</span> {team.powerUnit}</li>}
                {team.firstTeamEntry && <li><span className="font-medium">First Entry:</span> {team.firstTeamEntry}</li>}
                {team.worldChampionships !== undefined && <li><span className="font-medium">World Championships:</span> {team.worldChampionships}</li>}
                {team.highestRaceFinish && <li><span className="font-medium">Highest Race Finish:</span> {team.highestRaceFinish}</li>}
              </ul>
            )}
          </CardContent>
        </Card>
    <Card>
          <CardHeader>
            <CardTitle>Drivers ({season === 'current' ? 'Current' : season})</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {loadingDrivers && <p className="text-neutral-500">Loading drivers...</p>}
            {drivers && !loadingDrivers && Array.isArray(drivers) && drivers.length > 0 && (
              <ul className="space-y-2">
                {drivers.map(d => (
                  <li key={d.id || d.code || d.name} className="flex items-center justify-between gap-2">
                    <span>{d.name}</span>
                    {d.permanentNumber && <span className="text-xs rounded bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5">#{d.permanentNumber}</span>}
                  </li>
                ))}
              </ul>
            )}
            {drivers && !loadingDrivers && Array.isArray(drivers) && drivers.length === 0 && <p className="text-neutral-500">No driver data.</p>}
      {driverStatSummary && <p className="mt-4 text-xs text-neutral-500">Driver count: {driverStatSummary.drivers}</p>}
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <Link to="/f1/teams" className="text-red-600 hover:underline text-sm font-medium">← All Teams</Link>
      </div>
    </div>
  )
}
