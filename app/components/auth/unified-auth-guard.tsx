"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/app/components/ui/card";
import { Loader2 } from "lucide-react";
import { useDashboardData } from "@/app/components/providers/dashboard-provider";

interface UnifiedAuthGuardProps {
  children: React.ReactNode;
  loadingMessage?: string;
  useDashboardProvider?: boolean;
}

export function UnifiedAuthGuard({
  children,
  loadingMessage = "Loading...",
  useDashboardProvider = false,
}: UnifiedAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Use direct query for non-dashboard contexts
  const directUser = useQuery(api.auth.currentUser);

  // Always try to get dashboard context, but handle gracefully if not available
  let dashboardUser = undefined;
  let dashboardAuthState = undefined;
  let hasDashboardContext = false;

  try {
    const context = useDashboardData();
    dashboardUser = context.user;
    dashboardAuthState = { isLoading: context.isLoading };
    hasDashboardContext = true;
  } catch (error) {
    console.error("Dashboard context not available:", error);
    // Context not available, will use direct query
    hasDashboardContext = false;
  }

  // Use the appropriate user data
  const user =
    useDashboardProvider && hasDashboardContext ? dashboardUser : directUser;
  const isLoading =
    useDashboardProvider && hasDashboardContext
      ? dashboardAuthState?.isLoading
      : directUser === undefined;
  useEffect(() => {
    // Only redirect if we've checked auth and user is definitely not authenticated
    if (user === null) {
      // Store the current path for redirect after login
      const redirectPath = pathname || window.location.pathname;
      router.push(`/sign-in?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {loadingMessage}
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we verify your authentication status.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // If not authenticated after check, show loading while redirect happens
  if (user === null) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Redirecting to sign in...
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              You need to sign in to continue.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}

// Export convenience components for backward compatibility
export function AuthGuard({
  children,
  loadingMessage,
}: {
  children: React.ReactNode;
  loadingMessage?: string;
}) {
  return (
    <UnifiedAuthGuard
      useDashboardProvider={true}
      loadingMessage={loadingMessage}
    >
      {children}
    </UnifiedAuthGuard>
  );
}

export function SimpleAuthGuard({
  children,
  loadingMessage,
}: {
  children: React.ReactNode;
  loadingMessage?: string;
}) {
  return (
    <UnifiedAuthGuard
      useDashboardProvider={false}
      loadingMessage={loadingMessage}
    >
      {children}
    </UnifiedAuthGuard>
  );
}
