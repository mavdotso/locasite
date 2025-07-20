import { Suspense } from "react";
import DashboardNav from "@/app/components/dashboard/dashboard-nav";
import { Card } from "@/app/components/ui/card";
import { AuthRedirectHandler } from "@/app/components/auth/auth-redirect-handler";
import { DashboardProvider } from "@/app/components/providers/dashboard-provider";
import { AuthGuard } from "@/app/components/auth/auth-guard";
import UnifiedErrorBoundary from "@/app/components/common/unified-error-boundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <AuthGuard loadingMessage="Loading your dashboard...">
        <UnifiedErrorBoundary variant="dashboard">
          <div className="min-h-screen bg-muted">
            <AuthRedirectHandler />
            <DashboardNav />
            <main className="container mx-auto px-4 py-8">
              <Suspense
                fallback={
                  <Card className="p-8">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </div>
                  </Card>
                }
              >
                {children}
              </Suspense>
            </main>
          </div>
        </UnifiedErrorBoundary>
      </AuthGuard>
    </DashboardProvider>
  );
}
