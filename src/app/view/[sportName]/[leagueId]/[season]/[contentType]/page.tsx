import StandingsTable from "@/components/standings-table";
import {
  getLeagueDetails,
  getStandings,
  getSeasonsByLeagueId,
  SeasonAPI,
} from "@/lib/thesportsdb";
import { getHighlights } from "@/lib/highlightly";
import ContentNav from "@/components/content-nav";
import ContentHeader from "@/components/content-header";
import HighlightsSection from "@/components/highlights-section";
import SubNav from "@/components/sub-nav";

interface LeaguePageProps {
  params: Promise<{
    sportName: string;
    leagueId: string;
    season: string;
    contentType: string;
  }>;
}

async function getTeamHistoricalStats(
  leagueId: string,
  seasons: SeasonAPI[],
  teamName: string
) {
  if (!teamName || seasons.length === 0)
    return { participations: 0, titles: 0 };

  const allSeasonStandings = await Promise.all(
    seasons.map((s) => getStandings(leagueId, s.strSeason))
  );

  let participations = 0,
    titles = 0;

  allSeasonStandings.forEach((standings) => {
    if (!standings || standings.length === 0) return;
    if (standings.some((st) => st.strTeam === teamName)) participations++;
    if (standings[0]?.strTeam === teamName && standings[0]?.intRank === "1")
      titles++;
  });

  return { participations, titles };
}

export default async function LeaguePage({
  params: paramsPromise,
}: LeaguePageProps) {
  const params = await paramsPromise;
  const { sportName, leagueId, season, contentType } = params;

  const [leagueDetails, currentStandings, allSeasons, highlights] =
    await Promise.all([
      getLeagueDetails(leagueId),
      getStandings(leagueId, season),
      getSeasonsByLeagueId(leagueId),
      getHighlights(sportName, leagueId, season),
    ]);

  if (!leagueDetails) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Could not load details for League ID: {leagueId}.
      </div>
    );
  }

  const winner = currentStandings?.find((s) => s.intRank === "1");
  const stats = winner
    ? await getTeamHistoricalStats(leagueId, allSeasons, winner.strTeam)
    : { participations: 0, titles: 0 };

  const renderContent = () => {
    switch (contentType) {
      case "standings":
        return <StandingsTable standings={currentStandings ?? []} />;
      // Other cases remain the same
      case "scorers":
        return (
          <div className="py-10 text-center text-muted-foreground">
            Scorers data is not available on the free plan.
          </div>
        );
      case "passers":
        return (
          <div className="py-10 text-center text-muted-foreground">
            Passers data is not available on the free plan.
          </div>
        );
      case "players":
        return (
          <div className="py-10 text-center text-muted-foreground">
            Players data coming soon!
          </div>
        );
      default:
        return (
          <div className="py-10 text-center text-destructive">
            Unknown content type: {contentType}
          </div>
        );
    }
  };

  return (
    // The components are now rendered inside the main scrollable area
    <div className="p-6">
      {/* Component order now matches the PRD */}
      <SubNav sportName={sportName} leagueId={leagueId} season={season} />
      <ContentNav
        basePath={`/view/${sportName}/${leagueId}/${season}`}
        currentContentType={contentType}
      />
      <ContentHeader
        league={leagueDetails}
        season={season}
        winner={winner}
        participations={stats.participations}
        titles={stats.titles}
      />

      {/* The main content body */}
      <div className="bg-card shadow-sm">{renderContent()}</div>

      <HighlightsSection highlights={highlights ?? []} />
    </div>
  );
}
