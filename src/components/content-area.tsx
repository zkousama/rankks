import StandingsTable from "@/components/standings-table";
import { StandingAPI } from "@/lib/thesportsdb";

interface ContentAreaProps {
  contentType: string;
  standings: StandingAPI[] | null;
}

export default function ContentArea({ contentType, standings }: ContentAreaProps) {
  const renderContent = () => {
    switch (contentType) {
      case "standings":
        return <StandingsTable standings={standings ?? []} />;
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

  return <div className="bg-card shadow-sm">{renderContent()}</div>;
}