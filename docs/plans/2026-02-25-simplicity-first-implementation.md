# Simplicity-First Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign Locasite so a busy business owner goes from zero to a live website in under 5 minutes — preview-first approach with inline editing and minimal decisions.

**Architecture:** The setup flow becomes 3 screens (Claim/Paste → Preview with Go Live → Confirmation). The existing Simple Builder becomes a hidden "advanced" mode. A new inline editor sits on top of the site preview. The dashboard is stripped to a minimal returning-user view.

**Tech Stack:** Next.js 15 (App Router), React 19, Convex (backend/DB), Tailwind CSS v4, shadcn/ui, Google OAuth via Convex Auth.

**Design Doc:** `docs/plans/2026-02-25-simplicity-first-redesign.md`

---

## Task 1: Auto-Generate Website Sections from Google Data

The preview-first flow requires a fully formed website to exist before the user sees anything. When a business is created from Google Maps scraping, we need to auto-generate a complete page with sections pre-filled from real data.

**Files:**
- Create: `convex/lib/autoGeneratePage.ts`
- Modify: `convex/businesses.ts` (the `createBusinessWithoutAuth` mutation)
- Modify: `convex/pages.ts` (add internal mutation for creating page with auto content)
- Test: `convex/lib/__tests__/autoGeneratePage.test.ts`

**Step 1: Write the auto-generation utility**

Create `convex/lib/autoGeneratePage.ts` — a pure function that takes scraped business data and returns a `SimplePageData` object:

```typescript
import type { SimplePageData, SectionInstance } from "@/app/components/simple-builder/core/types";

interface BusinessDataForGeneration {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  hours: string[];
  rating?: number;
  reviews: Array<{ reviewer: string; rating: number; text: string }>;
  photos: string[];
  description?: string;
  category?: string;
}

export function generatePageFromBusinessData(
  business: BusinessDataForGeneration
): SimplePageData {
  const sections: SectionInstance[] = [];
  let order = 0;

  // 1. Hero section — business name + first photo
  sections.push({
    id: `hero-${Date.now()}`,
    variationId: "hero-centered", // Use the centered hero variation
    order: order++,
    data: {
      title: business.name,
      subtitle: business.description || getDefaultTagline(business.category),
      backgroundImage: business.photos[0] || "",
    },
  });

  // 2. About section — description or category-based placeholder
  sections.push({
    id: `about-${Date.now()}`,
    variationId: "about-split",
    order: order++,
    data: {
      title: "About Us",
      body: business.description || getDefaultAbout(business.name, business.category),
      image: business.photos[1] || business.photos[0] || "",
    },
  });

  // 3. Services section — from Google Business categories
  if (business.category) {
    sections.push({
      id: `services-${Date.now()}`,
      variationId: "services-grid",
      order: order++,
      data: {
        title: "What We Offer",
        items: getDefaultServices(business.category),
      },
    });
  }

  // 4. Gallery — Google Business photos (if 3+)
  if (business.photos.length >= 3) {
    sections.push({
      id: `gallery-${Date.now()}`,
      variationId: "gallery-grid",
      order: order++,
      data: {
        title: "Photo Gallery",
        images: business.photos.slice(0, 6),
      },
    });
  }

  // 5. Reviews — real Google reviews (top 3 by rating)
  if (business.reviews && business.reviews.length > 0) {
    const topReviews = [...business.reviews]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
    sections.push({
      id: `reviews-${Date.now()}`,
      variationId: "reviews-cards",
      order: order++,
      data: {
        title: "What Our Customers Say",
        reviews: topReviews,
      },
    });
  }

  // 6. Contact section — address, phone, hours
  sections.push({
    id: `contact-${Date.now()}`,
    variationId: "contact-split",
    order: order++,
    data: {
      title: "Contact Us",
      address: business.address,
      phone: business.phone || "",
      email: business.email || "",
      hours: business.hours,
    },
  });

  return {
    title: business.name,
    pageTitle: business.name,
    sections,
    theme: { /* empty — will inherit from business themeId */ },
  };
}

function getDefaultTagline(category?: string): string {
  // Map business categories to default taglines
  const taglines: Record<string, string> = {
    restaurant: "Great food, great atmosphere",
    bakery: "Fresh baked daily",
    salon: "Look and feel your best",
    plumber: "Professional plumbing you can trust",
    dentist: "Your smile is our priority",
  };
  return category ? (taglines[category.toLowerCase()] || "Welcome to our business") : "Welcome to our business";
}

function getDefaultAbout(name: string, category?: string): string {
  return `Welcome to ${name}. We're proud to serve our community with quality ${category || "service"} and a commitment to excellence.`;
}

function getDefaultServices(category: string): Array<{ title: string; description: string }> {
  // Return 3-4 generic service items based on category
  // This is a reasonable default — users can edit in the inline editor
  return [
    { title: "Our Services", description: `Professional ${category} services tailored to your needs.` },
  ];
}
```

**Step 2: Write a test for the auto-generation**

Create `convex/lib/__tests__/autoGeneratePage.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { generatePageFromBusinessData } from "../autoGeneratePage";

