import * as Sentry from "@sentry/nextjs";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AlertCircle } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";
import { ClaimForm } from "@/app/components/claim/claim-form";

interface ClaimPageProps {
  params: Promise<{
    domain: string;
    businessId: string;
  }>;
}

export default async function ClaimBusinessPage({ params }: ClaimPageProps) {
  const { domain, businessId } = await params;
  const businessIdParam = businessId as Id<"businesses">;

  if (!businessIdParam) {
    notFound();
  }

  const business = await fetchQuery(api.businesses.getById, {
    id: businessIdParam,
  });

  if (!business) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-muted-foreground">
          Business not found. It may have been removed.
        </p>
        <Link href="/" className="text-sm text-primary hover:underline">
          Go to homepage
        </Link>
      </div>
    );
  }

  const claimableStatus = await fetchQuery(
    api.businessClaims.isBusinessClaimable,
    { businessId: businessIdParam },
  );

  if (!claimableStatus) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-muted-foreground">
          Unable to check claim status. Please try again.
        </p>
      </div>
    );
  }

  let currentUser = null;
  try {
    currentUser = await fetchQuery(api.auth.currentUser, {});
  } catch (error) {
    Sentry.captureException(error);
  }

  return (
    <ClaimForm
      business={{
        _id: business._id,
        name: business.name,
        address: business.address,
        phone: business.phone,
        website: business.website,
        userId: business.userId,
      }}
      isClaimable={claimableStatus.isClaimable}
      hasPendingClaims={claimableStatus.hasPendingClaims}
      pendingClaimsCount={claimableStatus.pendingClaimsCount}
      isAuthenticated={!!currentUser}
      domain={domain}
    />
  );
}
