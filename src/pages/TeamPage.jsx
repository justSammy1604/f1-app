import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTeam, getTeamByYear, getCurrentTeam, getTeamDriversCurrent, getTeamDriversByYear, placeholderLogo, colorFromId } from '../api/f1Api';

function TeamPage() {
  const { teamId, year } = useParams();
  const [team, setTeam] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentVariant = window.location.pathname.startsWith('/current/teams');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let t;
        if (currentVariant) t = await getCurrentTeam(teamId);
        else if (year) t = await getTeamByYear(year, teamId);
        else t = await getTeam(teamId);
        if (cancelled) return;
        const color = colorFromId(teamId);
        const logo = placeholderLogo(t.teamName.split(' ').slice(0,2).map(w=>w[0]).join(''), '#444444');
        setTeam({
          id: t.teamId,
          name: t.teamName,
          color,
          logo,
          nationality: t.teamNationality,
          firstAppeareance: t.firstAppeareance,
          constructorsChampionships: t.constructorsChampionships,
          driversChampionships: t.driversChampionships,
          url: t.url
        });
        let ds;
        try {
          if (currentVariant) ds = await getTeamDriversCurrent(teamId);
          else if (year) ds = await getTeamDriversByYear(year, teamId);
        } catch {}
        if (!cancelled) setDrivers((ds||[]).map(d=>d.name + ' ' + d.surname));
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [teamId, year, currentVariant]);

  if (loading) return <div className="p-8 text-center">Loading team...</div>;
  if (!team) return <div className="p-8 text-center">Team not found. <Link to="/teams" className="text-red-600 underline">Back</Link></div>;

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ borderTop: `8px solid ${team.color}` }}>
          <div className="p-6 md:p-8 text-center">
            <img 
              src={team.logo} 
              alt={`${team.name} Logo`} 
              className="w-32 h-32 mx-auto mb-4 rounded-full shadow-md"
            />
            <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: team.color }}>
              {team.name}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">{team.nationality}</p>
          </div>
          <div className="bg-gray-50 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Drivers</h2>
            <ul className="space-y-3">
              {drivers.length === 0 && <li className="text-gray-500">No driver list for this context.</li>}
              {drivers.map(driver => (
                <li key={driver} className="text-lg text-gray-700 bg-white p-3 rounded-md shadow-sm">{driver}</li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div><strong>First Appearance:</strong> {team.firstAppeareance ?? '—'}</div>
              <div><strong>Constructors Titles:</strong> {team.constructorsChampionships ?? '—'}</div>
              <div><strong>Drivers Titles:</strong> {team.driversChampionships ?? '—'}</div>
              {team.url && <div className="col-span-2"><strong>Wiki:</strong> <a href={team.url} target="_blank" rel="noreferrer" className="text-red-600 underline">Profile</a></div>}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/teams" className="text-gray-600 hover:underline font-medium">Back to teams</Link>
        </div>
      </div>
    </section>
  );
}

export default TeamPage;