describe("generatePageFromBusinessData", () => {
  it("creates a page with hero, about, and contact sections from minimal data", () => {
    const result = generatePageFromBusinessData({
      name: "Joe's Bakery",
      address: "123 Main St",
      hours: ["Mon-Fri 7am-5pm"],
      photos: [],
      reviews: [],
    });

    expect(result.title).toBe("Joe's Bakery");
    expect(result.sections.length).toBeGreaterThanOrEqual(3); // hero, about, contact
    expect(result.sections[0].data.title).toBe("Joe's Bakery");
  });

  it("includes reviews section when reviews exist", () => {
    const result = generatePageFromBusinessData({
      name: "Test Biz",
      address: "456 Oak Ave",
      hours: [],
      photos: [],
      reviews: [{ reviewer: "Alice", rating: 5, text: "Great!" }],
    });

    const reviewSection = result.sections.find(s => s.variationId.startsWith("reviews"));
    expect(reviewSection).toBeDefined();
  });

  it("includes gallery when 3+ photos", () => {
    const result = generatePageFromBusinessData({
      name: "Photo Biz",
      address: "789 Elm St",
      hours: [],
      photos: ["a.jpg", "b.jpg", "c.jpg"],
      reviews: [],
    });

    const gallery = result.sections.find(s => s.variationId.startsWith("gallery"));
    expect(gallery).toBeDefined();
  });
});
```

**Step 3: Run tests**

Run: `bun test convex/lib/__tests__/autoGeneratePage.test.ts`
Expected: All 3 tests pass.

**Step 4: Hook auto-generation into business creation**

Modify `convex/businesses.ts` — in the `createBusinessWithoutAuth` mutation, after creating the business record, call the auto-generation and create a page:

```typescript
// After business is created and domain is assigned:
import { generatePageFromBusinessData } from "./lib/autoGeneratePage";

// Inside createBusinessWithoutAuth, after the business + domain creation:
const pageData = generatePageFromBusinessData({
  name: args.name,
  address: args.address,
  phone: args.phone,
  hours: args.hours || [],
  rating: args.rating,
  reviews: args.reviews || [],
  photos: args.photos || [],
  description: args.description,
  category: args.category,
});

