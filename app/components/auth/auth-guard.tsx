"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  businessUserId?: string;
  requireOwnership?: boolean;
}

export default function AuthGuard({ children, businessUserId, requireOwnership = false }: AuthGuardProps) {
  const user = useQuery(api.auth.currentUser);

  // Loading state
  if (user === undefined) {
    return (
      <div className="container p-8 mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="container p-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to edit this business site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please log in to continue.</p>
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check ownership if required
  if (requireOwnership && businessUserId && businessUserId !== user._id) {
    return (
      <div className="container p-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to edit this business site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Only the owner of this business can edit its content.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
}