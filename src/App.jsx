import { useState } from 'react'
import Teams from './components/Teams'
import Races from './components/Races'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
    <h1 className='text-3xl font-bold'>Hello World!!</h1>
    <Navbar />
    <div className="container mx-auto">
      <Teams />
      <Races />
    </div>
    <Footer />
  </>
  )
}

export default App
// App struct // 
// Main page for f1, all team names in their colors, logo
// teams will be clickable and will take you to the team page
// team page will have the team name, logo, and list of drivers, and their stats 