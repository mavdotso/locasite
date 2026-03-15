import * as Sentry from "@sentry/nextjs";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { AlertCircle } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
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
  ).catch(() => null);

  if (!claimableStatus) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-muted-foreground">
          Unable to verify claim status. Please try again.
        </p>
        <Link href={`/${domain}`} className="text-sm text-primary hover:underline">
          Return to business page
        </Link>
      </div>
    );
  }

  let currentUser = null;
  try {
    currentUser = await fetchQuery(api.auth.currentUser, {});
  } catch (error) {
    Sentry.captureException(error);
  }

  const alreadyClaimed = business.userId !== undefined;
  const isAuthenticated = !!currentUser;

  return (
    <div className="mx-auto w-full max-w-lg py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Claim {business.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This site was built for you — claim it to go live and manage your
          business.
        </p>
      </div>

      <div className="mb-6 rounded-lg bg-muted p-4 text-sm space-y-1">
        <p className="flex gap-2">
          <span className="w-16 shrink-0 text-muted-foreground">Name</span>
          <span className="font-medium text-foreground">{business.name}</span>
        </p>
        {business.address && (
          <p className="flex gap-2">
            <span className="w-16 shrink-0 text-muted-foreground">Address</span>
            <span>{business.address}</span>
          </p>
        )}
        {business.phone && (
          <p className="flex gap-2">
            <span className="w-16 shrink-0 text-muted-foreground">Phone</span>
            <span>{business.phone}</span>
          </p>
        )}
      </div>

      <ClaimForm
        businessId={businessIdParam}
        businessName={business.name}
        domain={domain}
        isAuthenticated={isAuthenticated}
        alreadyClaimed={alreadyClaimed}
        isClaimable={claimableStatus.isClaimable}
      />
    </div>
  );
}
