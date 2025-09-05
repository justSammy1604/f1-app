import React, { useCallback, useEffect, useMemo, useState } from 'react'
import BackToF1Button from '../../components/BackToF1Button.jsx'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Pagination from '../../components/Pagination.jsx'

const API_BASE = 'https://f1api.dev/api'
const PAGE_SIZE = 25

function fetchJson(url, signal) {
  return fetch(url, { signal }).then(r => { if (!r.ok) throw new Error(r.statusText || r.status); return r.json() })
}

export default function StandingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const yearParam = searchParams.get('year') || 'current'
  const typeParam = searchParams.get('type') || 'drivers' // 'drivers' | 'constructors'
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [year, setYear] = useState(yearParam)
  const [type, setType] = useState(typeParam)
  const [page, setPage] = useState(pageParam)
  const [state, setState] = useState({ loading: false, error: null, data: null })

  const endpoint = useMemo(() => {
    const segmentYear = year === 'current' ? 'current' : year
    return `${API_BASE}/${segmentYear}/${type === 'drivers' ? 'drivers-championship' : 'constructors-championship'}`
  }, [year, type])

  const updateURL = useCallback((p) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (p.year) {
        next.set('year', p.year)
      } else {
        next.delete('year')
      }
      if (p.type) {
        next.set('type', p.type)
      } else {
        next.delete('type')
      }
      if (p.page && p.page > 1) {
        next.set('page', String(p.page))
      } else {
        next.delete('page')
      }
      return next
    })
  }, [setSearchParams])

  useEffect(() => {
    const controller = new AbortController()
    setState({ loading: true, error: null, data: null })
    fetchJson(endpoint, controller.signal)
      .then(json => setState({ loading: false, error: null, data: json }))
      .catch(e => setState({ loading: false, error: e, data: null }))
    return () => controller.abort()
  }, [endpoint])

  const rows = useMemo(() => {
    const raw = state.data
    if (!raw) return []
    if (type === 'drivers') return raw.drivers_championship || []
    return raw.constructors_championship || []
  }, [state.data, type])

  const total = rows.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = rows.slice(start, start + PAGE_SIZE)

  function submit(e) {
    e.preventDefault()
    setPage(1)
    updateURL({ year, type, page: 1 })
  }

  function changeType(nextType) {
    setType(nextType)
    setPage(1)
    updateURL({ year, type: nextType, page: 1 })
  }

  function changePage(p) {
    setPage(p)
    updateURL({ year, type, page: p })
  }

  function reset() {
    setYear('current')
    setType('drivers')
    setPage(1)
    updateURL({ year: 'current', type: 'drivers', page: 1 })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Championship Standings</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">View Formula 1 Drivers & Constructors standings for any season (e.g. 2021) or the current live championship.</p>
        </div>
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
          <BackToF1Button />
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-neutral-500">Year (current or YYYY)</label>
            <input value={year} onChange={e => setYear(e.target.value)} placeholder="current" className="w-28 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-2 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-neutral-500">Type</label>
            <select value={type} onChange={e => changeType(e.target.value)} className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 px-2 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/20">
              <option value="drivers text">Drivers</option>
              <option value="constructors">Constructors</option>
            </select>
          </div>
          <Button type="submit">Load</Button>
          <Button type="button" variant="ghost" onClick={reset}>Reset</Button>
        </form>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <p><span className="font-semibold">Season:</span> {yearParam}</p>
        <p><span className="font-semibold">Category:</span> {type === 'drivers' ? 'Drivers' : 'Constructors'}</p>
        {state.data && <p><span className="font-semibold">Entries:</span> {total}</p>}
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <div className="border-b border-neutral-100 dark:border-neutral-800 px-5 py-3 flex items-center justify-between">
          <p className="text-sm font-medium">{type === 'drivers' ? 'Drivers Standings' : 'Constructors Standings'}</p>
          {state.loading && <span className="text-xs text-neutral-500">Loading…</span>}
          {state.error && <span className="text-xs text-red-600">Error {state.error.message}</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
              <tr className="text-center">
                <th className="px-4 py-2 font-semibold">Pos</th>
                {type === 'drivers' && <th className="px-4 py-2 font-semibold">Driver</th>}
                {type === 'drivers' && <th className="px-4 py-2 font-semibold hidden md:table-cell">Code</th>}
                <th className="px-4 py-2 font-semibold text">Team</th>
                <th className="px-4 py-2 font-semibold text-center">Points</th>
                <th className="px-4 py-2 font-semibold hidden sm:table-cell text-center">Wins</th>
              </tr>
            </thead>
            <tbody>
              {!state.loading && !state.error && pageRows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-neutral-500">No data.</td></tr>
              )}
              {pageRows.map(row => {
                if (type === 'drivers') {
                  const d = row.driver || {}
                  const t = row.team || {}
                  return (
                    <tr key={row.classificationId || row.driverId} className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition">
                      <td className="px-4 py-2 font-medium">{row.position}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{d.name} {d.surname}</td>
                      <td className="px-4 py-2 hidden md:table-cell">{d.shortName || '—'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{t.teamName || row.teamId}</td>
                      <td className="px-4 py-2 font-semibold">{row.points}</td>
                      <td className="px-4 py-2 hidden sm:table-cell">{row.wins}</td>
                    </tr>
                  )
                } else {
                  const t = row.team || {}
                  return (
                    <tr key={row.classificationId || row.teamId} className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition">
                      <td className="px-4 py-2 font-medium">{row.position}</td>
                      <td className="px-4 py-2 whitespace-nowrap" colSpan={ type === 'drivers' ? 1 : 2 }>{t.teamName || row.teamId}</td>
                      <td className="px-4 py-2 font-semibold">{row.points}</td>
                      <td className="px-4 py-2 hidden sm:table-cell">{row.wins}</td>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4">
          <Pagination page={currentPage} pageSize={PAGE_SIZE} total={total} onChange={changePage} />
        </div>
      </div>

      <div className="mt-8 text-[10px] uppercase tracking-wide text-neutral-500 flex flex-wrap gap-4">
        <p>Source: f1api.dev</p>
        {state.data && <p>Season: {state.data.season}</p>}
        {state.data && <p>ChampionshipId: {state.data.championshipId}</p>}
      </div>
    </div>
  )
}
