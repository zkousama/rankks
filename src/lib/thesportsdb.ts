import "server-only";
import { unstable_cache } from "next/cache";

// --- Configuration ---
const API_KEY = process.env.THESPORTSDB_API_KEY;
if (!API_KEY) {
  throw new Error(
    "THESPORTSDB_API_KEY is not set in the environment variables."
  );
}
// Correctly construct the base URL with your API key
const API_BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

// --- Cached Generic Fetcher ---
const fetchFromAPI = unstable_cache(
  async <T>(endpoint: string): Promise<T | null> => {
    const url = `${API_BASE_URL}/${endpoint}`;
    console.log(`Fetching: ${url}`);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `API Error for ${url}: ${res.status} ${res.statusText}`,
          errorText
        );
        return null;
      }
      const text = await res.text();
      if (!text || text === '""') return null;
      return JSON.parse(text);
    } catch (error) {
      console.error(`Failed to fetch or parse from API: ${url}`, error);
      return null;
    }
  },
  ["thesportsdb-api-cache"],
  { revalidate: 3600 }
);

export interface SportAPI {
  idSport: string;
  strSport: string;
}
export interface LeagueAPI {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strBadge: string;
  strFanart1?: string;
  strCountry?: string;
}

export interface StandingAPI {
  idStanding: string;
  intRank: string;
  idTeam: string;
  strTeam: string;
  strBadge?: string; // The actual property name from the API, now correctly typed.
  strTeamBadge?: string; // The consistent property name our app will use.
  intPlayed: string;
  intWin: string;
  intDraw: string;
  intLoss: string;
  intGoalsFor: string;
  intGoalsAgainst: string;
  intGoalDifference: string;
  intPoints: string;
}

export interface SeasonAPI {
  strSeason: string;
}
export interface TeamAPI {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
}

export async function getAllSports(): Promise<SportAPI[]> {
  const data = await fetchFromAPI<{ sports: SportAPI[] }>("all_sports.php");
  return data?.sports || [];
}

export async function getAllLeagues(): Promise<LeagueAPI[]> {
  const data = await fetchFromAPI<{ leagues: LeagueAPI[] }>("all_leagues.php");
  return data?.leagues || [];
}

export async function getLeagueDetails(
  leagueId: string
): Promise<LeagueAPI | null> {
  const data = await fetchFromAPI<{ leagues: LeagueAPI[] }>(
    `lookupleague.php?id=${leagueId}`
  );
  return data?.leagues?.[0] || null;
}

export async function getStandings(
  leagueId: string,
  season: string
): Promise<StandingAPI[] | null> {
  const data = await fetchFromAPI<{ table: StandingAPI[] }>(
    `lookuptable.php?l=${leagueId}&s=${season}`
  );

  if (!data?.table) return null;

  // Normalize the API's inconsistent property names right here.
  // This ensures the rest of the app gets clean, predictable data.
  return data.table.map((standing) => ({
    ...standing,
    // Create a consistent `strTeamBadge` property from the API's `strBadge`.
    strTeamBadge: standing.strBadge || standing.strTeamBadge,
  }));
}

export async function getSeasonsByLeagueId(
  leagueId: string
): Promise<SeasonAPI[]> {
  const data = await fetchFromAPI<{ seasons: SeasonAPI[] }>(
    `search_all_seasons.php?id=${leagueId}`
  );
  const seasons = data?.seasons || [];
  return seasons.sort((a, b) => b.strSeason.localeCompare(a.strSeason));
}

export async function getTeamDetails(teamId: string): Promise<TeamAPI | null> {
  const data = await fetchFromAPI<{ teams: TeamAPI[] }>(
    `lookupteam.php?id=${teamId}`
  );
  return data?.teams?.[0] || null;
}

export async function getTeamsByLeagueId(
  leagueId: string
): Promise<TeamAPI[] | null> {
  const data = await fetchFromAPI<{ teams: TeamAPI[] }>(
    `lookup_all_teams.php?id=${leagueId}`
  );
  return data?.teams || null;
}
