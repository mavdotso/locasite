import { Suspense } from 'react';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import DashboardOverview from '@/app/components/dashboard/dashboard-overview';
import { Card } from '@/app/components/ui/card';

export default async function DashboardPage() {
  // Pre-fetch dashboard data for better performance
  let dashboardData = null;
  
  try {
    // In a real app, you'd check auth here and pass user ID
    // For now, we'll handle auth checks in the component
    dashboardData = await Promise.resolve(null); // Placeholder for server-side data fetching
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here&apos;s an overview of your business websites.
        </p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      }>
        <DashboardOverview initialData={dashboardData} />
      </Suspense>
    </div>
  );
}