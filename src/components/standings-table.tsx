import { StandingAPI } from "@/lib/thesportsdb";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

function initials(name?: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function StandingsTable({
  standings,
}: {
  standings: StandingAPI[];
}) {
  if (!standings || standings.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Standings are not available for this competition or season.
      </div>
    );
  }

  const tableHeaders = [
    "#",
    "Club",
    "P",
    "W",
    "D",
    "L",
    "GF",
    "GA",
    "GD",
    "Pts",
    "More",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/30">
          <tr className="text-left text-muted-foreground font-medium">
            {tableHeaders.map((header, i) => (
              <th
                key={header}
                className={`px-3 py-2 uppercase text-xs tracking-wider ${
                  i === 0 || i > 1 ? "text-center" : "text-left"
                } ${i === 1 ? "w-1/3" : "w-12"}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => {
            // Clean up the badge URL - remove /preview and /tiny if present
            let badgeUrl = standing.strTeamBadge;
            if (badgeUrl) {
              badgeUrl = badgeUrl
                .replace("/preview", "")
                .replace("/tiny", "");
            }

            return (
              <tr
                key={standing.idStanding}
                className="border-b border-border last:border-b-0 hover:bg-muted/30"
              >
                <td className="text-center font-medium px-3 py-2 text-muted-foreground">
                  {standing.intRank}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    {badgeUrl ? (
                      <Image
                        src={badgeUrl}
                        alt={`${standing.strTeam} badge`}
                        width={24}
                        height={24}
                        className="object-contain"
                        unoptimized
                        onError={(e) => {
                          // If image fails to load, hide it
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground rounded-sm">
                        {initials(standing.strTeam)}
                      </div>
                    )}
                    <span
                      className={`font-semibold ${
                        index === 0 ? "text-primary" : ""
                      }`}
                    >
                      {standing.strTeam}
                    </span>
                  </div>
                </td>
                <td className="text-center px-3 py-2">{standing.intPlayed}</td>
                <td className="text-center px-3 py-2">{standing.intWin}</td>
                <td className="text-center px-3 py-2">{standing.intDraw}</td>
                <td className="text-center px-3 py-2">{standing.intLoss}</td>
                <td className="text-center px-3 py-2">
                  {standing.intGoalsFor}
                </td>
                <td className="text-center px-3 py-2">
                  {standing.intGoalsAgainst}
                </td>
                <td className="text-center px-3 py-2">
                  {standing.intGoalDifference}
                </td>
                <td className="text-center font-bold px-3 py-2">
                  {standing.intPoints}
                </td>
                <td className="text-center px-3 py-2">
                  <button className="text-muted-foreground hover:text-accent">
                    <ChevronDown size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}