import { useEffect, useState } from 'react';
import { getCurrentDrivers, placeholderImage } from '../api/f1Api';
import CardDrivers from '../components/CardDrivers';

export default function DriversCurrent() {
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCurrentDrivers(50);
        if (cancelled) return;
        setDrivers(data.map(d => ({
          id: d.driverId,
            firstName: d.name,
            lastName: d.surname,
            driverNumber: d.number ?? '-',
            image: placeholderImage((d.name?.[0]||'') + (d.surname?.[0]||''))
        })));
      } catch (e) { console.error(e); }
    })();
    return () => { cancelled = true; };
  }, []);
  return (
    <section className="bg-gray-100/50 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6">Current Season Drivers</h2>
        <CardDrivers drivers={drivers} />
      </div>
    </section>
  );
}
