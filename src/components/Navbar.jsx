import { useState } from 'react';
import { NavLink } from 'react-router-dom';
function Navbar() {
    const [open, setOpen] = useState(false);
    const baseLink = 'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300';
    const getLinkClass = ({ isActive }) =>
      `${baseLink} ${isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;
  return (
    <>
    <nav className="bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="src/images/f1-logo.png" alt="F1 Viewer" className="w-6 h-6" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">F1 Viewer</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <NavLink to="/teams" className={getLinkClass} onClick={() => setOpen(false)}>Teams</NavLink>
              <div className="relative group">
                <NavLink to="/drivers" className={getLinkClass} onClick={() => setOpen(false)}>Drivers</NavLink>
                <div className="absolute left-0 mt-1 hidden group-hover:block bg-gray-800 rounded-md shadow-lg py-2 min-w-[160px]">
                  <NavLink to="/drivers/current" className={({isActive})=>`block px-4 py-1 text-sm ${isActive?'text-red-400':'text-gray-200 hover:text-white'}`}>Current</NavLink>
                  <button onClick={()=>{const y=new Date().getFullYear(); window.location.href=`/drivers/${y}`}} className="block w-full text-left px-4 py-1 text-sm text-gray-200 hover:text-white">This Year</button>
                  <NavLink to="/drivers/search/hamilton" className={({isActive})=>`block px-4 py-1 text-sm ${isActive?'text-red-400':'text-gray-200 hover:text-white'}`}>Search Example</NavLink>
                </div>
              </div>
              <NavLink to="/races" className={getLinkClass} onClick={() => setOpen(false)}>Races</NavLink>
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
            <NavLink to="/teams" className={getLinkClass} onClick={() => setOpen(false)}>Teams</NavLink>
            <NavLink to="/teams/search/ferrari" className={getLinkClass} onClick={() => setOpen(false)}>Search Teams</NavLink>
            <NavLink to="/drivers" className={getLinkClass} onClick={() => setOpen(false)}>Drivers</NavLink>
            <NavLink to="/drivers/current" className={getLinkClass} onClick={() => setOpen(false)}>Current Drivers</NavLink>
            <NavLink to="/races" className={getLinkClass} onClick={() => setOpen(false)}>Races</NavLink>
          </div>
        </div>
      )}
    </nav>
    </>
  )
}

export default Navbar