import StandingsTable from "@/components/standings-table";
import Sidebar from "@/components/sidebar";
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

  // Prepare country info for ContentNav
  const countryName = leagueDetails?.strCountry || '';
  let countryCode = countryName.slice(0, 2).toLowerCase();
  if (countryName === "England") countryCode = "gb-eng";
  if (countryName === "United Kingdom") countryCode = "gb";

  const renderContent = () => {
    switch (contentType) {
      case "standings":
        return <StandingsTable standings={currentStandings ?? []} />;
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
    <>
      {/* Year selector navigation - spans full width above sidebar and content */}
      <SubNav sportName={sportName} leagueId={leagueId} season={season} />
      
      {/* Sidebar + Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <Sidebar sportName={sportName} currentLeagueId={leagueId} />
        
        {/* Main content area on the right */}
        <main className="flex flex-col flex-1 overflow-hidden">
          {/* Content tabs with region/flag */}
          <ContentNav
            basePath={`/view/${sportName}/${leagueId}/${season}`}
            currentContentType={contentType}
            countryName={countryName}
            countryCode={countryCode}
          />
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <ContentHeader
                league={leagueDetails}
                season={season}
                winner={winner}
                participations={stats.participations}
                titles={stats.titles}
              />

              {/* Main content body */}
              <div className="bg-card shadow-sm">{renderContent()}</div>

              <HighlightsSection highlights={highlights ?? []} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}