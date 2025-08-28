import React from 'react'

// Timeline / history section; items provided via props
export default function HistorySection({ items = [] }) {
  return (
    <section id="history" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          A Brief History
        </h2>
        <p className="mt-3 max-w-3xl text-neutral-600 dark:text-neutral-300 text-sm md:text-base leading-relaxed">
          From post‑war innovation to a data‑driven hybrid era, F1 has continuously redefined what is possible on four wheels.
          Below is a compressed snapshot of transformative decades.
        </p>
        <ol className="mt-10 space-y-8 border-l border-neutral-300 dark:border-neutral-700 pl-6">
          {items.map(item => (
            <li key={item.year} className="relative">
              <span className="absolute -left-[37px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-400 text-xs font-bold text-white ring-4 ring-white dark:ring-neutral-900 shadow-md">
                {item.year}
              </span>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{item.title}</h3>
              <p className="mt-1 text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
