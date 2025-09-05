import React, { useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import BackToF1Button from '../../components/BackToF1Button.jsx'

const API_BASE = 'https://f1api.dev/api'

export default function DriverDetailPage() {
  const { driverId } = useParams()
  const [searchParams] = useSearchParams()
  const season = searchParams.get('season') || 'current'

  const detailUrl = season === 'current' ? `${API_BASE}/current/drivers/${driverId}` : `${API_BASE}/${season}/drivers/${driverId}`
  const { data, loading } = useApi(detailUrl)

  const driver = data?.driver || data
  const team = data?.team
  const results = useMemo(() => data?.results || [], [data])

  // Aggregate stats from results if present
  const aggregate = useMemo(() => {
    if (!Array.isArray(results)) return null
    let pts = 0, wins = 0, podiums = 0, starts = 0, bestFinish = null
    results.forEach(r => {
      const pos = r?.result?.finishingPosition
      const points = r?.result?.pointsObtained
      if (points) pts += Number(points) || 0
      if (pos && (pos === 1 || pos === '1')) wins += 1
      if (pos && ['1','2','3',1,2,3].includes(pos)) podiums += 1
      if (pos) {
        starts += 1
        const numeric = typeof pos === 'number' ? pos : parseInt(pos, 10)
        if (!isNaN(numeric)) {
          if (bestFinish === null || numeric < bestFinish) bestFinish = numeric
        }
      }
    })
    return { pts, wins, podiums, starts, bestFinish }
  }, [results])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <BackToF1Button />
        <Button variant="ghost" onClick={() => window.history.back()} className="text-sm">← Back</Button>
        <h1 className="text-3xl font-extrabold tracking-tight">{driver?.name} {driver?.surname}</h1>
        <span className="text-xs rounded bg-red-600/10 text-red-600 px-2 py-1">{season === 'current' ? 'Current Season' : season}</span>
      </div>

      {loading && <p className="text-neutral-500">Loading driver...</p>}
      {!loading && driver && (
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="font-medium">Full Name:</span> {driver.name} {driver.surname}</p>
              {driver.nationality && <p><span className="font-medium">Nationality:</span> {driver.nationality}</p>}
              {driver.birthday && <p><span className="font-medium">Birthday:</span> {driver.birthday}</p>}
              {driver.number !== undefined && <p><span className="font-medium">Number:</span> {driver.number}</p>}
              {driver.shortName && <p><span className="font-medium">Code:</span> {driver.shortName}</p>}
              {team?.teamName && <p><span className="font-medium">Team:</span> {team.teamName}</p>}
              {aggregate && (
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                  <div><p className="text-xl font-bold">{aggregate.starts}</p><p className="text-[10px] uppercase tracking-wide text-neutral-500">Starts</p></div>
                  <div><p className="text-xl font-bold">{aggregate.wins}</p><p className="text-[10px] uppercase tracking-wide text-neutral-500">Wins</p></div>
                  <div><p className="text-xl font-bold">{aggregate.podiums}</p><p className="text-[10px] uppercase tracking-wide text-neutral-500">Podiums</p></div>
                  <div><p className="text-xl font-bold">{aggregate.pts}</p><p className="text-[10px] uppercase tracking-wide text-neutral-500">Points</p></div>
                  <div><p className="text-xl font-bold">{aggregate.bestFinish ?? '—'}</p><p className="text-[10px] uppercase tracking-wide text-neutral-500">Best</p></div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3 max-h-[480px] overflow-auto pr-2">
              {Array.isArray(results) && results.slice(-8).reverse().map((r, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{r.race?.name}</p>
                    <p className="text-neutral-500 truncate">Rnd {r.race?.round} • {r.race?.circuit?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{r.result?.finishingPosition}</p>
                    <p className="text-neutral-500">{r.result?.pointsObtained} pts</p>
                  </div>
                </div>
              ))}
              {(!results || results.length === 0) && <p className="text-neutral-500">No result data.</p>}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-10">
        <Link to="/f1/drivers" className="text-red-600 hover:underline text-sm font-medium">← All Drivers</Link>
      </div>
    </div>
  )
}
