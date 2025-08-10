import { useParams, Link } from 'react-router-dom';

const f1Data = {
  teams: [
    { id: 'mercedes', name: 'Mercedes-AMG PETRONAS F1 Team', color: '#6CD3BF', logo: 'https://placehold.co/100x100/6CD3BF/000000?text=M', drivers: ['Kimi Antonelli', 'George Russell'] },
    { id: 'red_bull', name: 'Oracle Red Bull Racing', color: '#1E5BC6', logo: 'https://placehold.co/100x100/1E5BC6/FFFFFF?text=RB', drivers: ['Max Verstappen', 'Liam Lawson'] },
    { id: 'ferrari', name: 'Scuderia Ferrari', color: '#F91536', logo: 'https://placehold.co/100x100/F91536/FFFFFF?text=F', drivers: ['Charles Leclerc', 'Lewis Hamilton'] },
    { id: 'mclaren', name: 'McLaren Formula 1 Team', color: '#F58020', logo: 'https://placehold.co/100x100/F58020/000000?text=ML', drivers: ['Lando Norris', 'Oscar Piastri'] },
    { id: 'aston_martin', name: 'Aston Martin Aramco F1 Team', color: '#358C75', logo: 'https://placehold.co/100x100/358C75/FFFFFF?text=AM', drivers: ['Fernando Alonso', 'Lance Stroll'] },
    { id: 'alpine', name: 'BWT Alpine F1 Team', color: '#2293D1', logo: 'https://placehold.co/100x100/2293D1/FFFFFF?text=A', drivers: ['Franco Colapinto', 'Pierre Gasly'] },
    { id: 'williams', name: 'Williams Racing', color: '#37BEDD', logo: 'https://placehold.co/100x100/37BEDD/000000?text=W', drivers: ['Alexander Albon', 'Carlos Sainz'] },
    { id: 'rb', name: 'Visa Cash App RB F1 Team', color: '#4664C8', logo: 'https://placehold.co/100x100/4664C8/FFFFFF?text=RB', drivers: ['Yuki Tsunoda', 'Isack Hadjar'] },
    { id: 'sauber', name: 'Stake F1 Team Kick Sauber', color: '#52E252', logo: 'https://placehold.co/100x100/52E252/000000?text=S', drivers: ['Nico Hülkenberg', 'Gabriel Bortoletto'] },
    { id: 'haas', name: 'MoneyGram Haas F1 Team', color: '#B6BABD', logo: 'https://placehold.co/100x100/B6BABD/000000?text=H', drivers: ['Ollie Bearman', 'Esteban Ocon'] },
  ],
};

function TeamPage() {
  const { teamId } = useParams();
  const teamIndex = f1Data.teams.findIndex(t => t.id === teamId);

  if (teamIndex === -1) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Team not found</h2>
        <Link to="/teams" className="text-red-600 hover:underline">Back to teams</Link>
      </div>
    );
  }

  const team = f1Data.teams[teamIndex];
  const prevTeamId = teamIndex > 0 ? f1Data.teams[teamIndex - 1].id : null;
  const nextTeamId = teamIndex < f1Data.teams.length - 1 ? f1Data.teams[teamIndex + 1].id : null;

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
          </div>
          <div className="bg-gray-50 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Drivers</h2>
            <ul className="space-y-3">
              {team.drivers.map(driver => (
                <li key={driver} className="text-lg text-gray-700 bg-white p-3 rounded-md shadow-sm">{driver}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center mt-8">
          <div>
            {prevTeamId && (
              <Link to={`/teams/${prevTeamId}`} className="text-red-600 hover:underline font-medium">
                &larr; Previous Team
              </Link>
            )}
          </div>
          <Link to="/teams" className="text-gray-600 hover:underline font-medium">
            Back to all teams
          </Link>
          <div>
            {nextTeamId && (
              <Link to={`/teams/${nextTeamId}`} className="text-red-600 hover:underline font-medium">
                Next Team &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamPage;
