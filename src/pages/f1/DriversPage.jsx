import React, { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import BackToF1Button from '../../components/BackToF1Button.jsx'
import { useApi } from '../../hooks/useApi.js'
import Button from '../../components/ui/Button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx'
import Pagination from '../../components/Pagination.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'

const API_BASE = 'https://f1api.dev/api'

export default function DriversPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const seasonParam = searchParams.get('season') || 'current' // current | 2010 | all
  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const [season, setSeason] = useState(seasonParam)
  const [page, setPage] = useState(pageParam)
  const pageSize = 12

  const { data: searchData, loading: loadingSearch } = useApi(q ? `${API_BASE}/drivers/search?q=${encodeURIComponent(q)}` : null, { skip: !q })
  const { data: currentDrivers, loading: loadingCurrent } = useApi(season === 'current' ? `${API_BASE}/current/drivers` : null, { skip: season !== 'current' })
  const { data: season2010Drivers, loading: loading2010 } = useApi(season === '2010' ? `${API_BASE}/2010/drivers` : null, { skip: season !== '2010' })
  const { data: allDriversData, loading: loadingAll } = useApi(season === 'all' ? `${API_BASE}/drivers` : null, { skip: season !== 'all' })

  const drivers = useMemo(() => {
    let list = []
    if (q && searchData) list = searchData?.drivers || searchData?.results || []
    else if (season === 'current' && currentDrivers) list = currentDrivers?.drivers || currentDrivers || []
    else if (season === '2010' && season2010Drivers) list = season2010Drivers?.drivers || season2010Drivers || []
    else if (season === 'all' && allDriversData) list = allDriversData?.drivers || allDriversData || []
    if (!Array.isArray(list)) return []
    return list
  }, [q, searchData, currentDrivers, season2010Drivers, allDriversData, season])

  const total = drivers.length
  const start = (page - 1) * pageSize
  const paginated = drivers.slice(start, start + pageSize)

  function updateQuery(newQ) {
    setSearchParams(params => {
      const next = new URLSearchParams(params)
      if (newQ) {
        next.set('q', newQ)
      } else {
        next.delete('q')
      }
      next.delete('page')
      return next
    })
    setPage(1)
  }

  function changeSeason(nextSeason) {
    setSeason(nextSeason)
    setPage(1)
    setSearchParams(params => {
      const next = new URLSearchParams(params)
      if (nextSeason && nextSeason !== 'current') {
        next.set('season', nextSeason)
      } else {
        next.delete('season')
      }
      next.delete('page')
      return next
    })
  }

  function changePage(p) {
    setPage(p)
    setSearchParams(params => {
      const next = new URLSearchParams(params)
      if (p > 1) {
        next.set('page', String(p))
      } else {
        next.delete('page')
      }
      return next
    })
  }

  const loading = loadingSearch || loadingCurrent || loading2010 || loadingAll

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">F1 Drivers</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">Browse drivers by season or all‑time. Search for a surname (e.g. "verstappen").</p>
        </div>
        <form onSubmit={e => e.preventDefault()} className="flex items-center gap-3 flex-wrap">
          <BackToF1Button />
          <input
            type="text"
            placeholder="Search drivers..."
            className="w-56 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20"
            value={q}
            onChange={e => updateQuery(e.target.value)}
          />
          {q && <Button type="button" variant="ghost" onClick={() => updateQuery('')}>Clear</Button>}
          <select
            value={season}
            onChange={e => changeSeason(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20"
          >
            <option value="current">Current</option>
            <option value="2010">2010</option>
            <option value="all">All-Time</option>
          </select>
        </form>
      </div>

      {loading && (
        <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      )}

      {!loading && paginated.length === 0 && <p className="mt-12 text-sm text-neutral-500">No drivers found.</p>}

      {!loading && paginated.length > 0 && (
        <>
          <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginated.map(d => {
              const slug = d.driverId || d.id || (d.name + '_' + d.surname).toLowerCase()
              return (
                <Card key={slug} className="group overflow-hidden transition hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold leading-snug line-clamp-2">{d.name} {d.surname}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1">
                    {d.nationality && <p>{d.nationality}</p>}
                    {d.birthday && <p>Born: {d.birthday}</p>}
                    {d.teamId && <p>Team: {d.teamId.replace(/_/g,' ')}</p>}
                    <div className="pt-2">
                      <Link to={`/f1/drivers/${slug}${season && season !== 'current' ? `?season=${season}` : ''}`} className="text-red-600 hover:underline font-medium">View →</Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onChange={changePage} />
        </>
      )}
    </div>
  )
}

