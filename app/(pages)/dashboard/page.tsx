"use client";

import { useDashboardData } from "@/app/components/providers/dashboard-provider";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Globe, ExternalLink, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ConvexImage } from "@/app/components/common/convex-image";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardPage() {
  const { user } = useDashboardData();
  const businessesWithMetadata = useQuery(
    api.dashboardData.getUserBusinessesWithMetadata,
  );

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Please sign in to view your sites.</p>
        </div>
      </Card>
    );
  }

  // Show loading state while data is being fetched
  if (businessesWithMetadata === undefined) {
    return null; // Let the Suspense boundary in the layout handle loading
  }

  const ownedBusinesses = businessesWithMetadata || [];

  if (ownedBusinesses.length === 0) {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="p-12 text-center">
          <Globe className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30" />
          <h2 className="text-2xl font-bold mb-2">No sites yet</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Create your first business website in minutes.
          </p>
          <Button asChild size="lg">
            <Link href="/">
              <Plus className="w-5 h-5 mr-2" />
              Create Your Site
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-foreground">Your Sites</h1>

      {/* Business Cards — single column */}
      <div className="space-y-4">
        {ownedBusinesses.map((business) => (
          <BusinessCard key={business._id} business={business} />
        ))}
      </div>

      {/* Add another business */}
      <div className="text-center pt-2">
        <Button variant="outline" asChild>
          <Link href="/">
            <Plus className="w-4 h-4 mr-2" />
            Add another business
          </Link>
        </Button>
      </div>
    </div>
  );
}

function BusinessCard({
  business,
}: {
  business: Doc<"businesses"> & {
    domain: Doc<"domains"> | null;
    unreadCount: number;
  };
}) {
  const { domain } = business;
  const isLive = business.isPublished && domain;

  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";

  // Determine the site URL to display and link to
  const siteUrl = domain?.customDomain
    ? domain.customDomain
    : domain?.subdomain
      ? `${domain.subdomain}.${rootDomain}`
      : null;

  return (
    <Card className="overflow-hidden p-0">
      {/* Photo */}
      <div className="aspect-[16/9] bg-muted relative overflow-hidden">
        {business.photos && business.photos[0] ? (
          <ConvexImage
            src={business.photos[0]}
            alt={business.name}
            width={600}
            height={338}
            className="w-full h-full object-cover"
            businessId={business._id}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-5 py-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{business.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            {isLive ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                <span>Live</span>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
                <span>Draft</span>
              </>
            )}
            {siteUrl && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span className="truncate">{siteUrl}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isLive && siteUrl ? (
            <>
              <Button asChild variant="outline" className="flex-1">
                <a
                  href={`https://${siteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Site
                  <ExternalLink className="w-3.5 h-3.5 ml-2" />
                </a>
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/edit/${business._id}`}>Edit Site</Link>
              </Button>
            </>
          ) : (
            <Button asChild className="flex-1">
              <Link href={`/preview/${business._id}`}>
                Finish setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
