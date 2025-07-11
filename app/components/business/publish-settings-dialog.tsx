"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  PageSettings,
  PageSettingsData,
} from "@/app/components/common/page-settings";

interface PublishSettingsDialogProps {
  businessId: Id<"businesses">;
  businessName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishComplete?: () => void;
  pageData?: {
    pageTitle?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  onUpdatePageData?: (data: {
    pageTitle?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  }) => void;
}

export function PublishSettingsDialog({
  businessId,
  businessName,
  open,
  onOpenChange,
  onPublishComplete,
  pageData,
  onUpdatePageData,
}: PublishSettingsDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [settingsData, setSettingsData] = useState<PageSettingsData | null>(
    null,
  );

  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  const publishBusiness = useMutation(api.businesses.publish);

  const handlePublish = async () => {
    if (!settingsData) return;

    setIsPublishing(true);

    try {
      // Update page data if callback provided
      if (onUpdatePageData) {
        onUpdatePageData({
          pageTitle: settingsData.pageTitle,
          seoTitle: settingsData.seoTitle,
          seoDescription: settingsData.seoDescription,
          seoKeywords: settingsData.seoKeywords,
          ogTitle: settingsData.ogTitle,
          ogDescription: settingsData.ogDescription,
          ogImage: settingsData.ogImage,
        });
      }

      // Publish the business
      await publishBusiness({ businessId });

      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";
      const isDevelopment = process.env.NODE_ENV === "development";
      const publishedUrl = isDevelopment
        ? `http://${domain?.subdomain}.localhost:3000`
        : `https://${domain?.subdomain}.${rootDomain}`;

      toast.success(
        <div className="flex flex-col gap-1">
          <span>Your website is now live!</span>
          <a
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
          >
            {publishedUrl}
          </a>
        </div>,
        { duration: 10000 },
      );

      if (onPublishComplete) {
        onPublishComplete();
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error publishing:", error);
      toast.error("Failed to publish website");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Publish Your Website</DialogTitle>
          <DialogDescription>
            Configure your website settings before publishing. You can update
            these settings anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-4">
          <PageSettings
            businessId={businessId}
            business={business || undefined}
            initialData={{
              pageTitle: pageData?.pageTitle || businessName,
              seoTitle: pageData?.seoTitle || "",
              seoDescription: pageData?.seoDescription || "",
              seoKeywords: pageData?.seoKeywords || "",
              ogTitle: pageData?.ogTitle || "",
              ogDescription: pageData?.ogDescription || "",
              ogImage: pageData?.ogImage || "",
            }}
            onSave={(data) => {
              setSettingsData(data);
              toast.success("Settings saved");
            }}
            showPublishButton={false}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || !settingsData}
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Website"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
