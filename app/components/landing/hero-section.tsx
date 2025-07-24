"use client";

import { Clock, CreditCard, Users } from "lucide-react";
import { useBusinessScraper } from "@/app/hooks/use-business-scraper";
import { BusinessURLInput } from "@/app/components/business/business-url-input";
import { BrowserMockup } from "@/app/components/business/browser-mockup";

export default function HeroSection() {
  const {
    url,
    setUrl,
    isLoading,
    previewData,
    handleGeneratePreview,
    handleCreateWebsite,
    isUserLoading,
  } = useBusinessScraper();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50/50">
      {/* Subtle gradient background - more professional */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-transparent" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-400/10 rounded-full filter blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Headline - Short and punchy */}
          <h1 className="mx-auto mb-4 max-w-3xl text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your Google Maps Info,
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Instantly Online
            </span>
          </h1>

          {/* Subheadline - Clear value prop */}
          <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl">
            Transform your Google Business Profile into a stunning website in 60 seconds. 
            No tech skills needed.
          </p>

          {/* Trust Indicators - Above the fold */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Join 50,000+ local businesses</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Setup in 60 seconds</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span>No credit card required</span>
            </div>
          </div>

          {/* Input and CTA Section */}
          <div className="mx-auto mb-12 max-w-2xl">
            <BusinessURLInput
              url={url}
              setUrl={setUrl}
              isLoading={isLoading}
              onGeneratePreview={handleGeneratePreview}
              placeholder="Paste your Google Maps business link here..."
              buttonText="Build My Website Free"
            />
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Example: https://maps.app.goo.gl/your-business-link
            </p>
          </div>

          {/* Live Preview Section */}
          <div className="mx-auto max-w-6xl">
            <BrowserMockup
              previewData={previewData}
              onCreateWebsite={handleCreateWebsite}
              isLoading={isLoading || isUserLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
