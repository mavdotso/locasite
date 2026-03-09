"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Loader2, Shield, CheckCircle, LogIn } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { trackClaimEvent } from "@/app/lib/claim-analytics";

interface ClaimFormProps {
  business: {
    _id: Id<"businesses">;
    name: string;
    address?: string;
    phone?: string;
    website?: string;
    userId?: Id<"users">;
  };
  isClaimable: boolean;
  hasPendingClaims: boolean;
  pendingClaimsCount: number;
  isAuthenticated: boolean;
  domain: string;
}

export function ClaimForm({
  business,
  isClaimable,
  hasPendingClaims,
  pendingClaimsCount,
  isAuthenticated,
  domain,
}: ClaimFormProps) {
  const router = useRouter();
  const claimBusiness = useMutation(api.businessClaims.claimBusiness);
  const [isClaiming, setIsClaiming] = useState(false);

  const alreadyClaimed = business.userId !== undefined;

  // Track claim page view
  useEffect(() => {
    trackClaimEvent("page_view", "claim_page", business._id);
  }, [business._id]);

  const handleClaim = async () => {
    trackClaimEvent("claim", "claim_initiated", business._id);
    setIsClaiming(true);

    try {
      await claimBusiness({
        businessId: business._id,
        verificationMethod: "google",
      });

      trackClaimEvent("conversion", "claim_completed", business._id);
      toast.success(
        "Business claimed! Taking you to your dashboard...",
      );

      router.push(`/dashboard/business/${business._id}/theme`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to claim business";
      toast.error(message);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Claim Business: {business.name}</CardTitle>
        <CardDescription>
          Claiming this business will allow you to manage its information,
          respond to customer messages, and customize your site.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-foreground mb-2">
              Business Details
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-16 text-muted-foreground">Name:</span>
                <span className="font-medium">{business.name}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-16 text-muted-foreground">Address:</span>
                <span>{business.address}</span>
              </p>
              {business.phone && (
                <p className="flex items-center gap-2">
                  <span className="w-16 text-muted-foreground">Phone:</span>
                  <span>{business.phone}</span>
                </p>
              )}
              {business.website && (
                <p className="flex items-center gap-2">
                  <span className="w-16 text-muted-foreground">Website:</span>
                  <span>{business.website}</span>
                </p>
              )}
            </div>
          </div>

          {!alreadyClaimed && isClaimable && !isAuthenticated && (
            <Alert className="bg-muted border-border">
              <LogIn className="h-4 w-4" />
              <AlertTitle>Sign In Required</AlertTitle>
              <AlertDescription>
                You need to sign in to claim this business. After signing in,
                you&rsquo;ll be able to verify ownership and manage your
                business listing.
              </AlertDescription>
            </Alert>
          )}

          {!alreadyClaimed && isClaimable && isAuthenticated && (
            <div className="p-4 border border-border bg-muted rounded-lg">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Verification
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-background rounded border">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Google Business Profile
                    </p>
                    <p className="text-muted-foreground">
                      Verify ownership through your Google Business Profile
                      account
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {alreadyClaimed && (
            <Alert className="bg-muted border-border">
              <AlertTitle>Already Claimed</AlertTitle>
              <AlertDescription>
                This business has already been claimed. If you believe this is
                an error, please contact support.
              </AlertDescription>
            </Alert>
          )}

          {!alreadyClaimed && !isClaimable && hasPendingClaims && (
            <Alert className="bg-muted border-border">
              <AlertTitle>Pending Claims</AlertTitle>
              <AlertDescription>
                There are currently {pendingClaimsCount} pending claims for
                this business.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {!alreadyClaimed && isClaimable && !isAuthenticated && (
          <Link
            href={`/sign-in?redirect=${encodeURIComponent(`/${domain}/claim/${business._id}`)}`}
            className="w-full"
          >
            <Button className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Claim This Business
            </Button>
          </Link>
        )}

        {!alreadyClaimed && isClaimable && isAuthenticated && (
          <Button
            onClick={handleClaim}
            disabled={isClaiming}
            className="w-full"
          >
            {isClaiming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : (
              "Claim This Business with Google"
            )}
          </Button>
        )}

        {(!isClaimable || alreadyClaimed) && (
          <Link href={`/${domain}`} className="w-full">
            <Button variant="outline" className="w-full">
              Return to Business Page
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
