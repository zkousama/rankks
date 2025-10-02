import Sidebar from "@/components/sidebar";
import SubNav from "@/components/sub-nav";

interface ViewLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    sportName: string;
    leagueId: string;
    season: string;
    contentType: string;
  }>;
}

export default async function ViewLayout({ children, params: paramsPromise }: ViewLayoutProps) {
  const params = await paramsPromise;
  const { sportName, leagueId, season } = params;

  console.log('ViewLayout - Params:', { sportName, leagueId, season });

  return (
    <div className="flex h-full">
      <Sidebar
        sportName={sportName}
        currentLeagueId={leagueId}
      />
      <div className="flex flex-1 flex-col">
        <SubNav
          sportName={sportName}
          leagueId={leagueId}
          season={season}
        />
        <div className="p-6 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}