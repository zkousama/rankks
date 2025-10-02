import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllLeagues, LeagueAPI } from "@/lib/thesportsdb";

const POPULAR_LEAGUE_IDS: { [key: string]: string[] } = {
  Soccer: ["4328", "4335", "4332", "4331", "4346", "4480", "4334", "4344"],
  Basketball: ["4387", "4463"],
  Tennis: ["4385", "4449", "4446", "4445"],
};

export default async function Sidebar({
  sportName,
  currentLeagueId,
}: {
  sportName: string;
  currentLeagueId: string;
}) {
  const allLeagues = await getAllLeagues();
  const popularLeagueIdsForSport = POPULAR_LEAGUE_IDS[sportName] || [];
  const popularLeagues = allLeagues
    .filter((league) => league.strSport === sportName && popularLeagueIdsForSport.includes(league.idLeague))
    .sort((a, b) => popularLeagueIdsForSport.indexOf(a.idLeague) - popularLeagueIdsForSport.indexOf(b.idLeague));

  const displayName = sportName === "Soccer" ? "Football" : sportName;

  return (
    <aside className="w-48 bg-sidebar text-sidebar-foreground p-3 flex flex-col shrink-0 border-r border-border">
      <h2 className="text-base font-bold mb-3 text-sidebar-foreground">{displayName}</h2>
      {popularLeagues.length === 0 ? (
        <div className="text-sidebar-foreground/70 px-2 text-sm">
          Loading leagues...
        </div>
      ) : (
        <nav>
          <ul className="flex flex-col gap-1">
            {popularLeagues.map((league: LeagueAPI) => {
              const defaultSeason = sportName === "Soccer" ? "2023-2024" : "2024";
              return (
                <li key={league.idLeague}>
                  <Link
                    href={`/view/${sportName}/${league.idLeague}/${defaultSeason}/standings`}
                    className={cn(
                      "block p-2 rounded-none text-sm font-medium transition-colors",
                      currentLeagueId === league.idLeague ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/20"
                    )}
                  >
                    {league.strLeague}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </aside>
  );
}