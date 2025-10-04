import { getSeasonsByLeagueId } from "@/lib/thesportsdb";
import YearSelector from "./year-selector";

export default async function SubNav({
  sportName,
  leagueId,
  season,
}: {
  sportName?: string;
  leagueId?: string;
  season?: string;
}) {
  if (!sportName || !leagueId || !season) {
    return null;
  }

  try {
    const seasons = await getSeasonsByLeagueId(leagueId);
    const basePath = `/view/${sportName}/${leagueId}`;
    
    return (
      <YearSelector
        seasons={seasons || []}
        basePath={basePath}
        currentSeason={season}
      />
    );
  } catch (error) {
    console.error("SubNav error:", error);
    return (
      <div className="h-12 flex items-center justify-center text-destructive text-sm bg-card border-b border-border">
        Error loading years
      </div>
    );
  }
}