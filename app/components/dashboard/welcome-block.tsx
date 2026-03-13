"use client";

import { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ExternalLink, X, Sparkles } from "lucide-react";
import Link from "next/link";

type WelcomeVariant = "restaurant" | "plumber" | "salon" | "retail" | "generic";

const CATEGORY_TO_VARIANT: Record<string, WelcomeVariant> = Object.fromEntries([
  ...["restaurant", "cafe", "coffee_shop", "bar", "bakery",
    "fast_food_restaurant", "meal_delivery", "meal_takeaway",
  ].map((c) => [c, "restaurant" as const]),
  ...["plumber", "electrician", "contractor", "cleaning_service",
    "landscaping", "moving_company", "car_repair", "car_wash",
    "handyman", "hvac", "roofing", "painter", "pest_control",
    "locksmith", "garage_door", "towing",
  ].map((c) => [c, "plumber" as const]),
  ...["beauty_salon", "spa", "hair_care", "nail_salon",
    "massage_therapist", "skin_care", "yoga_studio",
    "personal_trainer", "gym", "fitness_center",
  ].map((c) => [c, "salon" as const]),
  ...["clothing_store", "jewelry_store", "furniture_store",
    "electronics_store", "book_store", "florist",
    "pet_store", "grocery_store", "convenience_store",
  ].map((c) => [c, "retail" as const]),
]);

const VARIANT_COPY: Record<WelcomeVariant, { message: string; nudge: string }> = {
  restaurant: {
    message: "Share your site with customers \u2014 add the link to your Google Business Profile so people searching for a place to eat can find you.",
    nudge: "Want to edit your menu or hours?",
  },
  plumber: {
    message: "Send your site link with estimates \u2014 it builds trust before you even show up.",
    nudge: "Want to update your services or remove the badge?",
  },
  salon: {
    message: "Put the link in your Instagram bio and let new bookings find you.",
    nudge: "Want to edit your services or photos?",
  },
  retail: {
    message: "Share it with your regulars and add it to Facebook \u2014 they'll be glad to find you online.",
    nudge: "Want to update your info or remove the badge?",
  },
  generic: {
    message: "Bookmark your link and share it \u2014 that's the first step to getting found.",
    nudge: "Want to edit your page or remove the badge?",
  },
};

function getVariant(category: string | undefined): WelcomeVariant {
  if (!category) return "generic";
  const normalized = category.toLowerCase().replace(/\s+/g, "_");
  return CATEGORY_TO_VARIANT[normalized] ?? "generic";
}

interface WelcomeBlockProps {
  businessName: string;
  category: string | undefined;
  siteUrl: string;
  businessId: string;
}

const DISMISS_KEY_PREFIX = "locosite_welcome_dismissed_";

export function WelcomeBlock({ businessName, category, siteUrl, businessId }: WelcomeBlockProps) {
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash

  useEffect(() => {
    const isDismissed = localStorage.getItem(`${DISMISS_KEY_PREFIX}${businessId}`);
    setDismissed(isDismissed === "true");
  }, [businessId]);

  if (dismissed) return null;

  const variant = getVariant(category);
  const { message, nudge } = VARIANT_COPY[variant];

  const handleDismiss = () => {
    localStorage.setItem(`${DISMISS_KEY_PREFIX}${businessId}`, "true");
    setDismissed(true);
  };

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-background p-0">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Dismiss welcome message"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="px-6 py-5 space-y-4">
        {/* Welcome header */}
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-1 pr-6">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {businessName} is live. {message}
            </p>
            <p className="text-sm text-muted-foreground">
              {nudge}{" "}
              <Link href="/dashboard/billing" className="font-medium text-primary underline underline-offset-2">
                Upgrade to Starter for $9/mo
              </Link>
            </p>
          </div>
        </div>

        {/* Next steps */}
        <div className="border-t pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            What&apos;s next
          </p>
          <ol className="space-y-1.5 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Share it</span>{" "}
              &mdash; Add your link to Google Business Profile, Instagram, or send it to a regular customer.
            </li>
            <li>
              <span className="font-medium text-foreground">2. Edit it</span>{" "}
              &mdash; Update your hours, photos, and description on the Starter plan.
            </li>
            <li>
              <span className="font-medium text-foreground">3. Own it</span>{" "}
              &mdash; Remove the Locosite badge and make the page fully yours.
            </li>
          </ol>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 pt-1">
          <Button asChild variant="outline" size="sm">
            <a
              href={`https://${siteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View My Site
              <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/billing">
              Upgrade to Starter &mdash; $9/mo
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
