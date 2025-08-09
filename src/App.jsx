import React from 'react'
import { useState } from 'react'
import Teams from './components/Teams'
import Races from './components/Races'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


function App() {
  const [page, setPage] = useState('teams');

  const renderPage = () => {
    switch (page) {
      case 'teams':
        return <Teams />;
      case 'races':
        return <Races />;
      default:
        return <Teams />;
    }
  };
  return (
    <>
    <div className="min-h-screen flex flex-col antialiased">
      <Navbar page={page} setPage={setPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  </>
  )
}

export default App
// App struct // 
// Main page for f1, all team names in their colors, logo
// teams will be clickable and will take you to the team page
// team page will have the team name, logo, and list of drivers, and their stats