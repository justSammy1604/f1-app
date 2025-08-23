import { useEffect, useState } from 'react';
import CardRaces from '../components/CardRaces';
import { getSeasonRaces } from '../api/f1Api';

function Races() {
  const [races, setRaces] = useState([]);
  const season = 2025; // could make dynamic later

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getSeasonRaces(season);
        if (cancelled) return;
        const mapped = data.map(r => ({
          id: r.raceId,
          name: r.raceName?.replace(/\n/g, ' '),
          circuit: r.circuit?.circuitName,
          date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
        }));
        setRaces(mapped);
      } catch (e) {
        console.error('Failed to load races', e);
      }
    })();
    return () => { cancelled = true; };
  }, [season]);
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
  )
}

export default Races