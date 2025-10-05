interface BreadcrumbNavProps {
  leagueName: string;
  season: string;
  contentType: string;
}

export default function BreadcrumbNav({ leagueName, season, contentType }: BreadcrumbNavProps) {
  // Extract first year from season (e.g., "2023-2024" -> "2023")
  const year = season.split('-')[0];
  
  return (
    <div className="bg-muted/30 px-6 py-3 border-b border-border">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-semibold">{leagueName}</span>
        <span>/</span>
        <span>{year}</span>
        <span>/</span>
        <span className="capitalize">{contentType}</span>
      </div>
    </div>
  );
}