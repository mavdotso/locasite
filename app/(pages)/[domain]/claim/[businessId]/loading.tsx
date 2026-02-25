import { Card } from "@/app/components/ui/card";

export default function Loading() {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <div className="p-6 space-y-2">
        <div className="h-7 bg-muted rounded w-64 animate-pulse" />
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Business details skeleton */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="h-5 bg-muted rounded w-32 animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                <div className="h-4 bg-muted rounded w-40 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Verification methods skeleton */}
        <div className="p-4 border rounded-lg space-y-3">
          <div className="h-5 bg-muted rounded w-48 animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <div className="h-5 w-5 bg-muted rounded-full shrink-0 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-40 animate-pulse" />
                <div className="h-3 bg-muted rounded w-56 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="h-10 bg-muted rounded w-full animate-pulse" />
      </div>
    </Card>
  );
}
