import { F1 } from '@f1api/sdk';

const f1 = new F1();

export const getTeams = async () => {
  try {
    const response = await f1.getTeams();
    return response.teams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
};

export const getDrivers = async () => {
  try {
    const response = await f1.getDrivers();
    return response.drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
};

export const getRaces = async () => {
    try {
        const response = await f1.getSchedule({ year: new Date().getFullYear() });
        return response.races;
    } catch (error) {
        console.error('Error fetching races:', error);
        return [];
    }
};
