import { Card } from "@/app/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-9 bg-muted rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-80 animate-pulse" />
      </div>

      {/* Current domain card skeleton */}
      <Card className="mb-8 p-6">
        <div className="animate-pulse space-y-4">
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-40" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-5 bg-muted rounded w-48" />
            </div>
            <div className="h-9 bg-muted rounded w-20" />
          </div>
        </div>
      </Card>

      {/* Add custom domain card skeleton */}
      <Card className="mb-8 p-6">
        <div className="animate-pulse space-y-4">
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-72" />
          </div>
          <div className="flex gap-4">
            <div className="h-10 bg-muted rounded flex-1" />
            <div className="h-10 bg-muted rounded w-32" />
          </div>
          <div className="h-3 bg-muted rounded w-64" />
        </div>
      </Card>
    </div>
  );
}
