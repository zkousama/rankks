export default function Home() {
  return (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tighter">Welcome to RANKKS</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Dedicated to sports results. Select a sport from the top to begin.
        </p> {/* Updated to match PRD homepage note */}
      </div>
    </div>
  );
}