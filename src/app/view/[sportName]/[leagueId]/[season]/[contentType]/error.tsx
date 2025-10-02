'use client'; 

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong!</h2>
      <p className="mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Try again
      </button>
    </div>
  );
}