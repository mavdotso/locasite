import { Card } from "@/app/components/ui/card";

export default function Loading() {
  return (
    <div className="container p-8 mx-auto max-w-4xl">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-muted rounded w-32 animate-pulse" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-9 bg-muted rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-72 animate-pulse" />
      </div>

      {/* Tabs skeleton */}
      <div className="mb-6">
        <div className="grid w-full grid-cols-3 gap-1 bg-muted rounded-lg p-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Form card skeleton */}
      <Card className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-40" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>

          {/* Form fields */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
          ))}

          {/* Textarea field */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-28" />
            <div className="h-24 bg-muted rounded w-full" />
          </div>

          {/* Submit button */}
          <div className="h-10 bg-muted rounded w-32" />
        </div>
      </Card>
    </div>
  );
}
