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
    // The endpoint is now just the method, e.g., "all_sports.php"
    const url = `${API_BASE_URL}/${endpoint}`;
    console.log(`Fetching: ${url}`); // This will now show your real key in the server log
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
      if (!text) return null;
      // The API sometimes returns "" for no data, which is not valid JSON.
      if (text === '""') return null;
      return JSON.parse(text);
    } catch (error) {
      console.error(`Failed to fetch or parse from API: ${url}`, error);
      return null;
    }
  },
  ["thesportsdb-api-cache"],
  { revalidate: 3600 }
);

// --- Type Definitions (no changes here) ---
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
  strTeam: string;
  strTeamBadge: string;
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

// --- API Service Functions ---

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
  return data?.table || null;
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
