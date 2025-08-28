import React from 'react'

// Primary hero section with F1 branding colors
export default function Hero({ onView }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-neutral-900 to-red-700 ring-1 ring-neutral-800 shadow-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(225,6,0,0.25),transparent_60%)]" />
      <div className="relative px-6 py-20 md:px-12 lg:py-28 text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="text-white">The Pinnacle of </span>
          <span className="bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent drop-shadow">Motorsport</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base md:text-lg text-neutral-300 leading-relaxed">
          Formula 1 (F1) is the fastest regulated road‑course racing in the world: a fusion of cutting‑edge aerodynamics,
          hybrid power units, strategy, and driver skill where milliseconds decide glory across a global season.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={onView}
            className="group inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/50"
          >
            View F1
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <a
            href="#history"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-600/70 bg-neutral-800/40 px-6 py-3 text-sm md:text-base font-medium text-neutral-200 backdrop-blur transition hover:border-neutral-400 hover:text-white"
          >
            Brief History
          </a>
        </div>
      </div>
    </section>
  )
}
