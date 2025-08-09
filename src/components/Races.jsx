import React from 'react'
import { useState } from 'react';
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
       <div className="flex-grow bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Race Calendar 2025</h2>
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {races.map((race, index) => (
              <li key={race.id} className="p-4 hover:bg-gray-50 flex items-center space-x-4">
                <div className="text-red-600 font-bold text-lg w-8 text-center">{index + 1}</div>
                <div className="flex-grow">
                  <p className="text-lg font-semibold text-gray-800">{race.name}</p>
                  <p className="text-sm text-gray-500">{race.circuit}</p>
                </div>
                <div className="text-right">
                  <p className="text-md font-medium text-gray-900">{race.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  )
}

export default Races