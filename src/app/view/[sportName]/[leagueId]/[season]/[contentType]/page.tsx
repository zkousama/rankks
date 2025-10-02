import StandingsTable from "@/components/standings-table";
import { getLeagueDetails, getStandings, getSeasonsByLeagueId, LeagueAPI, StandingAPI, SeasonAPI } from "@/lib/thesportsdb";
import { getHighlights, Highlight } from "@/lib/highlightly";
import Image from "next/image";
import ContentNav from "@/components/content-nav";

interface LeaguePageProps {
  params: Promise<{
    sportName: string;
    leagueId: string;
    season: string;
    contentType: string;
  }>;
}

async function getTeamStats(leagueId: string, seasons: SeasonAPI[], teamName: string) {
  const stats = await Promise.all(seasons.map(async (s) => {
    const standings = await getStandings(leagueId, s.strSeason);
    if (!standings || standings.length === 0) return { participated: false, won: false };
    const participated = standings.some((st) => st.strTeam === teamName);
    const won = standings[0]?.intRank === "1" && standings[0].strTeam === teamName;
    return { participated, won };
  }));
  const participations = stats.filter((s) => s.participated).length;
  const titles = stats.filter((s) => s.won).length;
  return { participations, titles };
}

async function ContentHeader({
  league,
  season,
  standings,
  participations,
  titles,
}: {
  league: LeagueAPI;
  season: string;
  standings: StandingAPI[];
  participations: number;
  titles: number;
}) {
  const winner = standings.find((s) => s.intRank === "1");
  const name = `${league.strLeague.toUpperCase()} ${season.split('-')[0]}`.trim();
  return (
    <div className="relative h-40 overflow-hidden mb-4">
      {league.strFanart1 ? (
        <Image
          src={league.strFanart1}
          alt={`${league.strLeague} background`}
          fill
          style={{ objectFit: "cover" }}
          className="z-0"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-primary/80 z-0" />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-primary/90 p-3 flex items-center justify-between text-white text-sm">
        <div className="flex items-center gap-3">
          {league.strBadge ? (
            <Image
              src={league.strBadge}
              alt={`${league.strLeague} logo`}
              width={32}
              height={32}
              className="rounded-none bg-transparent"
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center bg-accent text-accent-foreground font-bold text-lg">
              {league.strLeague?.split(" ").map((w) => w[0]).join("")}
            </div>
          )}
          <h1 className="text-lg font-bold uppercase">{name}</h1>
        </div>
        {winner ? (
          <div className="flex items-center gap-4">
            <span>Participations: {participations}</span>
            <span>Titles: {titles}</span>
            <div className="flex items-center gap-2">
              {winner.strTeamBadge ? (
                <Image
                  src={winner.strTeamBadge}
                  alt={`${winner.strTeam} badge`}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground">
                  {winner.strTeam?.split(" ").map((w) => w[0]).join("")}
                </div>
              )}
              <span className="font-bold">{winner.strTeam}</span>
            </div>
          </div>
        ) : (
          <div className="text-white/80 text-sm">No winner data available</div>
        )}
      </div>
    </div>
  );
}

function HighlightsSection({ highlights }: { highlights: Highlight[] }) {
  if (!highlights || highlights.length === 0) {
    return <p className="text-center text-muted-foreground py-6">No highlights available (API limit reached - try later).</p>;
  }
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Video Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlights.map((h) => (
          <div key={h.id} className="bg-card rounded-none p-2 shadow-none border border-border">
            <video src={h.videoUrl} controls className="w-full h-40 object-cover" />
            <p className="mt-2 text-sm font-medium truncate">{h.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function LeaguePage({ params: paramsPromise }: LeaguePageProps) {
  const params = await paramsPromise;
  const { sportName, leagueId, season, contentType } = params;

  const [leagueDetails, standings, highlights, seasons] = await Promise.all([
    getLeagueDetails(leagueId),
    getStandings(leagueId, season),
    getHighlights(sportName, leagueId, season),
    getSeasonsByLeagueId(leagueId),
  ]);

  if (!leagueDetails) {
    return <div className="text-center text-muted-foreground py-10">Could not load details for League ID: {leagueId}.</div>;
  }

  let participations = 0;
  let titles = 0;
  if (standings && standings.length > 0) {
    const winner = standings.find((s) => s.intRank === "1");
    if (winner) {
      ({ participations, titles } = await getTeamStats(leagueId, seasons, winner.strTeam));
    }
  }

  const isTwoLineSport = sportName === "Tennis";

  const renderContent = () => {
    switch (contentType) {
      case 'standings':
        if (!standings || standings.length === 0) {
          return (
            <div className="text-center text-muted-foreground py-10">
              <p>Standings are not available for this competition format.</p>
              <p className="text-sm">This may be a knockout tournament or an event-based competition.</p>
            </div>
          );
        }
        return <StandingsTable standingsAPI={standings} />;
      case 'scorers':
        return <div className="text-center text-muted-foreground py-10">Scorers data coming soon!</div>;
      case 'passers':
        return <div className="text-center text-muted-foreground py-10">Passers data coming soon!</div>;
      case 'players':
        return <div className="text-center text-muted-foreground py-10">Players data coming soon!</div>;
      default:
        return <div className="text-center text-muted-foreground py-10">Unknown content type: {contentType}</div>;
    }
  };

  return (
    <>
      <ContentHeader league={leagueDetails} season={season} standings={standings ?? []} participations={participations} titles={titles} />
      {isTwoLineSport && (
        <nav className="flex gap-3 mb-3 border-b-0">
          <button className="py-1 px-2 text-sm font-medium bg-accent text-accent-foreground">Indian Wells</button>
          <button className="py-1 px-2 text-sm font-medium text-muted-foreground hover:bg-muted">Miami</button>
          <button className="py-1 px-2 text-sm font-medium text-muted-foreground hover:bg-muted">Paris Bercy</button>
        </nav>
      )}
      <ContentNav basePath={`/view/${sportName}/${leagueId}/${season}`} />
      <div>
        {renderContent()}
      </div>
      <HighlightsSection highlights={highlights || []} />
    </>
  );
}