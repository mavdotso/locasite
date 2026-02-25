"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Building2 } from "lucide-react";
import { toast } from "sonner";

interface BusinessVerificationProps {
  businessId: Id<"businesses">;
}

export function BusinessVerification({
  businessId,
}: BusinessVerificationProps) {
  const business = useQuery(api.businesses.getById, { id: businessId });
  const claimBusiness = useMutation(api.businessClaims.claimBusiness);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectGoogle = async () => {
    try {
      setIsConnecting(true);
      // First create a claim
      const result = await claimBusiness({
        businessId,
        verificationMethod: "google",
      });

      if (result.requiresGoogleAuth) {
        // Redirect directly to the Convex HTTP endpoint
        window.location.href = `${process.env.NEXT_PUBLIC_CONVEX_URL}/auth/google-business?claimId=${result.claimId}`;
      }
    } catch (error) {
      console.error("Error connecting to Google Business Profile:", error);
      toast.error("Failed to connect to Google Business Profile");
    } finally {
      setIsConnecting(false);
    }
  };

  if (!business) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // googleBusinessAuth is stripped from getById for security.
  // Verification status is determined via business claims instead.
  const isConnected = false;
  const isVerified = false;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Verification
          </CardTitle>
          <CardDescription>
            Verify your ownership of {business.name} to unlock additional
            features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Google Business Profile</p>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge className="gap-1 bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Button
                  onClick={handleConnectGoogle}
                  disabled={isConnecting}
                  size="sm"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Verification Status */}
          {isConnected && (
            <>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Verification Status</h4>
                {isVerified ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Your business ownership has been verified
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your business is not yet verified. Select an account below
                      to verify ownership.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Google Business Accounts - populated after connecting */}
            </>
          )}

          {/* Benefits of Verification */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Benefits of Verification</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Sync your business information directly from Google</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Manage reviews and respond to customers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Access analytics and insights</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Update business hours and information in real-time</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Verification Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Alternative Verification Methods</CardTitle>
          <CardDescription>
            If you can&apos;t verify through Google Business Profile, try these
            alternatives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" disabled>
            <AlertCircle className="mr-2 h-4 w-4" />
            Email Verification (Coming Soon)
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <AlertCircle className="mr-2 h-4 w-4" />
            Phone Verification (Coming Soon)
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <AlertCircle className="mr-2 h-4 w-4" />
            Document Upload (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
