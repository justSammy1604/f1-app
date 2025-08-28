import React from 'react'

export default function Button({ children, variant = 'primary', className = '', ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm px-4 py-2 transition focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500/40',
    outline: 'border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-600 focus-visible:ring-neutral-500/30',
    ghost: 'text-red-600 hover:bg-red-600/10 dark:hover:bg-red-600/20 focus-visible:ring-red-500/30'
  }
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...rest}>
      {children}
    </button>
  )
}
