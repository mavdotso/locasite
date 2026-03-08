"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AuthGuard } from "@/app/components/auth/auth-guard";
import { InlineEditor } from "@/app/components/inline-editor/inline-editor";

function EditPageInner({ businessId }: { businessId: Id<"businesses"> }) {
  const previewData = useQuery(
    api.businessesWithDomain.getBusinessPreviewData,
    { businessId },
  );

  // Loading
  if (previewData === undefined) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading editor...
          </p>
        </div>
      </div>
    );
  }

  // Not found
  if (previewData === null || !previewData.business) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-lg font-semibold text-foreground">
            Business not found
          </h1>
          <p className="text-sm text-muted-foreground">
            We could not find a business with that ID.
          </p>
        </div>
      </div>
    );
  }

  const { business, domain, page } = previewData;

  return (
    <InlineEditor
      businessId={businessId}
      business={business}
      domain={domain}
      page={page}
    />
  );
}

export default function EditPage() {
  const params = useParams<{ businessId: string }>();
  const businessId = params.businessId as Id<"businesses">;

  return (
    <AuthGuard loadingMessage="Loading editor...">
      <EditPageInner businessId={businessId} />
    </AuthGuard>
  );
}
