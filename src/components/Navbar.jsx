import React from 'react'
import { useState } from 'react';
function Navbar({page, setPage}) {
    const linkStyles = 'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-gray-700 hover:text-white';
    const activeLink = "bg-red-600 text-white";
    const inactiveLink = "text-gray-300 hover:bg-gray-700 hover:text-white";
  return (
    <>
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">F1 Viewer</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => setPage('teams')}
                className={`${linkStyles} ${page === 'teams' ? activeLink : inactiveLink}`}
              >
                Teams
              </button>
              <button
                onClick={() => setPage('races')}
                className={`${linkStyles} ${page === 'races' ? activeLink : inactiveLink}`}
              >
                Races
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}

export default Navbar