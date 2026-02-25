import { Card } from "@/app/components/ui/card";

export default function Loading() {
  return (
    <div className="container max-w-6xl py-8">
      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-9 bg-muted rounded w-64 animate-pulse" />
        <div className="h-4 bg-muted rounded w-80 animate-pulse" />
      </div>

      {/* Plans grid skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 flex flex-col">
            <div className="animate-pulse space-y-4">
              {/* Plan name */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded" />
                <div className="h-6 bg-muted rounded w-28" />
              </div>
              {/* Price */}
              <div className="h-9 bg-muted rounded w-24" />
              {/* Features list */}
              <div className="space-y-2 pt-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted rounded shrink-0" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
              {/* Limits section */}
              <div className="space-y-2 border-t pt-4">
                <div className="h-4 bg-muted rounded w-16" />
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-3 bg-muted rounded w-32" />
                ))}
              </div>
              {/* Button */}
              <div className="h-10 bg-muted rounded w-full mt-4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
