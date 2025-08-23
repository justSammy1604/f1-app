import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Teams from './pages/Teams'
import Races from './pages/Races'
import TeamPage from './pages/TeamPage'
import TeamSearch from './pages/TeamSearch'
import Drivers from './pages/Drivers'
import DriversYear from './pages/DriversYear'
import DriversCurrent from './pages/DriversCurrent'
import DriverDetail from './pages/DriverDetail'
import DriverSearch from './pages/DriverSearch'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


function App() {
  return (
    <>
    <div className="min-h-screen flex flex-col antialiased">
      <BrowserRouter>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/teams" replace />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:teamId" element={<TeamPage />} />
            <Route path="/teams/search/:query" element={<TeamSearch />} />
            <Route path="/races" element={<Races />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/drivers/current" element={<DriversCurrent />} />
            <Route path="/drivers/:year" element={<DriversYear />} />
            <Route path="/drivers/:year/:driverId" element={<DriverDetail />} />
            <Route path="/driver/:driverId" element={<DriverDetail />} />
            <Route path="/drivers/search/:query" element={<DriverSearch />} />
            <Route path="*" element={<Navigate to="/teams" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  </>
  )
}

export default App
// App struct // 
// Main page for f1, all team names in their colors, logo
// teams will be clickable and will take you to the team page
// team page will have the team name, logo, and list of drivers, and their stats