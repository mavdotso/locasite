"use client";

import { memo, useEffect, useRef, useCallback, useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Globe,
  Edit3,
  BarChart3,
  MessageSquare,
  Settings,
  Plus,
  Eye,
  MapPin,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ConvexImage } from "@/app/components/common/convex-image";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useSubscription } from "@/app/hooks/use-subscription";
import { canCreateBusiness } from "@/convex/lib/plans";

const ITEMS_PER_PAGE = 5;

export default function DashboardPage() {
  const { planType } = useSubscription();

  // Use paginated query - Convex handles caching automatically
  const { results, status, loadMore } = usePaginatedQuery(
    api.dashboardData.getUserBusinessesPaginated,
    {},
    { initialNumItems: ITEMS_PER_PAGE }
  );

  // Infinite scroll refs and state
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (status === "CanLoadMore" && !isLoadingMore && loadMore) {
      setIsLoadingMore(true);
      try {
        await loadMore(ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error loading more businesses:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [status, loadMore, isLoadingMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleLoadMore]);

  // Don't show the "Please sign in" message - middleware handles auth redirect

  // PROPERLY track loading state - check status field
  const isInitialLoading = status === "LoadingFirstPage" || results === undefined;
  const ownedBusinesses = results || [];
  const hasNoBusinesses = status !== "LoadingFirstPage" && results !== undefined && ownedBusinesses.length === 0;
  const canCreateMoreSites = canCreateBusiness(
    planType,
    ownedBusinesses.length,
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Sites</h1>
          <p className="text-muted-foreground">
            Manage all your business websites in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canCreateMoreSites ? (
            <Button asChild>
              <Link href="/dashboard/new">
                <Plus className="w-4 h-4 mr-2" />
                Create New Site
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard/billing">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Create Sites
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Business Cards Grid or Empty State */}
      {isInitialLoading ? (
        // ALWAYS show loading skeletons first
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: ITEMS_PER_PAGE + 1 }).map((_, index) => (
            <BusinessCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : hasNoBusinesses ? (
        // ONLY show empty state after loading is complete and no businesses found
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 text-center">
            <Globe className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
            <h2 className="text-2xl font-bold mb-4">Welcome to Locasite!</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Create your first business website to get started.
            </p>
            {canCreateMoreSites ? (
              <Button asChild size="lg">
                <Link href="/dashboard/new">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Site
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard/billing">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Create Sites
                </Link>
              </Button>
            )}
          </Card>
        </div>
      ) : (
        // Show actual businesses
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownedBusinesses.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}

          {/* Show 6th skeleton card when loading more OR when can load more (for visual continuity) */}
          {(isLoadingMore || status === "CanLoadMore") && (
            <BusinessCardSkeleton key="loading-more-skeleton" />
          )}
        </div>
      )}

      {/* Load more trigger */}
      {status === "CanLoadMore" && (
        <div
          ref={loadMoreRef}
          className="flex flex-col items-center gap-4 py-8"
        >
          {!isLoadingMore && (
            <>
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="min-w-[200px]"
                disabled={isLoadingMore}
              >
                Load More Sites
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>or scroll down to load automatically</span>
              </div>
            </>
          )}
        </div>
      )}

      {status === "Exhausted" && ownedBusinesses.length > ITEMS_PER_PAGE && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You&apos;ve reached the end of your sites</p>
        </div>
      )}
    </div>
  );
}

const BusinessCard = memo(({
  business,
}: {
  business: Doc<"businesses"> & {
    domain: Doc<"domains"> | null;
    unreadCount: number;
  };
}) => {
  const { domain, unreadCount } = business;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full p-0">
      <div className="aspect-[16/9] bg-muted relative overflow-hidden">
        {business.photos && business.photos[0] ? (
          <ConvexImage
            src={business.photos[0]}
            alt={business.name}
            width={400}
            height={225}
            className="w-full h-full object-cover"
            businessId={business._id}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          {business.isPublished ? (
            <Badge className="bg-green-500/90 text-white border-0">
              Published
            </Badge>
          ) : (
            <Badge className="bg-yellow-500/90 text-white border-0">
              Draft
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 px-5 pb-5">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {business.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex items-start gap-1 line-clamp-1">
            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
            {business.address}
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button asChild size="sm" variant="outline" className="h-9">
              <Link href={`/business/${business._id}/edit`}>
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-9 relative"
            >
              <Link href={`/dashboard/business/${business._id}/messages`}>
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                Messages
                {(unreadCount || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            </Button>

            <Button asChild size="sm" variant="outline" className="h-9">
              <Link href={`/dashboard/business/${business._id}/analytics`}>
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                Analytics
              </Link>
            </Button>

            <Button asChild size="sm" variant="outline" className="h-9">
              <Link href={`/dashboard/business/${business._id}/settings`}>
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Settings
              </Link>
            </Button>
          </div>

          {business.isPublished && domain ? (
            <Button asChild size="sm" className="w-full h-9">
              <a
                href={`https://${domain.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                View Live Site
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="w-full h-9"
            >
              <Link href={`/dashboard/business/${business._id}/settings`}>
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                Publish Site
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
});

BusinessCard.displayName = 'BusinessCard';

// Skeleton component for loading state
function BusinessCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full p-0">
      <div className="aspect-[16/9] bg-muted relative overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 right-3">
          <Skeleton className="w-20 h-6" />
        </div>
      </div>

      <div className="flex flex-col flex-1 px-5 pb-5 pt-5">
        <div className="flex-1">
          <Skeleton className="h-6 mb-2 w-3/4" />
          <Skeleton className="h-4 mb-4 w-full" />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
          </div>
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </Card>
  );
}
