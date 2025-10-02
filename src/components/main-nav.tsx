import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllSports, SportAPI } from "@/lib/thesportsdb";

export default async function MainNav({ currentSportName }: { currentSportName?: string }) {
  const sports = await getAllSports();
  const filteredSports = sports.filter(s => ['Soccer', 'Tennis', 'Basketball'].includes(s.strSport));
  const defaultLeagueMap: { [key: string]: string } = {
    'Soccer': '4328',
    'Tennis': '4385',
    'Basketball': '4387',
  };
  return (
    <header className="bg-primary text-primary-foreground flex items-center h-16 px-4 shrink-0 border-b border-border">
      <Link href="/" className="text-xl font-bold tracking-tighter mr-6">RANKKS</Link>
      <nav className="flex items-center gap-4 text-sm font-medium h-full">
        {filteredSports.map((sport: SportAPI) => {
          const displayName = sport.strSport === 'Soccer' ? 'Football' : sport.strSport === 'Basketball' ? 'Basket-Ball' : 'Tennis';
          const defaultLeagueId = defaultLeagueMap[sport.strSport] || '4328';
          const defaultSeason = sport.strSport === 'Soccer' ? '2023-2024' : '2024';
          const isActive = sport.strSport === currentSportName;
          return (
            <Link
              key={sport.idSport}
              href={`/view/${sport.strSport}/${defaultLeagueId}/${defaultSeason}/standings`}
              className={cn(
                "flex items-center h-full px-3 transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-bold"
                  : "text-primary-foreground hover:bg-accent/20"
              )}
            >
              {displayName}
            </Link>
          )
        })}
      </nav>
    </header>
  );
}