// src/components/standings-table.tsx
import { StandingAPI } from "@/lib/thesportsdb";
import Image from "next/image";

function initials(name?: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function StandingsTable({ standingsAPI }: { standingsAPI: StandingAPI[] }) {
  if (!standingsAPI || standingsAPI.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No standings data available for this season.</p>;
  }
  return (
    <div className="border-0 rounded-none overflow-hidden bg-transparent"> {/* No border/round for PRD */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-muted/50"> {/* Lighter header */}
            <tr className="[&_th]:px-3 [&_th]:py-2 [&_th]:font-medium [&_th]:text-left text-muted-foreground">
              <th className="w-8 text-center">#</th>
              <th className="w-1/3">club</th>
              <th className="text-center w-10">p</th>
              <th className="text-center w-10">w</th>
              <th className="text-center w-10">d</th>
              <th className="text-center w-10">l</th>
              <th className="text-center w-10">gf</th>
              <th className="text-center w-10">ga</th>
              <th className="text-center w-10">gd</th>
              <th className="text-center w-12">pts</th>
              <th className="text-center w-16">more</th> {/* Added "More" column per PRD */}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {standingsAPI.map((standing) => {
              const isTop = standing.intRank === "1";
              return (
                <tr
                  key={standing.idStanding}
                  className={`[&_td]:px-3 [&_td]:py-2 hover:bg-muted/20 ${isTop ? "font-bold" : ""}`}
                >
                  <td className="text-center text-muted-foreground">{standing.intRank}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {standing.strTeamBadge ? (
                        <Image
                          src={standing.strTeamBadge}
                          alt={standing.strTeam}
                          width={24}
                          height={24}
                          className="rounded-none"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-muted flex items-center justify-center text-xs font-medium">
                          {initials(standing.strTeam)}
                        </div>
                      )}
                      <span className="truncate">{standing.strTeam}</span>
                    </div>
                  </td>
                  <td className="text-center">{standing.intPlayed}</td>
                  <td className="text-center">{standing.intWin}</td>
                  <td className="text-center">{standing.intDraw}</td>
                  <td className="text-center">{standing.intLoss}</td>
                  <td className="text-center">{standing.intGoalsFor}</td>
                  <td className="text-center">{standing.intGoalsAgainst}</td>
                  <td className="text-center">{standing.intGoalDifference}</td>
                  <td className="text-center font-bold">{standing.intPoints}</td>
                  <td className="text-center text-accent cursor-pointer">v</td> {/* More dropdown placeholder */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}