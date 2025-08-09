import { Link } from 'react-router-dom';

function CardTeams({ teams }) {
  return (
    <>
      {teams.map((team) => (
        <Link
          key={team.id}
          to={`/teams/${team.id}`}
          className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 transform transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 block"
        >
          <div style={{ borderTop: `6px solid ${team.color}` }}>
            <div className="p-6 flex flex-col items-center gap-3">
              <img
                src={team.logo}
                alt={`${team.name} Logo`}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2 rounded-full shadow"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/100x100/cccccc/000000?text=Error';
                }}
              />
              <h3 className="text-base sm:text-lg font-bold text-center" style={{ color: team.color }}>
                {team.name}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export default CardTeams;