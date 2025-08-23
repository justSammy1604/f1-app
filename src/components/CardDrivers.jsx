function CardDrivers({ drivers }) {
  return (
    <>
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden text-left"
        >
          <div className="p-6 flex flex-col items-center gap-3">
            <img
              src={driver.image}
              alt={`${driver.firstName} ${driver.lastName}`}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2 rounded-full shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/100x100/cccccc/000000?text=Error';
              }}
            />
            <h3 className="text-base sm:text-lg font-bold text-center">
              {driver.firstName} {driver.lastName}
            </h3>
            <p className="text-sm text-gray-500">#{driver.driverNumber}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default CardDrivers;
