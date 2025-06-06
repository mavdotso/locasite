import { Suspense } from 'react';
import SiteCreationFlow from '@/app/components/dashboard/site-creation-flow';
import { Card } from '@/app/components/ui/card';

export default function NewSitePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Create New Site</h1>
        <p className="text-muted-foreground mt-2">
          Add a Google Maps business URL to generate a professional website.
        </p>
      </div>

      <Suspense fallback={
        <Card className="p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
            <div className="h-12 bg-muted rounded w-full mb-4"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </Card>
      }>
        <SiteCreationFlow />
      </Suspense>
    </div>
  );
}