// Lightweight F1 API client using https://f1api.dev
// Provides convenience helpers the UI can consume.

const API_BASE = 'https://f1api.dev/api';

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`F1 API request failed ${res.status} ${res.statusText} for ${path}`);
  }
  return res.json();
}

export async function getDrivers(limit = 100, offset = 0) {
  const data = await fetchJson(`/drivers?limit=${limit}&offset=${offset}`);
  return data.drivers || [];
}

export async function searchDrivers(query, limit = 30, offset = 0) {
  if (!query) return { items: [], total: 0 };
  try {
    // API expects ?q=
    const data = await fetchJson(`/drivers/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    return { items: data.drivers || [], total: data.total ?? (data.drivers?.length || 0) };
  } catch {
    // Fallback attempt with legacy param if new one fails
    try {
      const data = await fetchJson(`/drivers/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
      return { items: data.drivers || [], total: data.total ?? (data.drivers?.length || 0) };
    } catch {
      return { items: [], total: 0 };
    }
  }
}

export async function getDriversByYear(year, limit = 100, offset = 0) {
  const data = await fetchJson(`/${year}/drivers?limit=${limit}&offset=${offset}`);
  return data.drivers || [];
}

export async function getCurrentDrivers(limit = 100, offset = 0) {
  try {
    const data = await fetchJson(`/current/drivers?limit=${limit}&offset=${offset}`);
    return data.drivers || [];
  } catch {
    return []; // fallback
  }
}

export async function getDriver(driverId) {
  const data = await fetchJson(`/drivers/${driverId}`);
  return data.driver || data; // shape unknown
}

export async function getDriverByYear(year, driverId) {
  const data = await fetchJson(`/${year}/drivers/${driverId}`);
  return data.driver || data;
}

export async function getCurrentDriver(driverId) {
  const data = await fetchJson(`/current/drivers/${driverId}`);
  return data.driver || data;
}

export async function getTeams(limit = 100, offset = 0) {
  const data = await fetchJson(`/teams?limit=${limit}&offset=${offset}`);
  return data.teams || [];
}

export async function searchTeams(query, limit = 30, offset = 0) {
  if (!query) return { items: [], total: 0 };
  try {
    const data = await fetchJson(`/teams/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    return { items: data.teams || [], total: data.total ?? (data.teams?.length || 0) };
  } catch {
    try {
      const data = await fetchJson(`/teams/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
      return { items: data.teams || [], total: data.total ?? (data.teams?.length || 0) };
    } catch {
      return { items: [], total: 0 };
    }
  }
}

export async function getTeamsByYear(year, limit = 100, offset = 0) {
  const data = await fetchJson(`/${year}/teams?limit=${limit}&offset=${offset}`);
  return data.teams || [];
}

export async function getCurrentTeams(limit = 100, offset = 0) {
  try {
    const data = await fetchJson(`/current/teams?limit=${limit}&offset=${offset}`);
    return data.teams || [];
  } catch {
    return [];
  }
}

export async function getTeam(teamId) {
  const data = await fetchJson(`/teams/${teamId}`);
  return data.team || data;
}

export async function getTeamByYear(year, teamId) {
  const data = await fetchJson(`/${year}/teams/${teamId}`);
  return data.team || data;
}

export async function getCurrentTeam(teamId) {
  const data = await fetchJson(`/current/teams/${teamId}`);
  return data.team || data;
}

export async function getTeamDriversCurrent(teamId) {
  const data = await fetchJson(`/current/teams/${teamId}/drivers`);
  return data.drivers || [];
}

export async function getTeamDriversByYear(year, teamId) {
  const data = await fetchJson(`/${year}/teams/${teamId}/drivers`);
  return data.drivers || [];
}

export async function getSeasons() {
  const data = await fetchJson('/seasons');
  return data.seasons || [];
}

export async function getRace(season, round) {
  const data = await fetchJson(`/${season}/${round}/race`);
  return data.races; // object with race info & results
}

// Attempt to discover all rounds for a season by incrementing until a 404 occurs
export async function getSeasonRaces(season, maxRounds = 35) {
  const races = [];
  for (let round = 1; round <= maxRounds; round++) {
    try {
      const race = await getRace(season, round);
      if (race && race.raceId) {
        races.push(race);
      } else {
        break; // unexpected shape, stop
      }
    } catch (e) {
      // Stop on first failure (likely round doesn't exist yet)
      break;
    }
  }
  return races;
}

// Utility: deterministic color from id (simple hash -> HSL)
export function colorFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h} 65% 45%)`;
}

export function placeholderImage(text) {
  const t = encodeURIComponent(text.toUpperCase());
  return `https://placehold.co/100x100/cccccc/000000?text=${t}`;
}

export function placeholderLogo(text, color) {
  const t = encodeURIComponent(text.toUpperCase());
  const bg = color.replace(/#/g, '');
  return `https://placehold.co/100x100/${bg}/FFFFFF?text=${t}`;
}
