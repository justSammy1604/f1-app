import React from 'react'

export default function StatCard({ label, value, accent = 'red' }) {
  const accentClasses = {
    red: 'from-red-600 to-red-400 text-white',
    neutral: 'from-neutral-700 to-neutral-500 text-white',
    dark: 'from-black to-neutral-800 text-red-500'
  }[accent] || 'from-red-600 to-red-400 text-white'

  return (
    <div className="group relative overflow-hidden rounded-2xl p-[1px]">
      <div className={`absolute inset-0 bg-gradient-to-br ${accentClasses} opacity-80 blur-sm transition duration-500 group-hover:opacity-100`} />
      <div className="relative h-full w-full rounded-2xl bg-neutral-950 text-neutral-100 px-6 py-6 flex flex-col justify-between shadow-lg ring-1 ring-neutral-800">
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-400">{label}</p>
          <p className="mt-2 text-3xl md:text-4xl font-bold leading-none">{value}</p>
        </div>
        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-red-500 to-red-300" />
      </div>
    </div>
  )
}
