import React from 'react'

export function Card({ className = '', children }) { 
  return (
    <div className={`rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm ${className}`}>{children}</div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-5 border-b border-neutral-100 dark:border-neutral-800 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`font-semibold text-lg leading-tight ${className}`}>{children}</h3>
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-5 space-y-4 text-sm leading-relaxed ${className}`}>{children}</div>
}
