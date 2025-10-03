import Sidebar from "@/components/sidebar";

interface ViewLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    sportName: string;
    leagueId: string;
  }>;
}

export default async function ViewLayout({
  children,
  params: paramsPromise,
}: ViewLayoutProps) {
  const params = await paramsPromise;
  const { sportName, leagueId } = params;

  return (
    // This flex container creates the main two-column layout
    <div className="flex flex-1 overflow-hidden">
      <Sidebar sportName={sportName} currentLeagueId={leagueId} />
      {/* This main element is the scrollable content area */}
      <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
