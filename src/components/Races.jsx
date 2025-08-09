import React from 'react'

function Races() {
const f1Data = {
    races: [
    { id: 1, name: 'Bahrain Grand Prix', circuit: 'Bahrain International Circuit', date: 'Mar 02, 2025' },
    { id: 2, name: 'Saudi Arabian Grand Prix', circuit: 'Jeddah Corniche Circuit', date: 'Mar 09, 2025' },
    { id: 3, name: 'Australian Grand Prix', circuit: 'Albert Park Circuit', date: 'Mar 23, 2025' },
    { id: 4, name: 'Japanese Grand Prix', circuit: 'Suzuka International Racing Course', date: 'Apr 06, 2025' },
    { id: 5, name: 'Chinese Grand Prix', circuit: 'Shanghai International Circuit', date: 'Apr 20, 2025' },
    { id: 6, name: 'Miami Grand Prix', circuit: 'Miami International Autodrome', date: 'May 04, 2025' },
    { id: 7, name: 'Emilia Romagna Grand Prix', circuit: 'Imola Circuit', date: 'May 18, 2025' },
    { id: 8, name: 'Monaco Grand Prix', circuit: 'Circuit de Monaco', date: 'May 25, 2025' },
    { id: 9, name: 'Canadian Grand Prix', circuit: 'Circuit Gilles Villeneuve', date: 'Jun 08, 2025' },
    { id: 10, name: 'Spanish Grand Prix', circuit: 'Circuit de Barcelona-Catalunya', date: 'Jun 22, 2025' },
  ]
}
const { races } = f1Data;
  return (
    <>
       <section className="bg-gray-100/50 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-8">Race Calendar 2025</h2>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {races.map((race, index) => (
              <li key={race.id} className="p-4 sm:p-5 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <div className="text-red-600 font-bold text-lg w-8 text-center self-start sm:self-auto">{index + 1}</div>
                  <div className="flex-grow">
                    <p className="text-base sm:text-lg font-semibold text-gray-800">{race.name}</p>
                    <p className="text-sm text-gray-500">{race.circuit}</p>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-sm sm:text-base font-medium text-gray-900">{race.date}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
    </>
  )
}

export default Races