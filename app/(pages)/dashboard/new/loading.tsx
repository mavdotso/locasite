export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-muted rounded w-40 animate-pulse" />
      </div>

      {/* Header skeleton */}
      <div className="text-center mb-8 space-y-2">
        <div className="h-9 bg-muted rounded w-48 mx-auto animate-pulse" />
        <div className="h-4 bg-muted rounded w-80 mx-auto animate-pulse" />
      </div>

      {/* URL input skeleton */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="h-12 bg-muted rounded-lg w-full animate-pulse" />
      </div>

      {/* Browser mockup skeleton */}
      <div className="max-w-6xl mx-auto">
        <div className="border rounded-lg overflow-hidden">
          {/* Browser chrome */}
          <div className="bg-muted/50 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-muted rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-muted rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="h-6 bg-muted rounded flex-1 mx-8 animate-pulse" />
          </div>
          {/* Page content area */}
          <div className="h-96 bg-muted/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
