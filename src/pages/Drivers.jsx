import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardDrivers from '../components/CardDrivers';
import { getDrivers, placeholderImage } from '../api/f1Api';

function Drivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getDrivers(50);
        if (cancelled) return;
        const mapped = data.map(d => ({
          id: d.driverId,
          firstName: d.name,
            // Some birthday formats in API vary (YYYY-MM-DD vs DD/MM/YYYY)
          lastName: d.surname,
          driverNumber: d.number ?? '-',
          image: placeholderImage((d.name?.[0] || '') + (d.surname?.[0] || '')),
        }));
        setDrivers(mapped);
      } catch (e) {
        console.error('Failed to load drivers', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('2025');
  return (
    <section className="bg-gray-100/50 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6">Drivers (All Historical)</h2>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <form onSubmit={e=>{e.preventDefault(); if(search) navigate(`/drivers/search/${encodeURIComponent(search)}`)}} className="flex gap-2">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Go</button>
          </form>
          <form onSubmit={e=>{e.preventDefault(); if(year) navigate(`/drivers/${year}`)}} className="flex gap-2">
            <input value={year} onChange={e=>setYear(e.target.value)} placeholder="Year" className="w-24 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">Year</button>
          </form>
          <button onClick={()=>navigate('/drivers/current')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Current</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          <CardDrivers drivers={drivers} />
        </div>
      </div>
    </section>
  );
}

export default Drivers;
