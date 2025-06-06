import { Suspense } from 'react';
import MessagesManagement from '@/app/components/dashboard/messages-management';
import { Card } from '@/app/components/ui/card';

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Manage customer inquiries and contact form submissions from all your sites.
        </p>
      </div>

      <Suspense fallback={
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      }>
        <MessagesManagement />
      </Suspense>
    </div>
  );
}