// Create the page linked to the domain
await ctx.db.insert("pages", {
  domainId: domainId,
  content: JSON.stringify(pageData),
  isPublished: false,
  lastEditedAt: Date.now(),
});
```

Also apply a theme automatically using the existing `getBusinessCategoryTheme()` logic.

**Step 5: Commit**

```bash
git add convex/lib/autoGeneratePage.ts convex/lib/__tests__/autoGeneratePage.test.ts convex/businesses.ts convex/pages.ts
git commit -m "feat: auto-generate website sections from Google Business data"
```

---

## Task 2: Simplify Auth to Google-Only

Remove GitHub and email auth options. The claim flow uses Google sign-in only, which simplifies the UI and enables automated business ownership verification.

**Files:**
- Modify: `convex/auth.config.ts` (remove non-Google providers if any)
- Modify: `convex/auth.ts` (ensure only Google provider)
- Modify: Any sign-in UI components that show multiple auth options

**Step 1: Check current auth providers**

Read `convex/auth.config.ts` and `convex/auth.ts` to confirm what providers exist. The codebase exploration shows Google is the primary provider already. Remove any other providers if present.

**Step 2: Simplify sign-in UI**

Find any sign-in components (likely in `app/components/` or `app/(pages)/sign-in/`). Replace multi-provider UI with a single "Sign in with Google" button. No email/password, no other OAuth providers.

**Step 3: Test sign-in flow manually**

Run: `bun dev`
Navigate to sign-in and confirm only Google option appears.

**Step 4: Commit**

```bash
git commit -m "feat: simplify auth to Google-only sign-in"
```

---

## Task 3: Landing Page Redesign

Replace the current multi-section marketing page with a minimal "paste your Google Maps link" form.

**Files:**
- Modify: `app/(pages)/page.tsx`
- Create: `app/components/landing/paste-link-form.tsx`
- Modify: `app/components/landing/` (remove or simplify unused sections)

**Step 1: Create the PasteLinkForm component**

Create `app/components/landing/paste-link-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function PasteLinkForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the existing scrape endpoint
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Could not find business");

      // Redirect to the preview page
      router.push(`/preview/${data.businessId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-4">
      <label htmlFor="maps-url" className="block text-lg text-muted-foreground">
        Paste your Google Maps link:
      </label>
      <Input
        id="maps-url"
        type="url"
        placeholder="https://maps.google.com/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="h-14 text-lg"
        required
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={loading}>
        {loading ? "Building your site..." : "See Your Website →"}
      </Button>
    </form>
  );
}
```

**Step 2: Rewrite the landing page**

Replace `app/(pages)/page.tsx` with the simplified version:

```tsx
import { PasteLinkForm } from "@/app/components/landing/paste-link-form";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal header */}
      <header className="p-6">
        <span className="text-xl font-semibold">Locasite</span>
      </header>

      {/* Hero — the form IS the landing page */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Your business deserves a website.
        </h1>
        <p className="text-xl text-muted-foreground text-center mb-12">
          Get one in 2 minutes.
        </p>

        <PasteLinkForm />

        <p className="mt-6 text-sm text-muted-foreground">
          Don't have your link?{" "}
          <Link href="/search" className="underline">
            Search for your business instead
          </Link>
        </p>
      </main>

      {/* How it works — minimal */}
      <section className="border-t py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-muted-foreground mb-2">1</div>
              <p className="text-lg">Paste your Google Maps link</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-muted-foreground mb-2">2</div>
              <p className="text-lg">We build your site instantly</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-muted-foreground mb-2">3</div>
              <p className="text-lg">Go live in one click</p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t py-8 px-6 text-center text-sm text-muted-foreground">
        <Link href="/privacy" className="underline mr-4">Privacy</Link>
        <Link href="/terms" className="underline">Terms</Link>
      </footer>
    </div>
  );
}
```

**Step 3: Test the landing page**

Run: `bun dev`
Navigate to localhost:3000 and confirm the simplified landing page renders.

**Step 4: Commit**

```bash
git add app/(pages)/page.tsx app/components/landing/paste-link-form.tsx
git commit -m "feat: redesign landing page with paste-link-first approach"
```

---

## Task 4: Preview Page (Pre-Auth, Both Entry Points)

Create the "Your website is ready" preview page. This is the core screen where users see their auto-generated site and decide to Go Live, edit, or change theme.

**Files:**
- Create: `app/(pages)/preview/[businessId]/page.tsx`
- Create: `app/components/preview/site-preview-frame.tsx`
- Create: `app/components/preview/preview-action-bar.tsx`

**Step 1: Create the SitePreviewFrame component**

This renders the actual business website in a scrollable frame. It reuses existing rendering components from the business site but wraps them in a preview container.

```tsx
// app/components/preview/site-preview-frame.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface SitePreviewFrameProps {
  businessId: Id<"businesses">;
}

export function SitePreviewFrame({ businessId }: SitePreviewFrameProps) {
  const business = useQuery(api.businesses.getById, { id: businessId });
  const page = useQuery(api.pages.getByBusinessId, { businessId });
  const theme = useQuery(api.themes.getById, business?.themeId ? { id: business.themeId } : "skip");

  if (!business || !page) {
    return <div className="animate-pulse bg-muted h-[600px] rounded-lg" />;
  }

  // Render the actual site sections using existing SimpleBuilder renderer
  // This reuses the same rendering pipeline as the public site
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="overflow-y-auto max-h-[70vh]">
        {/* Render site sections here using existing components */}
        {/* This will be connected to the existing section renderer */}
      </div>
    </div>
  );
}
```

**Step 2: Create the PreviewActionBar component**

```tsx
// app/components/preview/preview-action-bar.tsx
"use client";

import { Button } from "@/app/components/ui/button";

interface PreviewActionBarProps {
  onGoLive: () => void;
  onEditDetails: () => void;
  onChangeLook: () => void;
  subdomain: string;
  loading?: boolean;
}

export function PreviewActionBar({
  onGoLive,
  onEditDetails,
  onChangeLook,
  subdomain,
  loading,
}: PreviewActionBarProps) {
  return (
    <div className="space-y-4">
      <Button
        onClick={onGoLive}
        size="lg"
        className="w-full h-14 text-lg"
        disabled={loading}
      >
        {loading ? "Going live..." : "Go Live"}
      </Button>

      <div className="flex justify-center gap-6 text-sm">
        <button
          onClick={onEditDetails}
          className="text-muted-foreground hover:text-foreground underline"
        >
          Edit details
        </button>
        <button
          onClick={onChangeLook}
          className="text-muted-foreground hover:text-foreground underline"
        >
          Change look
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Your site will be at: <strong>{subdomain}.locasite.com</strong>
      </p>
    </div>
  );
}
```

**Step 3: Create the Preview page**

```tsx
// app/(pages)/preview/[businessId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { SitePreviewFrame } from "@/app/components/preview/site-preview-frame";
import { PreviewActionBar } from "@/app/components/preview/preview-action-bar";
import { ThemePickerSheet } from "@/app/components/preview/theme-picker-sheet";
import { useState } from "react";

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as Id<"businesses">;

  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, { businessId });

  const [showThemePicker, setShowThemePicker] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const publishBusiness = useMutation(api.businessPublishing.publishBusiness);

  if (!business || !domain) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  async function handleGoLive() {
    // If not authenticated, redirect to sign-in with return URL
    // After sign-in, they'll come back here and can publish
    setPublishing(true);
    try {
      await publishBusiness({ businessId });
      router.push(`/live/${businessId}`);
    } catch (err) {
      // Handle auth requirement — redirect to sign-in
      router.push(`/sign-in?redirect=/preview/${businessId}`);
    } finally {
      setPublishing(false);
    }
  }

  function handleEditDetails() {
    router.push(`/edit/${businessId}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-between p-4 border-b">
        <button onClick={() => router.back()} className="text-sm text-muted-foreground">
          ← Back
        </button>
        <span className="text-sm font-medium">Your website is ready</span>
        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Preview */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        <SitePreviewFrame businessId={businessId} />

        <div className="mt-8">
          <PreviewActionBar
            onGoLive={handleGoLive}
            onEditDetails={handleEditDetails}
            onChangeLook={() => setShowThemePicker(true)}
            subdomain={domain.subdomain}
            loading={publishing}
          />
        </div>
      </main>

      {/* Theme picker bottom sheet */}
      {showThemePicker && (
        <ThemePickerSheet
          businessId={businessId}
          onClose={() => setShowThemePicker(false)}
        />
      )}
    </div>
  );
}
```

**Step 4: Test the preview page manually**

Run: `bun dev`
Create a test business via the scraper, then navigate to `/preview/[businessId]`.

**Step 5: Commit**

```bash
git add app/(pages)/preview/ app/components/preview/
git commit -m "feat: add preview page with Go Live, edit, and theme actions"
```

---

## Task 5: Theme Picker Bottom Sheet

Replace the separate theme gallery page with a bottom sheet that overlays the preview.

**Files:**
- Create: `app/components/preview/theme-picker-sheet.tsx`
- Create: `app/components/preview/theme-preview-card.tsx`
- Reference: `convex/themes.ts` (getPresetThemes query)
- Reference: `app/(pages)/dashboard/business/[businessId]/theme/theme-gallery.tsx` (existing logic to reuse)

**Step 1: Create ThemePreviewCard**

```tsx
// app/components/preview/theme-preview-card.tsx
"use client";

