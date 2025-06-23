"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DomainSelector } from "@/app/components/business/domain-selector";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DomainPageClient({
  businessId,
}: {
  businessId: Id<"businesses">;
}) {
  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  
  if (business === undefined || domain === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!business) {
    return null;
  }
  
  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/sites">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sites
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{business.name}</h1>
        <p className="text-muted-foreground mt-2">
          Manage your website&apos;s domain settings
        </p>
      </div>
      
      <DomainSelector
        businessId={businessId}
        currentDomain={domain ? {
          subdomain: domain.subdomain,
          customDomain: domain.customDomain,
          domainType: domain.domainType,
          isVerified: domain.isVerified
        } : undefined}
      />
    </div>
  );
}