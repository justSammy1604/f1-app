import React from 'react'
import { useState } from 'react';
function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} F1 Viewer. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-1">This is a fan-made project and not affiliated with Formula 1.</p>
      </div>
    </footer>
  )
}

export default Footer