"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { FileText } from "lucide-react";

function statusVariant(status: string) {
  switch (status) {
    case "approved":
      return "default" as const;
    case "rejected":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

export default function ClaimsPage() {
  const claims = useQuery(api.businessClaims.getByUser);

  if (claims === undefined) {
    return null; // Let the Suspense boundary in the layout handle loading
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Claims</h1>
        <p className="text-muted-foreground mt-1">
          Track the status of your business ownership claims.
        </p>
      </div>

      {claims.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No claims yet
          </h2>
          <p className="text-muted-foreground">
            When you claim a business listing, it will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim._id}>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {claim.businessName}
                  </CardTitle>
                  <Badge variant={statusVariant(claim.status)}>
                    {claim.status.charAt(0).toUpperCase() +
                      claim.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                  <span>
                    Submitted{" "}
                    {new Date(claim.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {claim.verificationMethod && (
                    <span>
                      Verification:{" "}
                      {claim.verificationMethod.charAt(0).toUpperCase() +
                        claim.verificationMethod.slice(1)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
