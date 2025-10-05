import Link from "next/link";
import Image from "next/image";
import { getCurrentSeason } from "@/lib/utils";

const shortcuts = [
  { id: "premier-league", name: "Premier League", leagueId: "4328", sport: "Soccer", badge: "https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png" },
  { id: "champions-league", name: "Champions League", leagueId: "4480", sport: "Soccer", badge: "https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png" },
  { id: "la-liga", name: "La Liga", leagueId: "4335", sport: "Soccer", badge: "https://r2.thesportsdb.com/images/media/league/badge/ja4it51687628717.png" },
  { id: "serie-a", name: "Serie A", leagueId: "4332", sport: "Soccer", badge: "https://r2.thesportsdb.com/images/media/league/badge/67q3q21679951383.png" },
  { id: "bundesliga", name: "Bundesliga", leagueId: "4331", sport: "Soccer", badge: "https://r2.thesportsdb.com/images/media/league/badge/teqh1b1679952008.png" },
  { id: "nba", name: "NBA", leagueId: "4387", sport: "Basketball", badge: "https://r2.thesportsdb.com/images/media/league/badge/frdjqy1536585083.png" },
  { id: "atp-tour", name: "ATP Tour", leagueId: "4385", sport: "Tennis", badge: "https://r2.thesportsdb.com/images/media/league/badge/x16ihc1546113079.png" },
];

export default function ShortcutNav({}: { currentPath?: string }) {
  return (
    <div className="bg-background border-b px-4 py-1 overflow-x-auto no-scrollbar h-12">
      <div className="flex items-center gap-3 min-w-max">
        {shortcuts.map((shortcut) => {
          const currentSeason = getCurrentSeason(shortcut.sport as 'Soccer' | 'Basketball' | 'Tennis');
          const href = `/view/${shortcut.sport}/${shortcut.leagueId}/${currentSeason}/standings`;
          
          return (
            <Link
              key={shortcut.id}
              href={href}
              className="flex items-center"
            >
              <Image
                src={shortcut.badge}
                alt={shortcut.name}
                width={36}
                height={36}
                className="object-contain"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}