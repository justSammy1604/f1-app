import { useState, useEffect } from 'react';
import CardTeams from '../components/CardTeams';
import { getTeams } from '../api/f1Api';

function Teams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const apiTeams = await getTeams();
      // NOTE: The F1 API does not provide official colors or logos for teams.
      // We will use a placeholder for the logo and a default color.
      const teamsWithPlaceholders = apiTeams.map(team => ({
        ...team,
        id: team.teamId,
        logo: `https://placehold.co/100x100/cccccc/000000?text=${team.name.substring(0, 2).toUpperCase()}`,
        color: '#B6BABD' // Default color
      }));
      setTeams(teamsWithPlaceholders);
    };

    fetchTeams();
  }, []);

  return (
    <>
      <section className="bg-gray-100/50 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-8">Formula 1 Teams 2025</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            <CardTeams teams={teams} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Teams;