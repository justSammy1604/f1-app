import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { searchDrivers, placeholderImage } from '../api/f1Api';
import CardDrivers from '../components/CardDrivers';

export default function DriverSearch() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(query || '');
  const [drivers, setDrivers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 24;
  const typingTimer = useRef();

  useEffect(() => { setInput(query || ''); setOffset(0); }, [query]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!query) { setDrivers([]); setTotal(0); return; }
      const { items, total } = await searchDrivers(query, limit, offset);
      if (cancelled) return;
      setTotal(total);
      const mapped = items.map(d => ({
        id: d.driverId,
        firstName: d.name,
        lastName: d.surname,
        driverNumber: d.number ?? '-',
        image: placeholderImage((d.name?.[0]||'') + (d.surname?.[0]||''))
      }));
      // Exact match prioritization
      const exact = mapped.find(m => `${m.firstName} ${m.lastName}`.toLowerCase() === query.toLowerCase() || m.lastName?.toLowerCase() === query.toLowerCase());
      if (exact) {
        setDrivers([exact, ...mapped.filter(m => m.id !== exact.id)]);
      } else setDrivers(mapped);
    })();
    return () => { cancelled = true; };
  }, [query, offset]);

  return (
    <section className="bg-gray-100/50 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={e => { e.preventDefault(); navigate(`/drivers/search/${encodeURIComponent(input.trim())}`); }} className="mb-6 flex flex-wrap gap-2 items-center">
          <input
            value={input}
            onChange={e=>{
              setInput(e.target.value);
              clearTimeout(typingTimer.current);
              typingTimer.current = setTimeout(()=>{
                navigate(`/drivers/search/${encodeURIComponent(e.target.value.trim())}`);
              }, 400);
            }}
            placeholder="Search drivers"
            className="flex-grow min-w-[240px] rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">Search</button>
          {query && <span className="text-xs text-gray-500 ml-2">Total: {total}</span>}
        </form>
        <div className="mb-4 flex justify-between items-center">
          <button disabled={offset===0} onClick={()=>setOffset(o=>Math.max(0,o-limit))} className={`px-4 py-2 rounded-md text-sm font-medium ${offset===0?'bg-gray-300 text-gray-500 cursor-not-allowed':'bg-gray-800 text-white hover:bg-gray-900'}`}>Previous</button>
          <div className="text-sm text-gray-600">Showing {drivers.length ? offset+1 : 0}-{offset+drivers.length} of {total}</div>
          <button disabled={offset+limit>=total} onClick={()=>setOffset(o=>o+limit)} className={`px-4 py-2 rounded-md text-sm font-medium ${(offset+limit>=total)?'bg-gray-300 text-gray-500 cursor-not-allowed':'bg-gray-800 text-white hover:bg-gray-900'}`}>Next</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          <CardDrivers drivers={drivers} />
        </div>
      </div>
    </section>
  );
}
