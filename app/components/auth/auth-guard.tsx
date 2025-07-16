"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card } from "@/app/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  useAuthState,
  useCurrentUser,
} from "@/app/components/providers/dashboard-provider";

interface AuthGuardProps {
  children: React.ReactNode;
  loadingMessage?: string;
}

export function AuthGuard({
  children,
  loadingMessage = "Loading...",
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();
  const { isLoading } = useAuthState();

  useEffect(() => {
    // Only redirect if we've checked auth and user is definitely not authenticated
    if (user === null) {
      // Store the current path for redirect after login
      const redirectPath = pathname;
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
