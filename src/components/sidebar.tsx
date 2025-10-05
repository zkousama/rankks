'use client';

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LeagueAPI } from "@/lib/thesportsdb";
import { getCurrentSeason } from "@/lib/utils";

const POPULAR_LEAGUE_IDS: { [key: string]: string[] } = {
  Soccer: ["4328", "4480", "4335", "4332", "4331", "4346", "4334"],
  Basketball: ["4387", "4463"],
  Tennis: ["4385", "4449"],
};

const LEAGUE_BADGES: { [key: string]: string } = {
  "4328": "https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png",
  "4480": "https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png",
  "4335": "https://r2.thesportsdb.com/images/media/league/badge/ja4it51687628717.png",
  "4332": "https://r2.thesportsdb.com/images/media/league/badge/67q3q21679951383.png",
  "4331": "https://r2.thesportsdb.com/images/media/league/badge/teqh1b1679952008.png",
  "4334": "https://r2.thesportsdb.com/images/media/league/badge/9f7z9d1742983155.png",
  "4387": "https://r2.thesportsdb.com/images/media/league/badge/frdjqy1536585083.png",
  "4463": "https://r2.thesportsdb.com/images/media/league/badge/w8bial1517660134.png",
  "4385": "https://r2.thesportsdb.com/images/media/league/badge/x16ihc1546113079.png",
  "4449": "https://r2.thesportsdb.com/images/media/league/badge/nuegdl1519037397.png",
};

export default function Sidebar({
  sportName,
  currentLeagueId,
  leagues,
}: {
  sportName: string;
  currentLeagueId: string;
  leagues: LeagueAPI[];
}) {
  const popularLeagueIdsForSport = POPULAR_LEAGUE_IDS[sportName] || [];

  const popularLeagues = leagues
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
    <aside className="w-56 bg-white flex flex-col shrink-0 border-r border-border">
      <div
        className="px-4 flex items-center"
        style={{ backgroundColor: "#8a74a1", height: "57px" }}
      >
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">
          {displayName}
        </h2>
      </div>
      <nav className="p-4">
        <ul className="flex flex-col gap-1">
          {popularLeagues.map((league: LeagueAPI) => {
            const defaultSeason = getCurrentSeason(sportName as 'Soccer' | 'Basketball' | 'Tennis');
            const isActive = currentLeagueId === league.idLeague;

            return (
              <li key={league.idLeague}>
                <Link
                  href={`/view/${sportName}/${league.idLeague}/${defaultSeason}/standings`}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors relative flex items-center gap-2",
                    isActive
                      ? "text-white font-bold"
                      : "text-[#2E2E2E] hover:text-[#2E2E2E]"
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: "#ED4E9D",
                          clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%)",
                        }
                      : {
                          clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#F5F5F5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {LEAGUE_BADGES[league.idLeague] ? (
                    <Image
                      src={LEAGUE_BADGES[league.idLeague]}
                      alt={`${league.strLeague} badge`}
                      width={20}
                      height={20}
                      className="object-contain shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-5 h-5 shrink-0" />
                  )}
                  <span className="truncate">
                    {league.strLeague
                      .replace(/^English\s+/i, "")
                      .replace(/^Spanish\s+/i, "")
                      .replace(/^Italian\s+/i, "")
                      .replace(/^German\s+/i, "")
                      .replace(/^French\s+/i, "")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}