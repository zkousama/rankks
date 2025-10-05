import "server-only";
import { unstable_cache } from "next/cache";

// --- Configuration ---
const API_KEY = process.env.THESPORTSDB_API_KEY;
if (!API_KEY) {
  throw new Error(
    "THESPORTSDB_API_KEY is not set in the environment variables."
  );
}
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
  strBadge?: string;
  strTeamBadge?: string;
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

// Updated to fetch detailed league info with badges
export async function getAllLeagues(): Promise<LeagueAPI[]> {
  const data = await fetchFromAPI<{ leagues: LeagueAPI[] }>("all_leagues.php");
  if (!data?.leagues) return [];
  
  // Fetch detailed info for each league to get badges
  const leaguesWithDetails = await Promise.all(
    data.leagues.map(async (league) => {
      const detailedLeague = await getLeagueDetails(league.idLeague);
      return detailedLeague || league;
    })
  );
  
  return leaguesWithDetails;
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

  return data.table.map((standing) => ({
    ...standing,
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