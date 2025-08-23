import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDriver, getDriverByYear, getCurrentDriver, placeholderImage } from '../api/f1Api';

export default function DriverDetail() {
  const { driverId, year } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let data;
        if (year && driverId) data = await getDriverByYear(year, driverId);
        else if (driverId && window.location.pathname.includes('/current/')) data = await getCurrentDriver(driverId);
        else data = await getDriver(driverId);
        if (cancelled) return;
        setDriver({
          id: data.driverId,
          firstName: data.name,
          lastName: data.surname,
          birthday: data.birthday,
          nationality: data.nationality,
          number: data.number,
          shortName: data.shortName,
          url: data.url,
          image: placeholderImage((data.name?.[0]||'') + (data.surname?.[0]||''))
        });
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [driverId, year]);
  if (loading) return <div className="p-8 text-center">Loading driver...</div>;
  if (!driver) return <div className="p-8 text-center">Driver not found.</div>;
  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <img src={driver.image} alt={driver.firstName + ' ' + driver.lastName} className="w-28 h-28 rounded-full mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{driver.firstName} {driver.lastName}</h1>
          <p className="text-gray-600 mb-4">#{driver.number ?? '—'} {driver.shortName ? `(${driver.shortName})` : ''}</p>
          <ul className="text-left space-y-1 text-sm text-gray-700">
            <li><strong>Birthday:</strong> {driver.birthday}</li>
            <li><strong>Nationality:</strong> {driver.nationality}</li>
            {driver.url && <li><strong>Wiki:</strong> <a href={driver.url} target="_blank" rel="noreferrer" className="text-red-600 underline">Profile</a></li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
