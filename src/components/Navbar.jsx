import { useState } from 'react';
function Navbar({page, setPage}) {
    const [open, setOpen] = useState(false);
    const linkStyles = 'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300';
    const activeLink = "bg-red-600 text-white";
    const inactiveLink = "text-gray-300 hover:bg-gray-700 hover:text-white";
  return (
    <>
    <nav className="bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/vite.svg" alt="F1 Viewer" className="w-6 h-6" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">F1 Viewer</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <button
                onClick={() => { setPage('teams'); setOpen(false); }}
                className={`${linkStyles} ${page === 'teams' ? activeLink : inactiveLink}`}
              >
                Teams
              </button>
              <button
                onClick={() => { setPage('races'); setOpen(false); }}
                className={`${linkStyles} ${page === 'races' ? activeLink : inactiveLink}`}
              >
                Races
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(o => !o)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => { setPage('teams'); setOpen(false); }}
              className={`block w-full text-left ${linkStyles} ${page === 'teams' ? activeLink : inactiveLink}`}
            >
              Teams
            </button>
            <button
              onClick={() => { setPage('races'); setOpen(false); }}
              className={`block w-full text-left ${linkStyles} ${page === 'races' ? activeLink : inactiveLink}`}
            >
              Races
            </button>
          </div>
        </div>
      )}
    </nav>
    </>
  )
}

export default Navbar