import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardTeams from '../components/CardTeams';
import { getTeams, colorFromId, placeholderLogo } from '../api/f1Api';

function Teams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getTeams(50);
        if (cancelled) return;
        const mapped = data.map(t => {
          const color = colorFromId(t.teamId);
          return {
            id: t.teamId,
            name: t.teamName,
            color,
            logo: placeholderLogo(t.teamName.split(' ').slice(0,2).map(w=>w[0]).join(''), color.replace('hsl(','').split(' ')[0])
          };
        });
        setTeams(mapped);
      } catch (e) {
        console.error('Failed to load teams', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  return (
    <section className="bg-gray-100/50 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6">Formula 1 Teams 2025</h2>
        <form onSubmit={e=>{e.preventDefault(); if(search.trim()) navigate(`/teams/search/${encodeURIComponent(search.trim())}`)}} className="flex flex-wrap gap-2 justify-center mb-8">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search teams" className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[240px]" />
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Search</button>
          {search && <button type="button" onClick={()=>{setSearch('')}} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Clear</button>}
        </form>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          <CardTeams teams={teams} />
        </div>
      </div>
    </section>
  )
}

export default Teams