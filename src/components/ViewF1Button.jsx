import React from 'react'

export default function ViewF1Button({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center gap-2 rounded-full bg-red-600/90 px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-red-900/30 transition hover:bg-red-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/50"
    >
      View F1
      <span className="text-base">→</span>
    </button>
  )
}
