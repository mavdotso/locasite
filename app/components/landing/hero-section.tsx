"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Loader2,
} from "lucide-react";
import Logo from "@/app/components/ui/logo";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import BusinessLivePreview from "@/app/components/business/business-live-preview";
import { BusinessData } from "@/convex/businesses";

export default function HeroSection() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<BusinessData | null>(null);
  const router = useRouter();
  const createFromPending = useMutation(
    api.businesses.createBusinessFromPendingData,
  );

  const validateUrl = (url: string): boolean => {
    return (
      url.includes("google.com/maps") ||
      url.includes("maps.google.com") ||
      url.includes("goo.gl/maps") ||
      url.includes("maps.app.goo.gl")
    );
  };

  const handleGeneratePreview = async () => {
    if (!url.trim()) {
      toast.error("Please enter a Google Maps URL");
      return;
    }

    if (!validateUrl(url)) {
      toast.error(
        "Please enter a valid Google Maps URL. Example: https://maps.app.goo.gl/...",
      );
      return;
    }

    setIsLoading(true);
    try {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

      if (!convexUrl) {
        throw new Error("Convex URL not configured");
      }

      const deploymentName = convexUrl.split("//")[1]?.split(".")[0];
      const convexSiteUrl = `https://${deploymentName}.convex.site`;

      const response = await fetch(`${convexSiteUrl}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, preview: true }),
      });

      if (!response.ok) {
        // const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.success && data.data) {
        setPreviewData(data.data);
        toast.success("Preview generated successfully!");
      } else if (data.businessData) {
        // Fallback for different response format
        setPreviewData(data.businessData);
        toast.success("Preview generated successfully!");
      } else {
        throw new Error("No business data returned");
      }
    } catch (error) {
      console.error("Error scraping business:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to generate preview: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWebsite = async () => {
    if (!previewData) return;

    setIsLoading(true);
    try {
      // For the preview, we need to fetch the full business data again
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
      const deploymentName = convexUrl.split("//")[1]?.split(".")[0];
      const convexSiteUrl = `https://${deploymentName}.convex.site`;

      const response = await fetch(`${convexSiteUrl}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.success && data.data) {
        const result = await createFromPending({
          businessData: data.data,
          aiContent: null,
        });

        if (result.businessId) {
          router.push(`/business/${result.businessId}/edit`);
        }
      } else if (data.businessData) {
        // Fallback for different response format
        const result = await createFromPending({
          businessData: data.businessData,
          aiContent: null,
        });

        if (result.businessId) {
          router.push(`/business/${result.businessId}/edit`);
        }
      }
    } catch (error) {
      console.error("Error creating website:", error);
      toast.error("Failed to create website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent" />
      </div>

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Logo and Badge */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <Logo width={56} height={56} />
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Website Generator
            </div>
          </div>

          {/* Headline */}
          <h1 className="mx-auto mb-6 max-w-4xl text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Transform Any Business Into a
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGeneratePreview();
              }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Input
                type="url"
                placeholder="Paste a Google Maps business URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-14 text-base"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleGeneratePreview();
                  }
                }}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !url.trim()}
                className="h-14 whitespace-nowrap px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Preview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Try it free • No credit card required • Setup in 60 seconds
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mb-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>SEO Optimized</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Mobile Responsive</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Fully Customizable</span>
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="mx-auto max-w-6xl">
            <div className="relative">
              {/* Browser Frame */}
              <div className="rounded-xl border bg-card shadow-2xl">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="mx-auto flex max-w-sm items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      {previewData
                        ? `${previewData.name?.toLowerCase().replace(/\s+/g, "-")}.locasite.com`
                        : "your-business.locasite.com"}
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="relative overflow-hidden rounded-b-xl bg-background">
                  {previewData ? (
                    <div className="relative">
                      <div className="h-[700px] overflow-y-auto">
                        <BusinessLivePreview businessData={previewData} />
                      </div>
                      {/* CTA overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-6">
                        <div className="text-center">
                          <Button
                            onClick={handleCreateWebsite}
                            size="lg"
                            className="group"
                          >
                            Create This Website
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Free to start • No credit card required
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[400px] items-center justify-center">
                      <div className="text-center">
                        <Globe className="mx-auto h-24 w-24 text-muted-foreground/20" />
                        <p className="mt-4 text-lg font-medium text-muted-foreground">
                          Your website preview will appear here
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Enter a Google Maps URL above to get started
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
