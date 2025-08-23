function CardRaces({ races }) {
  return (
    <>
      {races.map((race, index) => (
        <li key={race.raceId} className="p-4 sm:p-5 hover:bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="text-red-600 font-bold text-lg w-8 text-center self-start sm:self-auto">{index + 1}</div>
            <div className="flex-grow">
              <p className="text-base sm:text-lg font-semibold text-gray-800">{race.raceName}</p>
              <p className="text-sm text-gray-500">{race.circuitName}</p>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <p className="text-sm sm:text-base font-medium text-gray-900">{new Date(race.raceDateTime).toLocaleDateString()}</p>
            </div>
          </div>
        </li>
      ))}
    </>
  );
}

export default CardRaces;