interface ThemePreviewCardProps {
  name: string;
  isRecommended: boolean;
  isActive: boolean;
  colors: { primary: string; background: string; foreground: string };
  onClick: () => void;
}

export function ThemePreviewCard({
  name,
  isRecommended,
  isActive,
  colors,
  onClick,
}: ThemePreviewCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-lg border-2 p-3 text-left transition-all ${
        isActive ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
      }`}
    >
      {/* Mini preview: colored rectangles representing the site layout */}
      <div
        className="rounded-md h-24 mb-2 p-2 space-y-1"
        style={{ backgroundColor: colors.background }}
      >
        <div className="h-2 w-16 rounded" style={{ backgroundColor: colors.primary }} />
        <div className="h-3 w-24 rounded" style={{ backgroundColor: colors.foreground, opacity: 0.3 }} />
        <div className="h-2 w-20 rounded" style={{ backgroundColor: colors.foreground, opacity: 0.15 }} />
      </div>

      <p className="text-sm font-medium">{name}</p>
      {isRecommended && (
        <span className="text-xs text-muted-foreground">Best match</span>
      )}
    </button>
  );
}
```

**Step 2: Create ThemePickerSheet**

```tsx
// app/components/preview/theme-picker-sheet.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ThemePreviewCard } from "./theme-preview-card";

interface ThemePickerSheetProps {
  businessId: Id<"businesses">;
  onClose: () => void;
}

export function ThemePickerSheet({ businessId, onClose }: ThemePickerSheetProps) {
  const business = useQuery(api.businesses.getById, { id: businessId });
  const themes = useQuery(api.themes.getPresetThemes);
  const applyTheme = useMutation(api.themes.applyThemeToBusiness);

  if (!themes || !business) return null;

  // Limit to 6 themes max
  const displayThemes = themes.slice(0, 6);

  async function handleSelectTheme(themeId: Id<"themes">) {
    await applyTheme({ businessId, themeId });
    // Theme updates reactively via Convex subscription — preview updates automatically
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Pick a look</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayThemes.map((theme) => (
            <ThemePreviewCard
              key={theme._id}
              name={theme.name}
              isRecommended={false} // TODO: match with business category
              isActive={business.themeId === theme._id}
              colors={{
                primary: theme.config?.colors?.primary || "#000",
                background: theme.config?.colors?.background || "#fff",
                foreground: theme.config?.colors?.foreground || "#000",
              }}
              onClick={() => handleSelectTheme(theme._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Test theme picker**

Run: `bun dev`
Navigate to preview page, tap "Change look", verify sheet opens and themes can be selected.

**Step 4: Commit**

```bash
git add app/components/preview/theme-picker-sheet.tsx app/components/preview/theme-preview-card.tsx
git commit -m "feat: add theme picker bottom sheet for preview page"
```

---

## Task 6: Claim Banner for Outreach Users

Create the claim page that shows the pre-built site with a claim banner on top. This is the entry point for users who receive an outreach link.

**Files:**
- Create: `app/(pages)/claim/[businessId]/page.tsx`
- Create: `app/components/claim/claim-banner.tsx`

**Step 1: Create ClaimBanner component**

```tsx
// app/components/claim/claim-banner.tsx
"use client";

import { Button } from "@/app/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

interface ClaimBannerProps {
  businessName: string;
  businessId: string;
}

export function ClaimBanner({ businessName, businessId }: ClaimBannerProps) {
  const { signIn } = useAuthActions();

  function handleClaim() {
    // Sign in with Google, redirect back to preview after auth
    signIn("google", { redirectTo: `/preview/${businessId}` });
  }

  return (
    <div className="sticky top-0 z-40 bg-background border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-center sm:text-left">
          <span className="font-medium">Is this your business?</span>{" "}
          <span className="text-muted-foreground">Claim {businessName} to go live.</span>
        </p>
        <Button onClick={handleClaim} size="lg">
          Claim This Site — Sign in with Google
        </Button>
      </div>
    </div>
  );
}
```

**Step 2: Create the Claim page**

```tsx
// app/(pages)/claim/[businessId]/page.tsx
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ClaimBanner } from "@/app/components/claim/claim-banner";
import { SitePreviewFrame } from "@/app/components/preview/site-preview-frame";

