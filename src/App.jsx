import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import F1Page from './pages/F1Page.jsx'
import TeamsPage from './pages/f1/TeamsPage.jsx'
import TeamDetailPage from './pages/f1/TeamDetailPage.jsx'
import DriversPage from './pages/f1/DriversPage.jsx'
import DriverDetailPage from './pages/f1/DriverDetailPage.jsx'
import RacesPage from './pages/f1/RacesPage.jsx'
import CircuitsPage from './pages/f1/CircuitsPage.jsx'
import SeasonsPage from './pages/f1/SeasonsPage.jsx'
import ResultsPage from './pages/f1/ResultsPage.jsx'
import StandingsPage from './pages/f1/StandingsPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/f1" element={<F1Page />} />
          <Route path="/f1/teams" element={<TeamsPage />} />
          <Route path="/f1/teams/:slug" element={<TeamDetailPage />} />
          <Route path="/f1/drivers" element={<DriversPage />} />
          <Route path="/f1/drivers/:driverId" element={<DriverDetailPage />} />
          <Route path="/f1/races" element={<RacesPage />} />
          <Route path="/f1/circuits" element={<CircuitsPage />} /> 
            <Route path="/f1/seasons" element={<SeasonsPage />} />
          <Route path="/f1/results" element={<ResultsPage />} />
          <Route path="/f1/standings" element={<StandingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
