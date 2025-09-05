import React, { useMemo, useState } from 'react'
import BackToF1Button from '../../components/BackToF1Button.jsx'
import { useApi } from '../../hooks/useApi.js'
import Pagination from '../../components/Pagination.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'

// Seasons endpoint provides a list of championships. We'll allow search by year substring
// and paginate client-side. All required tests / use cases: loading, error, empty search, pagination boundaries.

const API_URL = 'https://f1api.dev/api/seasons'
const PAGE_SIZE = 12

export default function SeasonsPage() {
  const { data, error, loading } = useApi(API_URL)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const seasons = useMemo(() => {
    const list = data?.championships || []
    if (!Array.isArray(list)) return []
    const filtered = query
      ? list.filter(c => String(c.year).includes(query.trim()))
      : list
    return filtered.sort((a, b) => b.year - a.year)
  }, [data, query])

  const total = seasons.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageItems = seasons.slice(start, start + PAGE_SIZE)

  function changePage(p) { setPage(p) }
  function onSearch(e) { setQuery(e.target.value); setPage(1) }
  function clearSearch() { setQuery(''); setPage(1) }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">F1 Seasons</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">Browse historical Formula 1 World Championship seasons. Search by year (e.g. 2021).</p>
        </div>
        <form onSubmit={e => e.preventDefault()} className="flex items-center gap-2 flex-wrap">
          <BackToF1Button />
          <input
            value={query}
            onChange={onSearch}
            placeholder="Search year..."
            className="w-40 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20"
          />
          {query && <Button type="button" variant="ghost" onClick={clearSearch}>Clear</Button>}
        </form>
      </div>

      {loading && <p className="mt-10 text-sm text-neutral-500">Loading seasons...</p>}
      {error && !loading && <p className="mt-10 text-sm text-red-600">Failed to load: {error.message}</p>}

      {!loading && !error && pageItems.length === 0 && (
        <p className="mt-10 text-sm text-neutral-500">No seasons match that query.</p>
      )}

      {!loading && !error && pageItems.length > 0 && (
        <>
          <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pageItems.map(c => (
              <Card key={c.championshipId} className="transition hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold leading-snug line-clamp-2">{c.championshipName}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <p><span className="font-medium">Year:</span> {c.year}</p>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-medium">Wikipedia →</a>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination page={currentPage} pageSize={PAGE_SIZE} total={total} onChange={changePage} />
        </>
      )}

      <div className="mt-12 text-[10px] uppercase tracking-wide text-neutral-500">
        <p>Data source: f1api.dev | Total seasons: {data?.total ?? '—'}</p>
      </div>
    </div>
  )
}

