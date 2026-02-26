export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header skeleton */}
      <div className="sticky top-0 z-40 bg-stone-50/95 border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="h-5 bg-muted rounded w-14 animate-pulse" />
          <div className="h-5 bg-muted rounded w-40 animate-pulse" />
          <div className="w-14" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Preview frame skeleton */}
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <div className="h-[50vh] bg-muted animate-pulse" />
        </div>

        {/* Action bar skeleton */}
        <div className="space-y-5">
          <div className="h-12 bg-muted rounded-lg animate-pulse" />
          <div className="flex items-center justify-center gap-6">
            <div className="h-4 bg-muted rounded w-20 animate-pulse" />
            <div className="h-4 bg-muted rounded w-20 animate-pulse" />
          </div>
          <div className="text-center space-y-1.5 pt-2">
            <div className="h-3 bg-muted rounded w-28 mx-auto animate-pulse" />
            <div className="h-4 bg-muted rounded w-44 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