interface ClaimPageProps {
  params: { businessId: string };
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const businessId = params.businessId as Id<"businesses">;
  const business = await fetchQuery(api.businesses.getById, { id: businessId });

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Business not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ClaimBanner businessName={business.name} businessId={businessId} />
      <main className="p-4 md:p-8 max-w-4xl mx-auto">
        <SitePreviewFrame businessId={businessId} />
      </main>
    </div>
  );
}
```

**Step 3: After Google sign-in, auto-verify and redirect**

Modify the auth callback to check for claim context. When a user signs in from the claim page, automatically run verification and redirect to the preview page.

This hooks into the existing `claimBusiness` mutation with `verificationMethod: "google"` and the `verifyGoogleBusinessOwnership` action.

**Step 4: Test claim flow**

Run: `bun dev`
Navigate to `/claim/[businessId]`, verify banner shows, sign-in triggers, redirect to preview works.

**Step 5: Commit**

```bash
git add app/(pages)/claim/ app/components/claim/
git commit -m "feat: add claim page with banner overlay on site preview"
```

---

## Task 7: "You're Live!" Confirmation Page

Create the celebration page shown after successful publishing.

**Files:**
- Create: `app/(pages)/live/[businessId]/page.tsx`

**Step 1: Create the confirmation page**

```tsx
// app/(pages)/live/[businessId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function LivePage() {
  const params = useParams();
  const businessId = params.businessId as Id<"businesses">;

  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, { businessId });

  if (!business || !domain) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const siteUrl = `${domain.subdomain}.locasite.com`;

  function copyLink() {
    navigator.clipboard.writeText(`https://${siteUrl}`);
    toast.success("Link copied!");
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: business.name, url: `https://${siteUrl}` });
    } else {
      copyLink();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Checkmark */}
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold">Your site is live!</h1>
        <p className="text-lg text-muted-foreground">{siteUrl}</p>

        <Button asChild size="lg" className="w-full h-14 text-lg">
          <a href={`https://${siteUrl}`} target="_blank" rel="noopener noreferrer">
            Visit Your Site →
          </a>
        </Button>

        <div className="flex justify-center gap-4">
          <button onClick={copyLink} className="text-sm text-muted-foreground hover:text-foreground underline">
            Copy link
          </button>
          <button onClick={share} className="text-sm text-muted-foreground hover:text-foreground underline">
            Share
          </button>
        </div>

        <hr className="my-8" />

        <div className="text-left space-y-4">
          <p className="text-sm text-muted-foreground">
            Want <strong>{business.name.toLowerCase().replace(/\s+/g, "")}.com</strong> instead?
          </p>
          <Link
            href={`/dashboard/business/${businessId}/domain`}
            className="text-sm underline text-muted-foreground hover:text-foreground"
          >
            Set up your own domain →
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Test the page**

Run: `bun dev`
Navigate to `/live/[businessId]` and verify the confirmation page renders.

**Step 3: Commit**

```bash
git add app/(pages)/live/
git commit -m "feat: add You're Live confirmation page"
```

---

## Task 8: Inline Editor Mode

Create the simplified inline editing mode where users see their site preview with pencil icons on each section. Tapping a section opens a slide-up panel with just the content fields.

**Files:**
- Create: `app/(pages)/edit/[businessId]/page.tsx`
- Create: `app/components/inline-editor/inline-editor.tsx`
- Create: `app/components/inline-editor/section-overlay.tsx`
- Create: `app/components/inline-editor/edit-panel.tsx`

**Step 1: Create SectionOverlay component**

This wraps each section in the preview with a dashed border and pencil icon:

```tsx
// app/components/inline-editor/section-overlay.tsx
"use client";

import { Pencil } from "lucide-react";

interface SectionOverlayProps {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
}

export function SectionOverlay({ label, onEdit, children }: SectionOverlayProps) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-primary/30 transition-colors">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-full bg-background border shadow-sm px-3 py-1.5 text-sm hover:bg-muted"
          >
            <Pencil className="w-3.5 h-3.5" />
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create EditPanel component**

Slide-up panel for editing a single section's content fields:

```tsx
// app/components/inline-editor/edit-panel.tsx
"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { X } from "lucide-react";

