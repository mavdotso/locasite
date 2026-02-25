export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section skeleton */}
      <div className="w-full bg-muted animate-pulse h-[60vh]" />

      {/* Content section skeleton */}
      <div className="max-w-6xl mx-auto w-full px-4 py-12 space-y-8">
        {/* Heading */}
        <div className="space-y-3 text-center">
          <div className="h-8 bg-muted rounded w-64 mx-auto animate-pulse" />
          <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
        </div>

        {/* Content blocks */}
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-40 bg-muted rounded animate-pulse" />
              <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
