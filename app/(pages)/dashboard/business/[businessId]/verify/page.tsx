"use client";

import { useParams, useSearchParams } from "next/navigation";
import { BusinessVerification } from "@/app/components/common/business-verification";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect } from "react";
import { toast } from "sonner";

export default function BusinessVerifyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const businessId = params.businessId as Id<"businesses">;
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      toast.success("Successfully connected to Google Business Profile!");
    }
  }, [success]);

  return (
    <div className="container max-w-4xl py-8">
      <BusinessVerification businessId={businessId} />
    </div>
  );
}
