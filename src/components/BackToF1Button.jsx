import React from 'react'
import { Link } from 'react-router-dom'
import Button from './ui/Button.jsx'

export default function BackToF1Button({ className = '' }) {
  return (
    <div className={className}>
      <Button asChild variant="ghost">
        <Link to="/f1" aria-label="Back to F1 Hub" className="inline-flex items-center gap-2">
          <span className="text-lg leading-none">←</span>
          <span className="font-medium">F1 Hub</span>
        </Link>
      </Button>
    </div>
  )
}
