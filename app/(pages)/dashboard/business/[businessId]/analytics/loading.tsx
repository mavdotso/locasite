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
        <div className="h-9 bg-muted rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-56 animate-pulse" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-8 bg-muted rounded w-16" />
            </div>
          </Card>
        ))}
      </div>

      {/* Chart skeleton */}
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-muted rounded w-40" />
          <div className="h-4 bg-muted rounded w-56" />
          {/* Simulated bar chart area */}
          <div className="flex items-end gap-2 h-48 pt-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-muted rounded-t animate-pulse"
                style={{ height: `${30 + Math.random() * 70}%` }}
              />
            ))}
          </div>
          {/* X-axis labels */}
          <div className="flex gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-3 bg-muted rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
