"use client";

import { useDashboardData } from "@/app/components/providers/dashboard-provider";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Globe,
  Edit3,
  MessageSquare,
  Settings,
  Plus,
  Eye,
  MapPin,
  ExternalLink,
  Sparkles,
  MoreHorizontal,
  Palette,
  CheckCircle,
  Circle,
  Search,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { ConvexImage } from "@/app/components/common/convex-image";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSubscription } from "@/app/hooks/use-subscription";
import { canCreateBusiness } from "@/convex/lib/plans";

export default function DashboardPage() {
  const { user } = useDashboardData();
  const { planType } = useSubscription();
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
  const canCreateMoreSites = canCreateBusiness(
    planType,
    ownedBusinesses.length,
  );

  if (ownedBusinesses.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center">
          <MapPin className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
          <h2 className="text-2xl font-bold mb-2">Find Your Business</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Search for your business on Google to get started with your website.
          </p>
          {canCreateMoreSites ? (
            <Button asChild size="lg">
              <Link href="/dashboard/new">
                <Search className="w-5 h-5 mr-2" />
                Find My Business
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard/billing">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Add Businesses
              </Link>
            </Button>
          )}
        </Card>
      </div>
    );
  }

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
                Add Business
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

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ownedBusinesses.map((business) => (
          <BusinessCard key={business._id} business={business} />
        ))}
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

        {/* Onboarding checklist for unpublished sites */}
        {!business.isPublished && (
          <div className="mb-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Getting started:</p>
            <ChecklistItem
              done={!!business.themeId}
              label="Choose a look"
              href={`/dashboard/business/${business._id}/theme`}
            />
            <ChecklistItem
              done={!!business.description && business.description.length > 20}
              label="Add your info"
              href={`/business/${business._id}/edit`}
            />
            <ChecklistItem
              done={false}
              label="Go live"
              href={`/business/${business._id}/edit`}
            />
          </div>
        )}

        <div className="space-y-2">
          {/* Primary action */}
          <Button asChild className="w-full h-10">
            <Link href={`/business/${business._id}/edit`}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Website
            </Link>
          </Button>

          {/* Secondary row */}
          <div className="flex items-center gap-2">
            {business.isPublished && domain ? (
              <Button asChild variant="outline" size="sm" className="flex-1 h-9">
                <a
                  href={`https://${domain.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View Site
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            ) : (
              <Button asChild variant="secondary" size="sm" className="flex-1 h-9">
                <Link href={`/business/${business._id}/edit`}>
                  <Globe className="w-3.5 h-3.5 mr-1.5" />
                  Go Live
                </Link>
              </Button>
            )}

            {/* Overflow menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 relative">
                  <MoreHorizontal className="h-4 w-4" />
                  {(unreadCount || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/business/${business._id}/messages`} className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                    {(unreadCount || 0) > 0 && (
                      <span className="ml-auto pl-2 text-xs text-red-500 font-medium">{unreadCount}</span>
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/business/${business._id}/theme`} className="flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    Change Theme
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/business/${business._id}/domain`} className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Web Address
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/business/${business._id}/settings`} className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ChecklistItem({
  done,
  label,
  href,
}: {
  done: boolean;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm hover:bg-accent rounded px-2 py-1 -mx-2 transition-colors"
    >
      {done ? (
        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
      <span className={done ? "text-muted-foreground line-through" : ""}>
        {label}
      </span>
    </Link>
  );
}
