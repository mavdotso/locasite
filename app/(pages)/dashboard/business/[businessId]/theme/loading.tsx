export default function Loading() {
  return (
    <div className="container max-w-6xl p-8 mx-auto">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-muted rounded w-32 animate-pulse" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-9 bg-muted rounded w-72 animate-pulse" />
        <div className="h-4 bg-muted rounded w-56 animate-pulse" />
      </div>

      {/* Theme cards grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card overflow-hidden">
            {/* Preview area skeleton */}
            <div className="aspect-[4/3] bg-muted animate-pulse" />
            {/* Card footer skeleton */}
            <div className="p-4 space-y-2">
              <div className="h-5 bg-muted rounded w-32 animate-pulse" />
              <div className="h-4 bg-muted rounded w-48 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Skip button skeleton */}
      <div className="flex justify-center mt-8">
        <div className="h-9 bg-muted rounded w-32 animate-pulse" />
      </div>
    </div>
  );
}
