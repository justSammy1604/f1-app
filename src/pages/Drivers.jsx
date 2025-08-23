import { useState, useEffect } from 'react';
import CardDrivers from '../components/CardDrivers';
import { getDrivers } from '../api/f1Api';

function Drivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const apiDrivers = await getDrivers();
      const driversWithPlaceholders = apiDrivers.map(driver => ({
        ...driver,
        id: driver.driverId,
        image: `https://placehold.co/100x100/cccccc/000000?text=${driver.firstName.substring(0, 1)}${driver.lastName.substring(0, 1)}`,
      }));
      setDrivers(driversWithPlaceholders);
    };

    fetchDrivers();
  }, []);

  return (
    <>
      <section className="bg-gray-100/50 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-8">Formula 1 Drivers 2025</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            <CardDrivers drivers={drivers} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Drivers;
