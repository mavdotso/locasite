"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageSettings } from "@/app/components/common/page-settings";
import { toast } from "sonner";

interface SeoSettingsProps {
  businessId: Id<"businesses">;
}

export function SeoSettings({ businessId }: SeoSettingsProps) {
  const business = useQuery(api.businesses.getById, { id: businessId });

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <PageSettings
      businessId={businessId}
      business={business}
      onSave={() => {
        toast.success("SEO settings saved successfully");
      }}
      showDomainSettings={false}
      showPublishButton={false}
    />
  );
}
