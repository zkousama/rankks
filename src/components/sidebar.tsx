import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllLeagues, LeagueAPI } from "@/lib/thesportsdb";

const POPULAR_LEAGUE_IDS: { [key: string]: string[] } = {
  Soccer: ["4328", "4480", "4335", "4332", "4331", "4346", "4334"],
  Basketball: ["4387", "4463"],
  Tennis: ["4385", "4449"],
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
    .filter(
      (league) =>
        league.strSport === sportName &&
        popularLeagueIdsForSport.includes(league.idLeague)
    )
    .sort(
      (a, b) =>
        popularLeagueIdsForSport.indexOf(a.idLeague) -
        popularLeagueIdsForSport.indexOf(b.idLeague)
    );

  const displayName = sportName === "Soccer" ? "Football" : sportName;

  return (
    <aside className="w-56 bg-sidebar text-sidebar-foreground p-4 flex flex-col shrink-0 border-r border-border">
      <h2 className="text-lg font-bold mb-4 text-sidebar-foreground">
        {displayName}
      </h2>
      <nav>
        <ul className="flex flex-col gap-1">
          {popularLeagues.map((league: LeagueAPI) => {
            const defaultSeason = sportName === "Soccer" ? "2023-2024" : "2024";
            return (
              <li key={league.idLeague}>
                <Link
                  href={`/view/${sportName}/${league.idLeague}/${defaultSeason}/standings`}
                  className={cn(
                    "block p-2 text-sm font-medium transition-colors hover:bg-black/5",
                    currentLeagueId === league.idLeague
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                      : ""
                  )}
                >
                  {league.strLeague}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
