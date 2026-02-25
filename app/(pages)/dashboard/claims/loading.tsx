import { Card } from "@/app/components/ui/card";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 bg-muted rounded w-32 animate-pulse" />
        <div className="h-4 bg-muted rounded w-72 animate-pulse" />
      </div>

      {/* Claim card skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-muted rounded w-48" />
                <div className="h-5 bg-muted rounded-full w-20" />
              </div>
              <div className="flex gap-6">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-4 bg-muted rounded w-28" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
