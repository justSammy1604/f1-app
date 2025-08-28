import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

const sections = [
  { to: '/f1/teams', label: 'Teams', desc: 'Browse constructors and their details.' },
  { to: '/f1/drivers', label: 'Drivers', desc: 'Driver roster, stats & bios.' },
  { to: '/f1/races', label: 'Races', desc: 'Calendar & results.' },
  { to: '/f1/circuits', label: 'Circuits', desc: 'Track layouts & characteristics.' },
  { to: '/f1/seasons', label: 'Seasons', desc: 'Historical championship snapshots.' },
  { to: '/f1/results', label: 'Results', desc: 'Session results: FP, Qualy, Race.' }
]

export default function F1Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 via-red-400 to-white bg-clip-text text-transparent">Formula 1 Hub</h1>
        <p className="mt-5 max-w-2xl text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed items-center">Explore structured data about the pinnacle of motorsport. Select a section below to dive deeper.</p>
        <div className="mt-6">
          <Link to="/" className="text-xs font-medium text-red-600 hover:underline">← Landing</Link>
        </div>
      </header>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(s => (
          <div key={s.to} className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-semibold tracking-tight">{s.label}</h2>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 flex-1">{s.desc}</p>
            <Button as-child="true" className="mt-6">
              <Link to={s.to}>View {s.label} →</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

