'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Loader, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export default function ClaimsPage() {
  const claims = useQuery(api.businessClaims.getClaimsByUser);
  const cancelClaim = useMutation(api.businessClaims.cancelClaim);

  const handleCancelClaim = async (claimId: Id<"businessClaims">) => {
    try {
      await cancelClaim({ claimId });
    } catch (error) {
      console.error("Error cancelling claim:", error);
    }
  };

  if (claims === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const getStatusIcon = (status: string, googleVerificationStatus?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        if (googleVerificationStatus === "failed") {
          return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        }
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string, googleVerificationStatus?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        if (googleVerificationStatus === "failed") {
          return "bg-yellow-100 text-yellow-800";
        }
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-muted text-foreground";
    }
  };

  const getStatusText = (status: string, googleVerificationStatus?: string) => {
    if (status === "pending" && googleVerificationStatus === "failed") {
      return "Verification Failed";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Business Claims</h1>
          <p className="text-muted-foreground mt-2">
            Manage your business ownership claims and verification status.
          </p>
        </div>

        {claims.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No Claims Yet</h3>
                <p className="text-sm">You haven&apos;t submitted any business claims.</p>
              </div>
              <Button onClick={() => window.location.href = '/'}>
                Find Businesses to Claim
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {claims.map((claim) => (
              <Card key={claim._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(claim.status, claim.googleVerificationStatus)}
                        {claim.business?.name || "Unknown Business"}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {claim.business?.address}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(claim.status, claim.googleVerificationStatus)}>
                      {getStatusText(claim.status, claim.googleVerificationStatus)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Submitted:</span>
                        <span className="ml-2 text-muted-foreground">
                          {new Date(claim.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Verification Method:</span>
                        <span className="ml-2 text-muted-foreground">
                          {claim.verificationMethod ? 
                            claim.verificationMethod.charAt(0).toUpperCase() + claim.verificationMethod.slice(1) 
                            : 'Google Business Profile'
                          }
                        </span>
                      </div>
                      {claim.updatedAt && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-foreground">Last Updated:</span>
                          <span className="ml-2 text-muted-foreground">
                            {new Date(claim.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {claim.notes && (
                      <Alert>
                        <AlertDescription>
                          <strong>Notes:</strong> {claim.notes}
                        </AlertDescription>
                      </Alert>
                    )}

                    {claim.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        {claim.verificationMethod === "google" && claim.googleVerificationStatus === "pending" && (
                          <Button size="sm" variant="outline">
                            Complete Google Verification
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleCancelClaim(claim._id)}
                        >
                          Cancel Claim
                        </Button>
                      </div>
                    )}

                    {claim.status === "approved" && (
                      <div className="pt-2">
                        <Button size="sm" asChild>
                          <a href={`/business/${claim.businessId}`}>
                            Manage Business
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}