// File: src/components/content-header.tsx
import { LeagueAPI, StandingAPI } from "@/lib/thesportsdb";
import Image from "next/image";

interface ContentHeaderProps {
  league: LeagueAPI;
  season: string;
  winner?: StandingAPI;
  participations: number;
  titles: number;
}

export default function ContentHeader({ league, season, winner, participations, titles }: ContentHeaderProps) {
  const name = `${league.strLeague.toUpperCase()} ${season.replace('-', '/')}`;
  return (
    <div className="relative h-48 bg-muted mb-4 text-primary-foreground shadow-lg">
      <Image
        src={league.strFanart1 || '/default-bg.png'} // Add a fallback image in /public
        alt={`${league.strLeague} background`}
        fill
        style={{ objectFit: "cover" }}
        className="z-0 opacity-40"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/50 z-10" />
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {league.strBadge && (
            <Image
              src={league.strBadge}
              alt={`${league.strLeague} logo`}
              width={40}
              height={40}
              className="bg-white/20 p-1"
            />
          )}
          <h1 className="text-xl font-bold uppercase tracking-wide">{name}</h1>
        </div>
        
        {/* Conditionally render winner info */}
        {winner ? (
          <div className="flex items-center gap-6 text-sm">
            <div className="text-right">
              <div className="font-bold">{participations}</div>
              <div className="text-xs uppercase opacity-80">Participations</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{titles}</div>
              <div className="text-xs uppercase opacity-80">Titles</div>
            </div>
            <div className="flex items-center gap-2 font-bold">
              {winner.strTeamBadge && (
                <Image
                  src={winner.strTeamBadge}
                  alt={`${winner.strTeam} badge`}
                  width={32}
                  height={32}
                />
              )}
              <span>{winner.strTeam}</span>
            </div>
          </div>
        ) : (
            <div className="text-sm text-primary-foreground/80">No winner data for this format</div>
        )}
      </div>
    </div>
  );
}