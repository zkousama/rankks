import { StandingAPI } from "@/lib/thesportsdb";
import { ChevronDown } from "lucide-react";
import TeamBadgeImage from "./team-badge-image";

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
            // --- THIS IS THE FIX ---
            // Simply use the badge URL provided by the API directly.
            // No more manipulation is needed.
            const badgeUrl = standing.strTeamBadge;

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
                    <TeamBadgeImage
                      src={badgeUrl} // Pass the correct, direct URL
                      alt={`${standing.strTeam} badge`}
                      initials={initials(standing.strTeam)}
                    />
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