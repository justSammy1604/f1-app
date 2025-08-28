import React from 'react'
import Button from './ui/Button.jsx'

export default function Pagination({ page, pageSize, total, onChange }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < pageCount
  if (pageCount <= 1) return null
  return (
    <div className="flex items-center justify-between gap-4 py-6 flex-wrap">
      <div className="text-xs text-neutral-500">Page {page} of {pageCount}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={!canPrev} onClick={() => onChange(page - 1)}>Prev</Button>
        <Button variant="outline" disabled={!canNext} onClick={() => onChange(page + 1)}>Next</Button>
      </div>
    </div>
  )
}
