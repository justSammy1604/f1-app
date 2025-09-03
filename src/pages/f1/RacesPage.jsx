import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx'
import Pagination from '../../components/Pagination.jsx'
import { Skeleton } from '../../components/ui/Skeleton.jsx'

const API = 'https://f1api.dev/api'
const PAGE_SIZE = 8

function fetchJson(url, signal) {
  return fetch(url, { signal }).then(r => { if (!r.ok) throw new Error(r.statusText || 'Error') ; return r.json() })
}

export default function RacesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const seasonParam = searchParams.get('season') || 'current'
  const roundParam = searchParams.get('round') || ''
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  // seasonInput: raw user input; season: validated effective season used for fetching
  const [seasonInput, setSeasonInput] = useState(seasonParam)
  const [season, setSeason] = useState(seasonParam)
  const [round, setRound] = useState(roundParam)
  const [page, setPage] = useState(pageParam)
  const [seasonState, setSeasonState] = useState({ loading: false, error: null, data: null })
  const [roundState, setRoundState] = useState({ loading: false, error: null, data: null })
  const [lastState, setLastState] = useState({ loading: false, error: null, data: null })
  const [nextState, setNextState] = useState({ loading: false, error: null, data: null })

  // Build URLs
  const seasonUrl = season === 'current' ? `${API}/current` : `${API}/${season}`
  const roundUrl = round && season !== 'current' ? `${API}/${season}/${round}` : round && season === 'current' ? `${API}/current/${round}` : null
  const lastUrl = `${API}/current/last`
  const nextUrl = `${API}/current/next`

  // Fetch season races list
  useEffect(() => {
    const controller = new AbortController()
    setSeasonState({ loading: true, error: null, data: null })
    fetchJson(seasonUrl, controller.signal)
      .then(json => setSeasonState({ loading: false, error: null, data: json }))
      .catch(e => setSeasonState({ loading: false, error: e, data: null }))
    return () => controller.abort()
  }, [seasonUrl])

  // Fetch specific round
  useEffect(() => {
    if (!roundUrl) { setRoundState({ loading: false, error: null, data: null }); return }
    const controller = new AbortController()
    setRoundState({ loading: true, error: null, data: null })
    fetchJson(roundUrl, controller.signal)
      .then(json => setRoundState({ loading: false, error: null, data: json }))
      .catch(e => setRoundState({ loading: false, error: e, data: null }))
    return () => controller.abort()
  }, [roundUrl])

  // Fetch last and next
  useEffect(() => {
    const c1 = new AbortController()
    setLastState(s => ({ ...s, loading: true }))
    fetchJson(lastUrl, c1.signal)
      .then(json => setLastState({ loading: false, error: null, data: json }))
      .catch(e => setLastState({ loading: false, error: e, data: null }))
    const c2 = new AbortController()
    setNextState(s => ({ ...s, loading: true }))
    fetchJson(nextUrl, c2.signal)
      .then(json => setNextState({ loading: false, error: null, data: json }))
      .catch(e => setNextState({ loading: false, error: e, data: null }))
    return () => { c1.abort(); c2.abort() }
  }, [lastUrl, nextUrl])

  // Derived races list
  const races = useMemo(() => seasonState.data?.races || [], [seasonState.data])
  const total = races.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageItems = races.slice(start, start + PAGE_SIZE)

  // Update search params
  const syncParams = useCallback((nextSeason, nextRound, nextPage) => {
    setSearchParams(params => {
      const p = new URLSearchParams(params)
      if (nextSeason && nextSeason !== 'current') {
        p.set('season', nextSeason)
      } else {
        p.delete('season')
      }
      if (nextRound) {
        p.set('round', nextRound)
      } else {
        p.delete('round')
      }
      if (nextPage && nextPage > 1) {
        p.set('page', String(nextPage))
      } else {
        p.delete('page')
      }
      return p
    })
  }, [setSearchParams])

  // Debounce validation for season input
  const debounceRef = useRef(null)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      let next = 'current'
      if (seasonInput.toLowerCase() === 'current' || seasonInput.trim() === '') {
        next = 'current'
      } else if (/^\d{4}$/.test(seasonInput)) {
        next = seasonInput
      } else {
        // invalid partial; do not change effective season yet
        return
      }
      if (next !== season) {
        setSeason(next)
        setPage(1)
        setRound('')
      }
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [seasonInput, season])

  // Keep URL params in sync when effective season changes
  useEffect(() => {
    syncParams(season, round, 1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season])

  function handleSeasonInputChange(e) {
    setSeasonInput(e.target.value)
  }
  function changeRound(value) {
    setRound(value)
    syncParams(season, value, page)
  }
  function changePage(p) {
    setPage(p)
    syncParams(season, round, p)
  }
  function clearRound() {
    setRound('')
    syncParams(season, '', page)
  }

  const roundRace = roundState.data?.race?.[0]
  const lastRace = lastState.data?.race?.[0]
  const nextRace = nextState.data?.race?.[0]

  function formatDate(d, t) {
    if (!d) return 'TBD'
    try {
      const date = new Date(`${d}T${t || '00:00:00Z'}`)
      return date.toUTCString().replace(':00 GMT',' GMT')
    } catch { return d }
  }

  function RaceCard({ r, badge }) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold leading-snug line-clamp-2">{r.raceName}</CardTitle>
            {badge && <span className="text-[10px] font-medium uppercase tracking-wide rounded bg-red-600/10 text-red-600 px-2 py-0.5">{badge}</span>}
          </div>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <p><span className="font-medium">Round:</span> {r.round}</p>
          {r.schedule?.race?.date && <p><span className="font-medium">Race:</span> {formatDate(r.schedule.race.date, r.schedule.race.time)}</p>}
          {r.schedule?.qualy?.date && <p><span className="font-medium">Qualy:</span> {formatDate(r.schedule.qualy.date, r.schedule.qualy.time)}</p>}
          {r.laps && <p><span className="font-medium">Laps:</span> {r.laps}</p>}
          {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-red-600 hover:underline">Wiki →</a>}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Races</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">Browse the season calendar. Pick a season (current or specific year) and optionally a round to spotlight. Quick view shows last and next races.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">Season</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={seasonInput}
                onChange={handleSeasonInputChange}
                placeholder="2024 | current"
                className="w-32 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-2 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20"
              />
              {/^\d{4}$/.test(season) && (
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" onClick={() => setSeasonInput(String(Number(season) - 1))}>&lt;</Button>
                  <Button type="button" variant="ghost" onClick={() => setSeasonInput(String(Number(season) + 1))}>&gt;</Button>
                </div>
              )}
            </div>
            {seasonInput && !/^\d{4}$/.test(seasonInput) && seasonInput.toLowerCase() !== 'current' && (
              <p className="text-[10px] text-amber-600 mt-1">Enter four digits or 'current'.</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">Round</label>
            <input
              type="text"
              value={round}
              onChange={e => changeRound(e.target.value)}
              placeholder="optional"
              className="w-24 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-2 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20"
            />
          </div>
          {round && <Button type="button" variant="ghost" onClick={clearRound}>Clear Round</Button>}
        </div>
      </div>

      {/* Highlight panels */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="text-sm font-semibold mb-2 tracking-wide uppercase text-neutral-500">Last Race</h2>
          {lastState.loading && <Skeleton className="h-40" />}
          {lastState.error && <p className="text-xs text-red-600">Failed to load</p>}
            {lastRace && <RaceCard r={lastRace} badge="Last" />}
        </div>
        <div className="md:col-span-1">
          <h2 className="text-sm font-semibold mb-2 tracking-wide uppercase text-neutral-500">Next Race</h2>
          {nextState.loading && <Skeleton className="h-40" />}
          {nextState.error && <p className="text-xs text-red-600">Failed to load</p>}
          {nextRace && <RaceCard r={nextRace} badge="Next" />}
        </div>
        <div className="md:col-span-1">
          <h2 className="text-sm font-semibold mb-2 tracking-wide uppercase text-neutral-500">Selected Round</h2>
          {round && roundState.loading && <Skeleton className="h-40" />}
          {!round && <p className="text-xs text-neutral-500">Enter a round number to spotlight that race.</p>}
          {roundState.error && <p className="text-xs text-red-600">Failed to load round</p>}
          {roundRace && <RaceCard r={roundRace} badge={`Round ${roundRace.round}`} />}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Season Calendar ({season === 'current' ? seasonState.data?.season || '—' : season})</h2>
          {seasonState.loading && <span className="text-xs text-neutral-500">Loading…</span>}
          {seasonState.error && <span className="text-xs text-red-600">Error</span>}
        </div>
        {seasonState.loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton key={i} className="h-40" />)}
          </div>
        )}
        {!seasonState.loading && !seasonState.error && pageItems.length === 0 && (
          <p className="text-sm text-neutral-500">No races found.</p>
        )}
        {!seasonState.loading && !seasonState.error && pageItems.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map(r => <RaceCard key={r.raceId} r={r} />)}
            </div>
            <Pagination page={currentPage} pageSize={PAGE_SIZE} total={total} onChange={changePage} />
          </>
        )}
      </div>

      <div className="mt-12 text-[10px] uppercase tracking-wide text-neutral-500 flex flex-wrap gap-4">
        <p>Source: f1api.dev</p>
        <p>Races: {seasonState.data?.total ?? '—'}</p>
      </div>
    </div>
  )
}

