import { Card } from "@/app/components/ui/card";

export default function Loading() {
  return (
    <div className="container max-w-6xl p-8 mx-auto">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-muted rounded w-32 animate-pulse" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-9 bg-muted rounded w-64 animate-pulse" />
        <div className="h-4 bg-muted rounded w-48 animate-pulse" />
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <div className="grid w-full grid-cols-5 gap-1 bg-muted rounded-lg p-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 bg-muted rounded animate-pulse"
            />
          ))}
        </div>

        {/* Overview cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-muted rounded" />
                  <div className="h-5 bg-muted rounded w-32" />
                </div>
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-9 bg-muted rounded w-full mt-4" />
              </div>
            </Card>
          ))}
        </div>

        {/* Business info card skeleton */}
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-64" />
            <div className="grid gap-4 md:grid-cols-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-40" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
