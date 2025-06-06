import { Suspense } from 'react';
import DashboardNav from '@/app/components/dashboard/dashboard-nav';
import { Card } from '@/app/components/ui/card';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted">
      <DashboardNav />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <Card className="p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          </Card>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  );
}