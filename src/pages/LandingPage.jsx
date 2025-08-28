import React from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import HistorySection from '../components/HistorySection.jsx'
import StatCard from '../components/StatCard.jsx'

export default function LandingPage() {
  const navigate = useNavigate()

  const historyItems = [
    {
      year: '1950s',
      title: 'World Championship Begins',
      description: 'The first official F1 World Championship (1950) formalizes Grand Prix racing; front‑engined cars and cigar‑shaped silhouettes dominate.'
    },
    {
      year: '1960s',
      title: 'Mid‑Engine Revolution',
      description: 'Teams adopt rear / mid‑engine layouts popularized by Cooper; safety and monocoque chassis innovations accelerate.'
    },
    {
      year: '1970s',
      title: 'Ground Effect Era',
      description: 'Aerodynamic experimentation leads to ground‑effect tunnels producing massive downforce; regulations tighten after extreme cornering speeds.'
    },
    {
      year: '1980s',
      title: 'Turbo Power Peaks',
      description: 'Turbocharged engines eclipse 1000+ hp in qualifying trim; electronic aids and carbon fibre become standard.'
    },
    {
      year: '2000s',
      title: 'Refinement & Reliability',
      description: 'V10 to V8 transitions; focus on reliability, simulation, and advanced materials; aerodynamic sophistication surges.'
    },
    {
      year: 'Hybrid Era',
      title: 'Efficiency + Performance',
      description: 'Since 2014, complex hybrid power units blend thermal efficiency with electrification, pushing energy recovery and sustainability.'
    }
  ]

  const stats = [
    { label: 'Races / Season (approx)', value: '24', accent: 'red' },
    { label: 'Teams on Grid', value: '10', accent: 'neutral' },
    { label: 'Hybrid Era Began', value: '2014', accent: 'dark' }
  ]

  return (
    <main className="space-y-28 pb-32">
      <Hero onView={() => navigate('/f1')} />

      <section aria-label="Key stats" className="mx-auto max-w-6xl px-2 md:px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <HistorySection items={historyItems} />
      </div>

      <footer className="mx-auto max-w-6xl px-4 text-center text-xs text-neutral-500">
        <p>Informational fan project. Data points are illustrative.</p>
      </footer>
    </main>
  )
}
