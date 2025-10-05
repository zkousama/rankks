import { LeagueAPI, StandingAPI } from "@/lib/thesportsdb";
import Image from "next/image";

interface ContentHeaderProps {
  league: LeagueAPI;
  season: string;
  winner?: StandingAPI;
  participations: number;
  titles: number;
}

export default function ContentHeader({
  league,
  season,
  winner,
  participations,
  titles,
}: ContentHeaderProps) {
  const year = season.includes("-") ? season.split("-")[0] : season;
  const name = `${league.strLeague.toUpperCase()} ${year}`;
  return (
    <div className="mb-4 shadow-lg overflow-hidden">
      {/* Top photo section */}
      <div className="relative h-82 text-primary-foreground">
        <Image
          src={league.strFanart1 || "/default-bg.png"}
          alt={`${league.strLeague} background`}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Bottom bar with info */}
      <div
        className="relative px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: "#C6B6D0" }}
      >
        <div className="flex items-center gap-3">
          {league.strBadge && (
            <Image
              src={league.strBadge}
              alt={`${league.strLeague} logo`}
              width={48}
              height={48}
              className="object-contain"
            />
          )}
          <h1
            className="text-base font-bold uppercase tracking-wider"
            style={{ color: "#3D0B3D" }}
          >
            {name}
          </h1>
        </div>

        {winner ? (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div
                className="text-xs uppercase tracking-wide font-bold"
                style={{ color: "#3D0B3D" }}
              >
                Participations
              </div>
              <div className="font-bold text-lg" style={{ color: "#3D0B3D" }}>
                {participations}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="text-xs uppercase tracking-wide font-bold"
                style={{ color: "#3D0B3D" }}
              >
                Titles
              </div>
              <div className="font-bold text-lg" style={{ color: "#3D0B3D" }}>
                {titles}
              </div>
            </div>
            <div
              className="flex items-center gap-3 font-bold text-lg"
              style={{ color: "#3D0B3D" }}
            >
              <span>{winner.strTeam}</span>
              {winner.strTeamBadge && (
                <Image
                  src={winner.strTeamBadge}
                  alt={`${winner.strTeam} badge`}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm" style={{ color: "#3D0B3D" }}>
            No winner data for this format
          </div>
        )}
      </div>
    </div>
  );
}
