"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Badge } from "@/app/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Mail,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VerificationStatusProps {
  businessId: Id<"businesses">;
}

export function VerificationStatus({ businessId }: VerificationStatusProps) {
  const router = useRouter();
  const publishingStatus = useQuery(
    api.businessPublishing.getPublishingStatus,
    { businessId },
  );
  const canPublish = useQuery(api.businessPublishing.canPublishBusiness, {
    businessId,
  });

  if (!publishingStatus || !canPublish) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    if (publishingStatus.canPublish) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (publishingStatus.claim?.status === "pending") {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
    if (publishingStatus.claim?.status === "rejected") {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  };

  const getStatusBadge = () => {
    if (publishingStatus.canPublish) {
      return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
    }
    if (publishingStatus.claim?.status === "pending") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          Pending Verification
        </Badge>
      );
    }
    if (publishingStatus.claim?.status === "rejected") {
      return (
        <Badge className="bg-red-100 text-red-800">Verification Failed</Badge>
      );
    }
    return <Badge variant="secondary">Not Verified</Badge>;
  };

  const handleStartVerification = () => {
    router.push(`/claim/${businessId}`);
  };

  const handleGoogleVerification = () => {
    if (publishingStatus.claim?.id) {
      window.location.href = `/api/auth/google-business/verify-ownership?businessId=${businessId}&claimId=${publishingStatus.claim.id}`;
    }
  };

  const handleEmailVerification = async () => {
    if (publishingStatus.claim?.id) {
      try {
        const response = await fetch("/api/verification/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId,
            claimId: publishingStatus.claim.id,
          }),
        });

        if (response.ok) {
          // Show success message
          alert("Verification email sent! Please check your business email.");
        } else {
          alert("Failed to send verification email. Please try again.");
        }
      } catch (error) {
        console.error("Error sending verification email:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Business Verification</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Verify your business ownership to publish your site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {publishingStatus.canPublish
                ? "Your business is verified"
                : canPublish.reason}
            </p>
            {publishingStatus.verificationCompletedAt && (
              <p className="text-sm text-muted-foreground mt-1">
                Verified on{" "}
                {new Date(
                  publishingStatus.verificationCompletedAt,
                ).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Publishing Status */}
        {publishingStatus.isPublished && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Site is Live</AlertTitle>
            <AlertDescription className="text-green-700">
              Your business site was published on{" "}
              {new Date(publishingStatus.publishedAt!).toLocaleDateString()}
            </AlertDescription>
          </Alert>
        )}

        {/* Verification Actions */}
        {!publishingStatus.canPublish && (
          <div className="space-y-3">
            {!publishingStatus.claim && (
              <Button onClick={handleStartVerification} className="w-full">
                Start Verification Process
              </Button>
            )}

            {publishingStatus.claim?.status === "pending" && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Complete verification:
                  </p>

                  {publishingStatus.claim.verificationMethod === "google" && (
                    <Button
                      onClick={handleGoogleVerification}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Verify with Google Business Profile
                    </Button>
                  )}

                  {publishingStatus.claim.verificationMethod === "email" && (
                    <Button
                      onClick={handleEmailVerification}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </Button>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Pending</AlertTitle>
                  <AlertDescription>
                    Your verification request was submitted on{" "}
                    {new Date(
                      publishingStatus.claim.createdAt,
                    ).toLocaleDateString()}
                    . Please complete the verification process to publish your
                    site.
                  </AlertDescription>
                </Alert>
              </>
            )}

            {publishingStatus.claim?.status === "rejected" && (
              <Alert className="bg-red-50 border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">
                  Verification Failed
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  Your verification was rejected. Please try again or contact
                  support.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Publishing Blocked */}
        {publishingStatus.publishingBlocked && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">
              Publishing Blocked
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              {publishingStatus.publishingBlockReason ||
                "Publishing is temporarily blocked for this business."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
