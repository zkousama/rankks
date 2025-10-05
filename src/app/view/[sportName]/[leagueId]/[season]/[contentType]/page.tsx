import StandingsTable from "@/components/standings-table";
import Sidebar from "@/components/sidebar";
import {
  getLeagueDetails,
  getStandings,
  getSeasonsByLeagueId,
  SeasonAPI,
  getTeamsByLeagueId,
  StandingAPI,
} from "@/lib/thesportsdb";
import ContentNav from "@/components/content-nav";
import ContentHeader from "@/components/content-header";
import SubNav from "@/components/sub-nav";
import BreadcrumbNav from "@/components/breadcrumb-nav";

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
  teamName:string
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

  const [
    leagueDetails,
    currentStandings,
    allSeasons,
    allTeamsInLeague,
  ] = await Promise.all([
    getLeagueDetails(leagueId),
    getStandings(leagueId, season),
    getSeasonsByLeagueId(leagueId),
    getTeamsByLeagueId(leagueId),
  ]);

  let enrichedStandings: StandingAPI[] | null = currentStandings;

  if (currentStandings && allTeamsInLeague) {
    const teamBadgeMap = new Map<string, string>();
    allTeamsInLeague.forEach(team => {
      if (team.idTeam && team.strTeamBadge) {
        teamBadgeMap.set(team.idTeam, team.strTeamBadge);
      }
    });

    enrichedStandings = currentStandings.map((standing): StandingAPI => {
      const badgeUrl = teamBadgeMap.get(standing.idTeam);
      if (badgeUrl) {
        return { ...standing, strTeamBadge: badgeUrl };
      }
      return standing;
    });
  }

  if (!leagueDetails) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Could not load details for League ID: {leagueId}.
      </div>
    );
  }

  const winner = enrichedStandings?.find((s) => s.intRank === "1");
  const stats = winner
    ? await getTeamHistoricalStats(leagueId, allSeasons, winner.strTeam)
    : { participations: 0, titles: 0 };

  const countryName = leagueDetails?.strCountry || '';
  let countryCode = countryName.slice(0, 2).toLowerCase();
  if (countryName === "England") countryCode = "gb-eng";
  if (countryName === "United Kingdom") countryCode = "gb";

  const renderContent = () => {
    switch (contentType) {
      case "standings":
        return <StandingsTable standings={enrichedStandings ?? []} />;
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
      <SubNav sportName={sportName} leagueId={leagueId} season={season} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar sportName={sportName} currentLeagueId={leagueId} />
        <main className="flex flex-col flex-1 overflow-hidden">
          <ContentNav
            basePath={`/view/${sportName}/${leagueId}/${season}`}
            currentContentType={contentType}
            countryName={countryName}
            countryCode={countryCode}
          />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <ContentHeader
                league={leagueDetails}
                season={season}
                winner={winner}
                participations={stats.participations}
                titles={stats.titles}
              />
              <BreadcrumbNav 
                leagueName={leagueDetails.strLeague}
                season={season}
                contentType={contentType}
              />
              <div className="bg-card shadow-sm">{renderContent()}</div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}