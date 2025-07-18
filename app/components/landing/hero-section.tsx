"use client";

import { CheckCircle, Sparkles } from "lucide-react";
import Logo from "@/app/components/ui/logo";
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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-sky-500/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/10 to-transparent" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full filter blur-3xl animate-pulse" />
      </div>

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Logo and Badge */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <Logo width={56} height={56} />
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              AI-Powered Website Generator
            </div>
          </div>

          {/* Headline */}
          <h1 className="mx-auto mb-6 max-w-4xl text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Transform Any Business Into a
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              {" "}
              Stunning Website
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl">
            Simply paste a Google Maps link and watch as we create a
            professional, fully-customized website in seconds. No coding
            required.
          </p>

          {/* Input and CTA Section */}
          <div className="mx-auto mb-8 max-w-2xl">
            <BusinessURLInput
              url={url}
              setUrl={setUrl}
              isLoading={isLoading}
              onGeneratePreview={handleGeneratePreview}
            />
          </div>

          {/* Trust Indicators */}
          <div className="mb-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>SEO Optimized</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Mobile Responsive</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Fully Customizable</span>
            </div>
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
