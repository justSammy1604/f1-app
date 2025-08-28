import React, { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi.js'
import Button from '../../components/ui/Button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx'
import Pagination from '../../components/Pagination.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'

const API_BASE = 'https://f1api.dev/api'

export default function TeamsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const seasonParam = searchParams.get('season') || 'current' // 'current' | '2016' | 'all'
  const [page, setPage] = useState(pageParam)
  const [season, setSeason] = useState(seasonParam)
  const pageSize = 8
  // Data sources for endpoints to ensure coverage
  const { data: searchData, loading: loadingSearch } = useApi(q ? `${API_BASE}/teams/search?q=${encodeURIComponent(q)}` : null, { skip: !q })
  const { data: currentTeams, loading: loadingCurrent } = useApi(season === 'current' ? `${API_BASE}/current/teams` : null, { skip: season !== 'current' })
  const { data: season2016Teams, loading: loading2016 } = useApi(season === '2016' ? `${API_BASE}/2016/teams` : null, { skip: season !== '2016' })
  const { data: allTeamsData, loading: loadingAll } = useApi(season === 'all' ? `${API_BASE}/teams` : null, { skip: season !== 'all' })

  const teams = useMemo(() => {
    let list = []
    if (q && searchData) {
      list = searchData?.teams || searchData?.results || searchData || []
    } else if (season === 'current' && currentTeams) {
      list = currentTeams?.teams || currentTeams || []
    } else if (season === '2016' && season2016Teams) {
      list = season2016Teams?.teams || season2016Teams || []
    } else if (season === 'all' && allTeamsData) {
      list = allTeamsData?.teams || allTeamsData || []
    }
    if (!Array.isArray(list)) return []
    return list
  }, [q, searchData, currentTeams, season2016Teams, allTeamsData, season])

  const total = teams.length
  const start = (page - 1) * pageSize
  const paginated = teams.slice(start, start + pageSize)

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

  const loading = loadingSearch || loadingCurrent || loading2016 || loadingAll

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">F1 Teams</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">Browse teams by season or view an all‑time list. Use search to quickly locate a team (e.g. "ferrari").</p>
        </div>
        <form onSubmit={e => e.preventDefault()} className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search teams..."
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
            <option value="2016">2016</option>
            <option value="all">All-Time</option>
          </select>
        </form>
      </div>

      {loading && (
        <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      )}

      {!loading && paginated.length === 0 && (
        <p className="mt-12 text-sm text-neutral-500">No teams found.</p>
      )}

      {!loading && paginated.length > 0 && (
        <>
          <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginated.map(team => {
              const slug = team.teamId || team.id || team.slug || team.name || team.teamName || ''
                .toString().toLowerCase().replace(/\s+/g, '-')
              return (
                <Card key={slug} className="group overflow-hidden transition hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2 leading-snug text-sm font-semibold">{team.name || team.teamName || 'Team'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <div className="space-y-1">
                      {team.fullTeamName && <p className="text-neutral-600 dark:text-neutral-400 line-clamp-3">{team.fullTeamName}</p>}
                      {team.base && <p><span className="font-medium">Base:</span> {team.base}</p>}
                      {team.powerUnit && <p><span className="font-medium">PU:</span> {team.powerUnit}</p>}
                    </div>
                    <div className="pt-4">
                      <Link to={`/f1/teams/${slug}${season && season !== 'current' ? `?season=${season}` : ''}`} className="text-red-600 hover:underline font-medium">View →</Link>
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
