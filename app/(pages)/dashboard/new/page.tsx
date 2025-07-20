"use client";

import { useState } from "react";
import { useBusinessScraper } from "@/app/hooks/use-business-scraper";
import { BusinessURLInput } from "@/app/components/business/business-url-input";
import { BrowserMockup } from "@/app/components/business/browser-mockup";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UpgradeDialog } from "@/app/components/common/upgrade-dialog";
import { useSubscription } from "@/app/hooks/use-subscription";

export default function NewSitePage() {
  const {
    url,
    setUrl,
    isLoading,
    previewData,
    handleGeneratePreview,
    handleCreateWebsite,
  } = useBusinessScraper();

  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { planType } = useSubscription();
  const canCreateBusiness = useQuery(api.subscriptions.canCreateBusiness);

  const handleCreateWebsiteWithCheck = async () => {
    if (canCreateBusiness === false) {
      setShowUpgradeDialog(true);
      return;
    }

    await handleCreateWebsite();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create New Site</h1>
        <p className="text-muted-foreground mt-2">
          Add a Google Maps business URL to generate a professional website.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <BusinessURLInput
          url={url}
          setUrl={setUrl}
          isLoading={isLoading}
          onGeneratePreview={handleGeneratePreview}
          showHelpText={false}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        <BrowserMockup
          previewData={previewData}
          onCreateWebsite={handleCreateWebsiteWithCheck}
          isLoading={isLoading}
        />
      </div>

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        feature="create more business sites"
        requiredPlan="PROFESSIONAL"
        currentPlan={planType}
      />
    </div>
  );
}
