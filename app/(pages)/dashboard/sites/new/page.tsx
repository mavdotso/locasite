"use client";

import { useBusinessScraper } from "@/app/hooks/use-business-scraper";
import { BusinessURLInput } from "@/app/components/business/business-url-input";
import { BrowserMockup } from "@/app/components/business/browser-mockup";

export default function NewSitePage() {
  const {
    url,
    setUrl,
    isLoading,
    previewData,
    handleGeneratePreview,
    handleCreateWebsite,
  } = useBusinessScraper();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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
          onCreateWebsite={handleCreateWebsite}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}