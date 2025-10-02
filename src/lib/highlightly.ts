import "server-only";

const API_KEY = process.env.HIGHLIGHTLY_API_KEY;

if (!API_KEY) {
  throw new Error("HIGHLIGHTLY_API_KEY is not set in environment variables.");
}

function getHostForSport(sport: string): string {
  switch (sport) {
    case "Soccer":
      return "football-highlights-api.p.rapidapi.com";
    case "Basketball":
      return "basketball-highlights-api.p.rapidapi.com";
    case "Tennis":
      return "sport-highlights-api.p.rapidapi.com";
    default:
      return "sport-highlights-api.p.rapidapi.com";
  }
}

async function fetchFromHighlightly<T>(sport: string, endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  const host = getHostForSport(sport);
  const url = new URL(`https://${host}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": host,
      "x-rapidapi-key": API_KEY,
    },
    next: { revalidate: 3600 },
  };

  try {
    const res = await fetch(url.toString(), options);
    if (!res.ok) {
      console.error(`Highlightly API Error: ${res.status} - ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch from Highlightly:`, error);
    return null;
  }
}

export interface Highlight {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  date: string;
}

export async function getHighlights(sport: string, leagueId: string, season: string): Promise<Highlight[]> {
  const [startYear, endYear] = season.split("-");
  const params = {
    leagueId,
    fromDate: `${startYear || '2023'}-01-01`,
    toDate: `${endYear || startYear || '2024'}-12-31`,
    limit: "5",
  };
  const data = await fetchFromHighlightly<{ data: Highlight[] }>(sport, "/highlights", params);
  return data?.data || [];
}