import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Pagination from '../../components/Pagination.jsx'
import BackToF1Button from '../../components/BackToF1Button.jsx'

// Session configuration mapping to endpoints
const SESSIONS = [
  { key: 'fp1', label: 'FP1', path: 'fp1' },
  { key: 'fp2', label: 'FP2', path: 'fp2' },
  { key: 'fp3', label: 'FP3', path: 'fp3' },
  { key: 'qualy', label: 'Qualifying', path: 'qualy' },
  { key: 'race', label: 'Race', path: 'race' },
  { key: 'sprintQualy', label: 'Sprint Qualy', path: 'sprint/qualy' },
  { key: 'sprintRace', label: 'Sprint', path: 'sprint/race' }
]

const API_BASE = 'https://f1api.dev/api'

// Helper fetch with abort & error capture
function fetchJson(url, signal) {
  return fetch(url, { signal }).then(r => {
    if (!r.ok) throw new Error(r.status.toString())
    return r.json()
  })
}

export default function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const yearParam = searchParams.get('year') || ''
  const roundParam = searchParams.get('round') || ''
  const sessionParam = searchParams.get('session') || 'race' // default focus
  const [year, setYear] = useState(yearParam)
  const [round, setRound] = useState(roundParam)
  const [activeSession, setActiveSession] = useState(sessionParam)
  const [allData, setAllData] = useState({}) // key -> { loading, error, data }
  const [loadingGroup, setLoadingGroup] = useState(false)

  // Pagination per session key
  const [pageBySession, setPageBySession] = useState({})
  const rowsPerPage = 10

  function updateURL(params) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      Object.entries(params).forEach(([k, v]) => {
        if (v) {
          next.set(k, v)
        } else {
          next.delete(k)
        }
      })
      return next
    })
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    updateURL({ year: year || '', round: round || '', session: activeSession })
    // Trigger refetch
    setAllData({})
  }

  function changeSession(key) {
    setActiveSession(key)
    updateURL({ year: yearParam, round: roundParam, session: key })
  }

  // Build list of sessions to fetch: if year & round provided and user wants one session -> that session only (but we also preload others for quick switching?) For performance, fetch only active session plus any already cached.
  // If session = 'all' design? Requirement: ability to view all results of all races. We'll interpret as: user can switch sessions; race results default. Provide button "Load All Sessions" to prefetch.

  const buildSessionUrl = useCallback((sessionKey) => {
    const config = SESSIONS.find(s => s.key === sessionKey)
    if (!config) return null
    if (!yearParam || !roundParam) {
      return `${API_BASE}/current/last/${config.path}`
    }
    return `${API_BASE}/${yearParam}/${roundParam}/${config.path}`
  }, [yearParam, roundParam])

  // Fetch active session if not already
  useEffect(() => {
    const key = activeSession
    if (allData[key]?.loading || allData[key]?.data) return
    const url = buildSessionUrl(key)
    if (!url) return
    const controller = new AbortController()
    setAllData(prev => ({ ...prev, [key]: { loading: true, error: null, data: null } }))
    fetchJson(url, controller.signal)
      .then(json => setAllData(prev => ({ ...prev, [key]: { loading: false, error: null, data: json } })))
      .catch(err => setAllData(prev => ({ ...prev, [key]: { loading: false, error: err, data: null } })))
    return () => controller.abort()
  }, [activeSession, buildSessionUrl, allData])

  function prefetchAll() {
    setLoadingGroup(true)
    const controller = new AbortController()
    Promise.allSettled(SESSIONS.map(s => {
      const url = buildSessionUrl(s.key)
      if (!url) return Promise.resolve()
      if (allData[s.key]?.data) return Promise.resolve()
      return fetchJson(url, controller.signal).then(json => ({ key: s.key, json })).catch(e => ({ key: s.key, error: e }))
    })).then(results => {
      setAllData(prev => {
        const next = { ...prev }
        results.forEach(r => {
          if (!r) return
            if (r && r.value && r.value.key) {
              next[r.value.key] = { loading: false, error: null, data: r.value.json }
            } else if (r && r.value === undefined && r.reason && r.reason.key) {
              next[r.reason.key] = { loading: false, error: r.reason.error, data: null }
            } else if (r.status === 'fulfilled' && r.value && r.value.key) {
              next[r.value.key] = { loading: false, error: null, data: r.value.json }
            }
        })
        return next
      })
    }).finally(() => setLoadingGroup(false))
    return () => controller.abort()
  }

  // Normalize session data
  function extractResults(bundle) {
    if (!bundle?.data) return []
    const raceObj = bundle.data.races || bundle.data.race || bundle.data
    // find first array property ending with 'Results'
    const keys = Object.keys(raceObj || {})
    for (const k of keys) {
      const v = raceObj[k]
      if (Array.isArray(v) && /Results$/i.test(k)) return v
    }
    // Sometimes result arrays may be directly provided
    if (Array.isArray(raceObj)) return raceObj
    return []
  }

  const activeBundle = allData[activeSession]
  const rawResults = useMemo(() => extractResults(activeBundle), [activeBundle])

  // Pagination for active session
  const currentPage = pageBySession[activeSession] || 1
  const total = rawResults.length
  const start = (currentPage - 1) * rowsPerPage
  const pageRows = rawResults.slice(start, start + rowsPerPage)

  function changePage(p) {
    setPageBySession(prev => ({ ...prev, [activeSession]: p }))
  }

  function rowToUnified(row, index) {
    const driver = row.driver || {}
    const team = row.team || {}
    const time = row.time || row.result?.raceTime || row.result?.time || row.result?.lapTime || row.result?.bestLap || '—'
    const position = row.result?.finishingPosition || row.fp1Id || row.fp2Id || row.fp3Id || row.qualyId || row.raceId || index + 1
    const points = row.result?.pointsObtained
    return {
      pos: position,
      driver: [driver.name, driver.surname].filter(Boolean).join(' '),
      code: driver.shortName,
      team: team.teamName,
      time,
      points: points !== undefined ? points : null 
    }
  }

  const unifiedRows = pageRows.map(rowToUnified)

  const heading = yearParam && roundParam
    ? `Season ${yearParam} • Round ${roundParam}`
    : 'Latest Round Sessions'

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Session Results</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">Browse Formula 1 session results. Search by season year and round OR leave blank to view the latest Grand Prix sessions. Switch between FP, Qualifying, Sprint and Race data.</p>
        </div>
        <BackToF1Button />
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-neutral-500">Year</label>
            <input value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2024" className="w-28 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-2 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20" />
          </div>
            <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-neutral-500">Round</label>
            <input value={round} onChange={e => setRound(e.target.value)} placeholder="e.g. 1" className="w-24 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-2 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-neutral-500">Session</label>
            <select value={activeSession} onChange={e => changeSession(e.target.value)} className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-2 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20">
              {SESSIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <Button type="submit">Load</Button>
          <Button type="button" variant="outline" disabled={loadingGroup} onClick={prefetchAll}>{loadingGroup ? 'Prefetching…' : 'Prefetch All Sessions'}</Button>
          <Button type="button" variant="ghost" onClick={() => { setYear(''); setRound(''); updateURL({ year: '', round: '', session: activeSession }); setAllData({}); }}>Reset</Button>
        </form>
      </header>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
        <div className="flex flex-wrap gap-2">
          {SESSIONS.map(s => (
            <button key={s.key} onClick={() => changeSession(s.key)} className={`text-xs rounded-full px-3 py-1.5 font-medium border transition ${activeSession === s.key ? 'bg-red-600 text-white border-red-600' : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Session content */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <div className="border-b border-neutral-100 dark:border-neutral-800 px-5 py-3 flex items-center justify-between">
          <p className="text-sm font-medium">{SESSIONS.find(s => s.key === activeSession)?.label} Results</p>
          {activeBundle?.loading && <span className="text-xs text-neutral-500">Loading…</span>}
          {activeBundle?.error && <span className="text-xs text-red-600">Error {activeBundle.error.message}</span>}
          {!activeBundle?.loading && !activeBundle?.data && !activeBundle?.error && <span className="text-xs text-neutral-500">No data yet</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
              <tr className="text-left">
                <th className="px-4 py-2 font-semibold">Pos</th>
                <th className="px-4 py-2 font-semibold">Driver</th>
                <th className="px-4 py-2 font-semibold hidden sm:table-cell">Code</th>
                <th className="px-4 py-2 font-semibold">Team</th>
                <th className="px-4 py-2 font-semibold">Time / Finish</th>
                <th className="px-4 py-2 font-semibold hidden md:table-cell">Pts</th>
              </tr>
            </thead>
            <tbody>
              {unifiedRows.length === 0 && !activeBundle?.loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">{activeBundle?.error ? 'No data for this session (maybe not a sprint weekend).' : 'No results.'}</td>
                </tr>
              )}
              {unifiedRows.map((r, i) => (
                <tr key={i} className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition">
                  <td className="px-4 py-2 font-medium">{r.pos}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{r.driver || '—'}</td>
                  <td className="px-4 py-2 hidden sm:table-cell">{r.code || '—'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{r.team || '—'}</td>
                  <td className="px-4 py-2">{r.time}</td>
                  <td className="px-4 py-2 hidden md:table-cell">{r.points ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4">
          <Pagination page={currentPage} pageSize={rowsPerPage} total={total} onChange={changePage} />
        </div>
      </div>

      <div className="mt-8 text-[10px] uppercase tracking-wide text-neutral-500 flex flex-wrap gap-4">
        <p>Source: f1api.dev</p>
        <p>Fetched: {Object.keys(allData).filter(k => allData[k]?.data).length} / {SESSIONS.length} sessions cached</p>
      </div>
    </div>
  )
}
