import { Card } from "@/app/components/ui/card";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-32 animate-pulse" />
          <div className="h-4 bg-muted rounded w-64 animate-pulse" />
        </div>
        <div className="h-9 bg-muted rounded w-36 animate-pulse" />
      </div>

      {/* Business cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden p-0">
            {/* Image placeholder */}
            <div className="aspect-[16/9] bg-muted animate-pulse" />
            {/* Content */}
            <div className="px-5 pb-5 pt-4 space-y-3">
              <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-9 bg-muted rounded animate-pulse" />
                <div className="h-9 bg-muted rounded animate-pulse" />
                <div className="h-9 bg-muted rounded animate-pulse" />
                <div className="h-9 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-9 bg-muted rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