interface EditPanelProps {
  sectionLabel: string;
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "textarea" | "image";
    value: string;
  }>;
  onSave: (values: Record<string, string>) => void;
  onClose: () => void;
}

export function EditPanel({ sectionLabel, fields, onSave, onClose }: EditPanelProps) {
  // Local state for field values
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  );

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Panel slides up from bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl p-6 max-h-[60vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Edit: {sectionLabel}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              {field.type === "textarea" ? (
                <Textarea
                  value={values[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={3}
                />
              ) : field.type === "image" ? (
                <div className="flex items-center gap-3">
                  {values[field.key] && (
                    <img src={values[field.key]} className="w-16 h-16 rounded object-cover" alt="" />
                  )}
                  <Button variant="outline" size="sm">Change photo</Button>
                </div>
              ) : (
                <Input
                  value={values[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={() => onSave(values)}
          size="lg"
          className="w-full mt-6"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
```

Note: Add `import { useState } from "react";` at top.

**Step 3: Create the InlineEditor wrapper**

```tsx
// app/components/inline-editor/inline-editor.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { SectionOverlay } from "./section-overlay";
import { EditPanel } from "./edit-panel";

interface InlineEditorProps {
  businessId: Id<"businesses">;
}

// Map section variation IDs to user-friendly labels
const SECTION_LABELS: Record<string, string> = {
  hero: "Welcome Banner",
  about: "About Your Business",
  services: "What You Offer",
  gallery: "Photo Gallery",
  reviews: "Customer Reviews",
  contact: "Contact Info",
  footer: "Footer",
};

function getSectionLabel(variationId: string): string {
  const prefix = variationId.split("-")[0];
  return SECTION_LABELS[prefix] || variationId;
}

export function InlineEditor({ businessId }: InlineEditorProps) {
  const router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const business = useQuery(api.businesses.getById, { id: businessId });
  const page = useQuery(api.pages.getByBusinessId, { businessId });

  if (!business || !page) {
    return <div className="animate-pulse bg-muted h-[600px]" />;
  }

  const pageData = JSON.parse(page.content);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-30">
        <button
          onClick={() => router.push(`/preview/${businessId}`)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Done
        </button>
        <Button
          onClick={() => router.push(`/preview/${businessId}`)}
          size="sm"
        >
          Go Live
        </Button>
      </header>

      {/* Sections with edit overlays */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        {pageData.sections.map((section: any) => (
          <SectionOverlay
            key={section.id}
            label={getSectionLabel(section.variationId)}
            onEdit={() => setEditingSection(section.id)}
          >
            {/* Render the actual section component here */}
            {/* This will connect to existing section renderers */}
            <div className="p-8 border-b">
              <p className="text-sm text-muted-foreground">{getSectionLabel(section.variationId)}</p>
              <p>{section.data.title || section.data.body || ""}</p>
            </div>
          </SectionOverlay>
        ))}

        {/* Add section button */}
        <button className="w-full py-4 text-sm text-muted-foreground hover:text-foreground border-2 border-dashed rounded-lg mt-4">
          + Add a section
        </button>

        {/* Bottom actions */}
        <div className="flex justify-center gap-6 py-8 text-sm">
          <button
            onClick={() => {/* open theme picker */}}
            className="text-muted-foreground hover:text-foreground underline"
          >
            Change look
          </button>
          <button
            onClick={() => router.push(`/business/${businessId}/edit`)}
            className="text-muted-foreground hover:text-foreground underline"
          >
            More options
          </button>
        </div>
      </main>

      {/* Edit panel */}
      {editingSection && (
        <EditPanel
          sectionLabel={getSectionLabel(
            pageData.sections.find((s: any) => s.id === editingSection)?.variationId || ""
          )}
          fields={getFieldsForSection(
            pageData.sections.find((s: any) => s.id === editingSection)
          )}
          onSave={(values) => {
            // Save section data via mutation
            setEditingSection(null);
          }}
          onClose={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}

function getFieldsForSection(section: any) {
  if (!section) return [];

  const fields: Array<{ key: string; label: string; type: "text" | "textarea" | "image"; value: string }> = [];

  if (section.data.title) {
    fields.push({ key: "title", label: "Title", type: "text", value: section.data.title });
  }
  if (section.data.subtitle) {
    fields.push({ key: "subtitle", label: "Subtitle", type: "text", value: section.data.subtitle });
  }
  if (section.data.body) {
    fields.push({ key: "body", label: "Description", type: "textarea", value: section.data.body });
  }
  if (section.data.backgroundImage || section.data.image) {
    fields.push({
      key: section.data.backgroundImage ? "backgroundImage" : "image",
      label: "Photo",
      type: "image",
      value: section.data.backgroundImage || section.data.image || "",
    });
  }

  return fields;
}
```

**Step 4: Create the edit page route**

```tsx
// app/(pages)/edit/[businessId]/page.tsx
import { InlineEditor } from "@/app/components/inline-editor/inline-editor";
import type { Id } from "@/convex/_generated/dataModel";

interface EditPageProps {
  params: { businessId: string };
}

export default function EditPage({ params }: EditPageProps) {
  return <InlineEditor businessId={params.businessId as Id<"businesses">} />;
}
```

**Step 5: Test inline editor**

Run: `bun dev`
Navigate to `/edit/[businessId]` and verify sections show with pencil overlays.

**Step 6: Commit**

```bash
git add app/(pages)/edit/ app/components/inline-editor/
git commit -m "feat: add inline editor mode with section overlays and edit panels"
```

---

## Task 9: Dashboard Simplification

Strip the dashboard to a minimal view for returning users.

**Files:**
- Modify: `app/(pages)/dashboard/page.tsx`
- Modify or simplify the BusinessCard component

**Step 1: Rewrite the dashboard page**

Replace the current dashboard with the simplified version. One card per business, two buttons (Visit, Edit), nothing else.

Key changes:
- Remove overflow menu (Messages, Change Theme, Web Address, Settings)
- Remove onboarding checklist
- Remove "Go Live" button from card (that lives on the preview page now)
- Add "Finish setup →" for draft sites that links to `/preview/[businessId]`
- "Edit Site" links to `/edit/[businessId]` (inline editor), not the full Simple Builder
- "Visit Site" opens the live site URL
- "Add another business" at the bottom links to the landing page paste form

**Step 2: Test dashboard**

Run: `bun dev`
Navigate to `/dashboard` and verify simplified cards.

**Step 3: Commit**

```bash
git commit -m "feat: simplify dashboard to minimal returning-user view"
```

---

## Task 10: Update Middleware and Routing

Update the middleware to handle the new routes (preview, claim, edit, live) and ensure authenticated/unauthenticated states work correctly.

**Files:**
- Modify: `middleware.ts`
- Modify: `app/(pages)/` route layout to ensure new pages don't get sidebar/nav

**Step 1: Add new public routes to middleware**

The following routes should be accessible without authentication:
- `/claim/[businessId]` — public (unauthenticated claim preview)
- `/preview/[businessId]` — public initially, auth required for Go Live

The following routes require authentication:
- `/edit/[businessId]` — authenticated (inline editor)
- `/live/[businessId]` — authenticated (post-publish confirmation)
- `/dashboard` — authenticated

**Step 2: Ensure new pages use minimal layout**

The setup flow pages (landing, claim, preview, live) should NOT show the dashboard sidebar or top navigation. They should be full-screen with only a back arrow and step dots.

Check the existing layout at `app/(pages)/layout.tsx` — if it includes a sidebar or navigation, the new routes may need to be moved to a separate route group (e.g., `app/(setup)/`).

**Step 3: Test routing**

- Visit `/claim/[id]` while logged out → should work (shows claim banner)
- Visit `/preview/[id]` while logged out → should work (shows preview, Go Live prompts sign-in)
- Visit `/edit/[id]` while logged out → should redirect to sign-in
- Visit `/dashboard` while logged out → should redirect to sign-in
- Visit `/` while logged in → should show landing page (NOT redirect to dashboard anymore)

**Step 4: Commit**

```bash
git commit -m "feat: update middleware routing for new setup flow pages"
```

---

## Task 11: Connect Auto-Verification to Claim Flow

When a user signs in with Google during the claim flow, automatically verify business ownership and create the claim.

**Files:**
- Modify: `convex/businessClaims.ts` (add auto-claim-on-auth logic)
- Create or modify: Post-auth callback handler

**Step 1: Create an auto-claim mutation**

Add a new mutation that runs after Google sign-in from the claim page:

```typescript
// In convex/businessClaims.ts
export const autoClaimAfterGoogleAuth = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    const business = await ctx.db.get(args.businessId);
    if (!business) throw new Error("Business not found");

    // Check if already claimed by this user
    const existingClaim = await ctx.db
      .query("businessClaims")
      .withIndex("by_business_user", (q) =>
        q.eq("businessId", args.businessId).eq("userId", user._id)
      )
      .first();

    if (existingClaim?.status === "approved") {
      return { status: "already_claimed" };
    }

    // Create claim with auto-approval (Google auth = verified)
    const claimId = await ctx.db.insert("businessClaims", {
      businessId: args.businessId,
      userId: user._id,
      status: "approved",
      verificationMethod: "google",
      googleVerificationStatus: "verified",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      notes: "Auto-verified via Google sign-in",
    });

    // Transfer ownership
    await ctx.db.patch(args.businessId, {
      userId: user._id,
      verificationRequired: false,
      canPublish: true,
    });

    return { status: "claimed", claimId };
  },
});
```

**Step 2: Call auto-claim from the preview page**

In the preview page, after detecting the user is authenticated and viewing an unclaimed business, call `autoClaimAfterGoogleAuth`.

**Step 3: Test the full flow**

1. Visit `/claim/[businessId]` while logged out
2. Click "Claim This Site — Sign in with Google"
3. After sign-in, should auto-claim and redirect to `/preview/[businessId]`
4. Preview page should show "Verified owner" badge and enable Go Live

**Step 4: Commit**

```bash
git commit -m "feat: auto-verify business ownership on Google sign-in"
```

---

## Task 12: Wire Up Section Rendering in Preview

Connect the preview pages to the actual section rendering components from the Simple Builder, so the preview shows a real-looking website.

**Files:**
- Modify: `app/components/preview/site-preview-frame.tsx`
- Reference: Existing section renderers in `app/components/simple-builder/`

**Step 1: Import and use existing section renderers**

The existing Simple Builder has section renderer components for each section type. Reuse them in the preview frame to render a real-looking site.

Read the existing section renderer files in `app/components/simple-builder/` to understand the rendering API, then import them in `SitePreviewFrame`.

**Step 2: Apply theme styles to preview**

The preview should apply the business's selected theme (colors, fonts) using the existing theme CSS variable system.

**Step 3: Test preview rendering**

Navigate to `/preview/[businessId]` and verify the preview shows a real-looking website with themed sections.

**Step 4: Commit**

```bash
git commit -m "feat: connect preview page to real section renderers"
```

---

## Task 13: End-to-End Flow Testing

Test the complete flow from both entry points.

**Flow A (Organic):**
1. Visit `/` → paste Google Maps URL → "See Your Website"
2. See preview at `/preview/[id]`
3. Tap "Go Live" → prompted to sign in with Google
4. After sign-in → auto-claim → back to preview with "Verified owner"
5. Tap "Go Live" → published → redirect to `/live/[id]`
6. See "Your site is live!" confirmation

**Flow B (Outreach):**
1. Visit `/claim/[id]` → see site preview with claim banner
2. Tap "Claim This Site — Sign in with Google"
3. After sign-in → auto-claim → redirect to `/preview/[id]`
4. Tap "Go Live" → published → redirect to `/live/[id]`
5. See "Your site is live!" confirmation

**Returning user:**
1. Visit `/` while logged in → see landing page (no redirect to dashboard)
2. Visit `/dashboard` → see minimal card for published site
3. Tap "Edit Site" → opens inline editor at `/edit/[id]`
4. Tap pencil on a section → edit panel slides up
5. Make change, save → preview updates
6. Tap "Done" → back to preview

**Step 1: Test each flow manually**

Run: `bun dev`
Walk through each flow above and note any issues.

**Step 2: Fix any issues found**

Address bugs from manual testing.

**Step 3: Run lint and typecheck**

Run: `bun run lint && bun run build`
Expected: No errors.

**Step 4: Commit any fixes**

```bash
git commit -m "fix: resolve issues found during end-to-end flow testing"
```

---

## Summary of New Routes

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | No | Landing page with paste-link form |
| `/claim/[businessId]` | No | Outreach entry — preview with claim banner |
| `/preview/[businessId]` | No* | "Your website is ready" — Go Live, edit, theme |
| `/edit/[businessId]` | Yes | Inline editor mode |
| `/live/[businessId]` | Yes | "You're Live!" confirmation |
| `/dashboard` | Yes | Minimal returning-user view |

*Auth required to publish, not to view preview.

## Files Created

| File | Purpose |
|------|---------|
| `convex/lib/autoGeneratePage.ts` | Generate page sections from Google data |
| `convex/lib/__tests__/autoGeneratePage.test.ts` | Tests for auto-generation |
| `app/components/landing/paste-link-form.tsx` | Google Maps URL input form |
| `app/components/preview/site-preview-frame.tsx` | Full site preview renderer |
| `app/components/preview/preview-action-bar.tsx` | Go Live + Edit + Theme buttons |
| `app/components/preview/theme-picker-sheet.tsx` | Bottom sheet theme picker |
| `app/components/preview/theme-preview-card.tsx` | Theme option card |
| `app/components/claim/claim-banner.tsx` | Sticky claim banner |
| `app/components/inline-editor/inline-editor.tsx` | Main inline editor wrapper |
| `app/components/inline-editor/section-overlay.tsx` | Pencil icon overlay per section |
| `app/components/inline-editor/edit-panel.tsx` | Slide-up edit panel |
| `app/(pages)/preview/[businessId]/page.tsx` | Preview page route |
| `app/(pages)/claim/[businessId]/page.tsx` | Claim page route |
| `app/(pages)/live/[businessId]/page.tsx` | Confirmation page route |
| `app/(pages)/edit/[businessId]/page.tsx` | Inline editor page route |

## Files Modified

| File | Changes |
|------|---------|
| `app/(pages)/page.tsx` | Rewrite to paste-link landing page |
| `app/(pages)/dashboard/page.tsx` | Simplify to minimal card view |
| `convex/businesses.ts` | Hook auto-generation into business creation |
| `convex/businessClaims.ts` | Add auto-claim mutation |
| `middleware.ts` | Add new routes, update auth redirects |
