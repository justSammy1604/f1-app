import React from 'react'

function Teams() {
    const f1Data = {
  teams: [
    { id: 'mercedes', name: 'Mercedes-AMG PETRONAS F1 Team', color: '#6CD3BF', logo: 'https://placehold.co/100x100/6CD3BF/000000?text=M' },
    { id: 'red_bull', name: 'Oracle Red Bull Racing', color: '#1E5BC6', logo: 'https://placehold.co/100x100/1E5BC6/FFFFFF?text=RB' },
    { id: 'ferrari', name: 'Scuderia Ferrari', color: '#F91536', logo: 'https://placehold.co/100x100/F91536/FFFFFF?text=F' },
    { id: 'mclaren', name: 'McLaren Formula 1 Team', color: '#F58020', logo: 'https://placehold.co/100x100/F58020/000000?text=ML' },
    { id: 'aston_martin', name: 'Aston Martin Aramco F1 Team', color: '#358C75', logo: 'https://placehold.co/100x100/358C75/FFFFFF?text=AM' },
    { id: 'alpine', name: 'BWT Alpine F1 Team', color: '#2293D1', logo: 'https://placehold.co/100x100/2293D1/FFFFFF?text=A' },
    { id: 'williams', name: 'Williams Racing', color: '#37BEDD', logo: 'https://placehold.co/100x100/37BEDD/000000?text=W' },
    { id: 'rb', name: 'Visa Cash App RB F1 Team', color: '#4664C8', logo: 'https://placehold.co/100x100/4664C8/FFFFFF?text=RB' },
    { id: 'sauber', name: 'Stake F1 Team Kick Sauber', color: '#52E252', logo: 'https://placehold.co/100x100/52E252/000000?text=S' },
    { id: 'haas', name: 'MoneyGram Haas F1 Team', color: '#B6BABD', logo: 'https://placehold.co/100x100/B6BABD/000000?text=H' },
  ],
}
const { teams } = f1Data;
  return (
    <>
    <section className="bg-gray-100/50 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-8">Formula 1 Teams 2025</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {teams.map(team => (
            <button 
              key={team.id} 
              className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 transform transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              style={{ borderTop: `6px solid ${team.color}` }}
            >
              <div className="p-6 flex flex-col items-center gap-3">
                <img 
                  src={team.logo} 
                  alt={`${team.name} Logo`} 
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2 rounded-full shadow"
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/cccccc/000000?text=Error'; }}
                />
                <h3 
                  className="text-base sm:text-lg font-bold text-center"
                  style={{ color: team.color }}
                >
                  {team.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}

export default Teams