"use client";

import { Globe, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import BusinessLivePreview from "./business-live-preview";
import { BusinessData } from "@/convex/businesses";
import { toUrlFriendly } from "@/app/lib/url-utils";

interface BrowserMockupProps {
  previewData: BusinessData | null;
  onCreateWebsite?: () => void;
  isLoading?: boolean;
  showCreateButton?: boolean;
  className?: string;
}

export function BrowserMockup({
  previewData,
  onCreateWebsite,
  isLoading = false,
  showCreateButton = true,
  className,
}: BrowserMockupProps) {
  return (
    <div className={className}>
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
                  ? `${toUrlFriendly(previewData.name || "business")}.locasite.com`
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
                {showCreateButton && onCreateWebsite && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-6">
                    <div className="text-center">
                      <Button
                        onClick={onCreateWebsite}
                        size="lg"
                        className="group"
                        disabled={isLoading}
                      >
                        Publish This Website
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Free to start • No credit card required
                      </p>
                    </div>
                  </div>
                )}
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
  );
}
