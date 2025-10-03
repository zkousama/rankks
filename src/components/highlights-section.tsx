// File: src/components/highlights-section.tsx
import { Highlight } from "@/lib/highlightly";

export default function HighlightsSection({ highlights }: { highlights: Highlight[] }) {
  if (!highlights || highlights.length === 0) {
    return <p className="text-center text-muted-foreground py-8 text-sm">No recent video highlights found.</p>;
  }
  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4 px-4">Video Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlights.map((h) => (
          <div key={h.id} className="bg-card border border-border">
            <div className="aspect-video bg-black">
              <video src={h.videoUrl} controls className="w-full h-full object-cover" poster={h.thumbnail} />
            </div>
            <div className="p-3">
                <p className="text-sm font-semibold truncate leading-tight">{h.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(h.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}