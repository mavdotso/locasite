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
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  PageSettings,
  PageSettingsData,
} from "@/app/components/common/page-settings";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

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
  const [currentStep, setCurrentStep] = useState<"verification" | "settings">(
    "verification",
  );

  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  const publishBusiness = useMutation(api.businesses.publish);
  const googleOwnershipStatus = useQuery(api.businessClaims.isGoogleBusinessOwner, {
    businessId,
  });

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

  // Check if we should automatically proceed to settings
  if (currentStep === "verification" && googleOwnershipStatus?.hasGoogleVerification) {
    setCurrentStep("settings");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {currentStep === "verification"
              ? "Verify Business Ownership"
              : "Publish Your Website"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === "verification"
              ? "To publish your website, you need to verify ownership through Google Business Profile."
              : "Configure your website settings before publishing. You can update these settings anytime."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-4">
          {currentStep === "verification" ? (
            <div className="space-y-4">
              {googleOwnershipStatus === undefined ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !googleOwnershipStatus.hasGoogleVerification ? (
                <>
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Google Business Verification Required</AlertTitle>
                    <AlertDescription>
                      You need to verify ownership of this business through Google
                      Business Profile before you can publish the website.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium">Why is verification required?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>
                          Ensures only legitimate business owners can publish websites
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Protects businesses from unauthorized website creation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>
                          Enables automatic syncing with your Google Business Profile
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={() => {
                        // Navigate to the claim page
                        const claimUrl = `/${domain?.subdomain || "business"}/claim/${businessId}`;
                        window.location.href = claimUrl;
                      }}
                      className="gap-2"
                    >
                      Verify with Google Business
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">
                      Ownership Verified!
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your Google Business ownership has been verified. You can now
                      proceed to configure and publish your website.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-center pt-4">
                    <Button onClick={() => setCurrentStep("settings")} className="gap-2">
                      Continue to Settings
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
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
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep === "settings" && !googleOwnershipStatus?.hasGoogleVerification) {
                setCurrentStep("verification");
              } else {
                onOpenChange(false);
              }
            }}
            disabled={isPublishing}
          >
            {currentStep === "settings" && !googleOwnershipStatus?.hasGoogleVerification
              ? "Back"
              : "Cancel"}
          </Button>
          {currentStep === "settings" && (
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
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
