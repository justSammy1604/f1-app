import { useState, useEffect } from 'react';
import CardRaces from '../components/CardRaces';
import { getRaces } from '../api/f1Api';

function Races() {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    const fetchRaces = async () => {
      const apiRaces = await getRaces();
      setRaces(apiRaces);
    };

    fetchRaces();
  }, []);

  return (
    <>
      <section className="bg-gray-100/50 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-8">Race Calendar 2025</h2>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-200">
              <CardRaces races={races} />
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Races;