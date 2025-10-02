import { getLeagueDetails, getSeasonsByLeagueId } from "@/lib/thesportsdb";
import YearSelector from "./year-selector";
import Image from "next/image";

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
    const [seasons, leagueDetails] = await Promise.all([
      getSeasonsByLeagueId(leagueId),
      getLeagueDetails(leagueId),
    ]);
    const countryName = leagueDetails?.strCountry || 'Unknown';
    let countryCode = countryName.slice(0, 2).toLowerCase();
    if (countryName === "England") countryCode = "gb-eng";
    if (countryName === "United Kingdom") countryCode = "gb";
    const basePath = `/view/${sportName}/${leagueId}`;
    return (
      <div className="border-b border-border bg-card h-12 flex items-center justify-between px-4">
        <YearSelector
          seasons={seasons || []}
          basePath={basePath}
          currentSeason={season}
        />
        {countryName && (
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground shrink-0 ml-4">
            <span>{countryName}</span>
            <Image 
              src={`https://flagcdn.com/w40/${countryCode}.png`} 
              width={40} 
              height={25} 
              alt={countryName} 
              className="rounded" 
            />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("SubNav error:", error);
    return (
      <div className="h-12 flex items-center justify-center text-destructive text-sm">Error loading nav</div>
    );
  }
}