import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Pagination from '../../components/Pagination.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'

const API_BASE = 'https://f1api.dev/api'
const PAGE_SIZE = 12

function fetchJson(url, signal) {
  return fetch(url, { signal }).then(r => { if (!r.ok) throw new Error(r.status.toString()) ; return r.json() })
}

export default function CircuitsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const qParam = searchParams.get('q') || ''
  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const detailParam = searchParams.get('circuit') || ''

  const [query, setQuery] = useState(qParam)
  const [page, setPage] = useState(pageParam)
  const [listState, setListState] = useState({ loading: false, error: null, data: null })
  const [detailState, setDetailState] = useState({ loading: false, error: null, data: null })

  const listUrl = query
    ? `${API_BASE}/circuits/search?q=${encodeURIComponent(query)}`
    : `${API_BASE}/circuits`

  // Fetch circuits list
  useEffect(() => {
    const controller = new AbortController()
    setListState({ loading: true, error: null, data: null })
    fetchJson(listUrl, controller.signal)
      .then(json => setListState({ loading: false, error: null, data: json }))
      .catch(e => setListState({ loading: false, error: e, data: null }))
    return () => controller.abort()
  }, [listUrl])

  const circuits = useMemo(() => {
    const arr = listState.data?.circuits || []
    if (!Array.isArray(arr)) return []
    return arr.sort((a, b) => (b.firstParticipationYear || 0) - (a.firstParticipationYear || 0))
  }, [listState.data])

  const total = circuits.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageItems = circuits.slice(start, start + PAGE_SIZE)

  function updateQuery(q) {
    setQuery(q)
    setPage(1)
    setSearchParams(params => {
      const next = new URLSearchParams(params)
      if (q) {
        next.set('q', q)
      } else {
        next.delete('q')
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

  // Detail fetch
  const fetchDetail = useCallback((circuitId) => {
    if (!circuitId) return
    const url = `${API_BASE}/circuits/${circuitId}`
    const controller = new AbortController()
    setDetailState({ loading: true, error: null, data: null })
    fetchJson(url, controller.signal)
      .then(json => setDetailState({ loading: false, error: null, data: json }))
      .catch(e => setDetailState({ loading: false, error: e, data: null }))
    return () => controller.abort()
  }, [])

  // Auto fetch if circuit param present
  useEffect(() => {
    if (detailParam) fetchDetail(detailParam)
  }, [detailParam, fetchDetail])

  function openDetail(id) {
    setSearchParams(params => {
      const next = new URLSearchParams(params)
      next.set('circuit', id)
      return next
    })
  }
  function closeDetail() {
    setSearchParams(params => {
      const next = new URLSearchParams(params)
      next.delete('circuit')
      return next
    })
    setDetailState({ loading: false, error: null, data: null })
  }

  const detailCircuit = detailState.data?.circuit || detailState.data?.circuits?.[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Circuits</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">Explore Formula 1 circuits. Search by country, city, or name (e.g. "japan"). Click a card for detailed stats.</p>
        </div>
        <form onSubmit={e => e.preventDefault()} className="flex items-center gap-2 flex-wrap">
          <input
            value={query}
            onChange={e => updateQuery(e.target.value)}
            placeholder="Search circuits..."
            className="w-60 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20"
          />
          {query && <Button type="button" variant="ghost" onClick={() => updateQuery('')}>Clear</Button>}
        </form>
      </div>

      {listState.loading && (
        <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      )}
      {listState.error && !listState.loading && <p className="mt-8 text-sm text-red-600">Failed to load circuits: {listState.error.message}</p>}
      {!listState.loading && !listState.error && pageItems.length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">No circuits found.</p>
      )}
      {!listState.loading && !listState.error && pageItems.length > 0 && (
        <>
          <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pageItems.map(c => (
              <Card key={c.circuitId} className="group overflow-hidden transition hover:shadow-md cursor-pointer" onClick={() => openDetail(c.circuitId)}>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold leading-snug line-clamp-2">{c.circuitName}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-1">
                  <p>{c.city}, {c.country}</p>
                  {c.circuitLength && <p>Len: {c.circuitLength} m</p>}
                  {c.firstParticipationYear && <p>Since: {c.firstParticipationYear}</p>}
                  {c.lapRecord && <p>Lap: {c.lapRecord}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination page={currentPage} pageSize={PAGE_SIZE} total={total} onChange={changePage} />
        </>
      )}

      {/* Detail Drawer / Modal */}
      {detailParam && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDetail} />
          <div className="relative z-50 w-full md:max-w-xl max-h-[90vh] overflow-auto rounded-t-2xl md:rounded-2xl bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-800 p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight">{detailCircuit?.circuitName || detailParam}</h2>
              <button onClick={closeDetail} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm">✕</button>
            </div>
            {detailState.loading && <p className="mt-4 text-sm text-neutral-500">Loading...</p>}
            {detailState.error && <p className="mt-4 text-sm text-red-600">Failed: {detailState.error.message}</p>}
            {!detailState.loading && !detailState.error && detailCircuit && (
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">Location</p>
                    <p className="font-medium">{detailCircuit.city}, {detailCircuit.country}</p>
                  </div>
                  {detailCircuit.circuitLength && <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">Length</p>
                    <p className="font-medium">{detailCircuit.circuitLength}{typeof detailCircuit.circuitLength === 'number' ? ' m' : ''}</p>
                  </div>}
                  {detailCircuit.numberOfCorners && <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">Corners</p>
                    <p className="font-medium">{detailCircuit.numberOfCorners}</p>
                  </div>}
                  {detailCircuit.firstParticipationYear && <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">First GP</p>
                    <p className="font-medium">{detailCircuit.firstParticipationYear}</p>
                  </div>}
                </div>
                {(detailCircuit.lapRecord || detailCircuit.fastestLapDriverId) && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">Lap Record</p>
                    <p className="font-medium">
                      {detailCircuit.lapRecord || '—'} {detailCircuit.fastestLapYear ? `(${detailCircuit.fastestLapYear})` : ''}
                    </p>
                    {(detailCircuit.fastestLapDriverId || detailCircuit.fastestLapTeamId) && (
                      <p className="text-neutral-500 text-xs mt-1">{detailCircuit.fastestLapDriverId} • {detailCircuit.fastestLapTeamId}</p>
                    )}
                  </div>
                )}
                {detailCircuit.url && <a href={detailCircuit.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-red-600 hover:underline text-sm font-medium">Wikipedia →</a>}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-12 text-[10px] uppercase tracking-wide text-neutral-500 flex flex-wrap gap-4">
        <p>Source: f1api.dev</p>
        <p>Circuits: {listState.data?.total ?? '—'}</p>
      </div>
    </div>
  )
}

