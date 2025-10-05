/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import Sidebar from "@/components/sidebar";
import ContentNav from "@/components/content-nav";
import ContentHeader from "@/components/content-header";
import SubNav from "@/components/sub-nav";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import ContentArea from "@/components/content-area";
import ContentLoading from "@/components/content-loading";
import {
  getLeagueDetails,
  getStandings,
  getSeasonsByLeagueId,
  SeasonAPI,
  getTeamsByLeagueId,
  getAllLeagues,
} from "@/lib/thesportsdb";

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

export default async function LeaguePage({ params: paramsPromise }: LeaguePageProps) {
  const params = await paramsPromise;
  const { sportName, leagueId, season, contentType } = params;

  // Fetch only the data needed for the static parts (not content-dependent)
  const [leagueDetails, allSeasons, allTeamsInLeague, allLeagues] = await Promise.all([
    getLeagueDetails(leagueId),
    getSeasonsByLeagueId(leagueId),
    getTeamsByLeagueId(leagueId),
    getAllLeagues(),
  ]);

  if (!leagueDetails) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Could not load details for League ID: {leagueId}.
      </div>
    );
  }

  const countryName = leagueDetails?.strCountry || '';
  let countryCode = countryName.slice(0, 2).toLowerCase();
  if (countryName === "England") countryCode = "gb-eng";
  if (countryName === "United Kingdom") countryCode = "gb";

  return (
    <>
      <SubNav sportName={sportName} leagueId={leagueId} season={season} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar sportName={sportName} currentLeagueId={leagueId} leagues={allLeagues} />
        <main className="flex flex-col flex-1 overflow-hidden">
          <ContentNav
            basePath={`/view/${sportName}/${leagueId}/${season}`}
            currentContentType={contentType}
            countryName={countryName}
            countryCode={countryCode}
          />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Suspense fallback={<div className="mb-4">Loading header...</div>}>
                <ContentHeaderWrapper
                  leagueDetails={leagueDetails}
                  season={season}
                  leagueId={leagueId}
                  allSeasons={allSeasons}
                  allTeamsInLeague={allTeamsInLeague}
                />
              </Suspense>
              <BreadcrumbNav 
                leagueName={leagueDetails.strLeague}
                season={season}
                contentType={contentType}
              />
              <Suspense fallback={<ContentLoading />}>
                <ContentWrapper
                  contentType={contentType}
                  leagueId={leagueId}
                  season={season}
                />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Separate async component for content
async function ContentWrapper({
  contentType,
  leagueId,
  season,
}: {
  contentType: string;
  leagueId: string;
  season: string;
}) {
  const currentStandings = await getStandings(leagueId, season);
  
  // Enrich with badges
  const allTeamsInLeague = await getTeamsByLeagueId(leagueId);
  let enrichedStandings = currentStandings;

  if (currentStandings && allTeamsInLeague) {
    const teamBadgeMap = new Map<string, string>();
    allTeamsInLeague.forEach(team => {
      if (team.idTeam && team.strTeamBadge) {
        teamBadgeMap.set(team.idTeam, team.strTeamBadge);
      }
    });

    enrichedStandings = currentStandings.map((standing) => {
      const badgeUrl = teamBadgeMap.get(standing.idTeam);
      if (badgeUrl) {
        return { ...standing, strTeamBadge: badgeUrl };
      }
      return standing;
    });
  }

  return <ContentArea contentType={contentType} standings={enrichedStandings} />;
}

// Separate async component for header
async function ContentHeaderWrapper({
  leagueDetails,
  season,
  leagueId,
  allSeasons,
  allTeamsInLeague,
}: {
  leagueDetails: any;
  season: string;
  leagueId: string;
  allSeasons: SeasonAPI[];
  allTeamsInLeague: any;
}) {
  const currentStandings = await getStandings(leagueId, season);
  
  let enrichedStandings = currentStandings;
  if (currentStandings && allTeamsInLeague) {
    const teamBadgeMap = new Map<string, string>();
    allTeamsInLeague.forEach((team: any) => {
      if (team.idTeam && team.strTeamBadge) {
        teamBadgeMap.set(team.idTeam, team.strTeamBadge);
      }
    });

    enrichedStandings = currentStandings.map((standing) => {
      const badgeUrl = teamBadgeMap.get(standing.idTeam);
      if (badgeUrl) {
        return { ...standing, strTeamBadge: badgeUrl };
      }
      return standing;
    });
  }

  const winner = enrichedStandings?.find((s) => s.intRank === "1");
  const stats = winner
    ? await getTeamHistoricalStats(leagueId, allSeasons, winner.strTeam)
    : { participations: 0, titles: 0 };

  return (
    <ContentHeader
      league={leagueDetails}
      season={season}
      winner={winner}
      participations={stats.participations}
      titles={stats.titles}
    />
  );
}
