"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/app/components/ui/card";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  loadingMessage?: string;
  useDashboardContext?: boolean;
}

export function AuthGuard({
  children,
  loadingMessage = "Loading...",
  useDashboardContext = false,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Always use direct query - dashboard provider will handle its own auth state
  const user = useQuery(api.auth.currentUser);
  const isLoading = user === undefined;

  useEffect(() => {
    if (user === null) {
      const redirectPath = pathname || window.location.pathname;
      router.push(`/sign-in?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, pathname, router]);

  // For dashboard context, don't show loading - let the dashboard provider handle it
  if (useDashboardContext && isLoading) {
    return <>{children}</>;
  }

  // Show loading state for non-dashboard contexts
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

  return <>{children}</>;
}
