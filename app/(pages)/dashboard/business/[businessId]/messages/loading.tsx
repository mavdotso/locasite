import { Card } from "@/app/components/ui/card";

export default function Loading() {
  return (
    <div className="container p-8 mx-auto">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-muted rounded w-32 animate-pulse" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-9 bg-muted rounded w-64 animate-pulse" />
        <div className="h-4 bg-muted rounded w-80 animate-pulse" />
      </div>

      {/* Messages header card skeleton */}
      <Card className="mb-4 p-6">
        <div className="animate-pulse space-y-2">
          <div className="h-6 bg-muted rounded w-56" />
          <div className="h-4 bg-muted rounded w-72" />
        </div>
      </Card>

      {/* Message row skeletons */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse flex items-start gap-4">
              {/* Avatar placeholder */}
              <div className="h-10 w-10 bg-muted rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-36" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
                <div className="h-4 bg-muted rounded w-48" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
