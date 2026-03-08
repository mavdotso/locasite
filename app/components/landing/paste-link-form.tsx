"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { env } from "@/env";

function buildConvexSiteUrl(): string {
  const convexUrl = env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("Convex URL not configured");
  }
  const url = new URL(convexUrl);
  const deploymentName = url.hostname.split(".")[0];
  if (!deploymentName) {
    throw new Error("Invalid Convex URL format");
  }
  return `https://${deploymentName}.convex.site`;
}

const convexSiteUrl = buildConvexSiteUrl();

function isValidGoogleMapsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http/https protocols to prevent javascript: and other scheme attacks
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const hostname = parsed.hostname;
    return (
      hostname.endsWith("google.com") ||
      hostname.endsWith("goo.gl") ||
      hostname.endsWith("maps.app.goo.gl")
    );
  } catch {
    return false;
  }
}

interface PasteLinkFormProps {
  variant?: "default" | "hero";
  ctaLabel?: string;
}

export default function PasteLinkForm({
  variant = "default",
  ctaLabel,
}: PasteLinkFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isHero = variant === "hero";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a Google Maps URL.");
      return;
    }

    if (!isValidGoogleMapsUrl(trimmedUrl)) {
      setError(
        "That doesn\u2019t look like a Google Maps link. Try copying the URL from your browser while viewing your business on Google Maps.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${convexSiteUrl}/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      if (response.status === 429) {
        setError("Too many requests. Please wait a moment and try again.");
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error || `Something went wrong (${response.status}).`,
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.success || !data.businessId) {
        throw new Error("Site creation failed. Please try again.");
      }

      router.push(`/preview/${data.businessId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isHero) {
    return (
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            id="google-maps-url-hero"
            type="url"
            placeholder="Business name or Google Maps URL..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
            className="h-12 text-base flex-1 bg-white/10 border-white/20 text-brand-cream placeholder:text-brand-sage/60 focus-visible:ring-brand-amber"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 px-6 text-base font-semibold bg-brand-amber text-brand-ink hover:brightness-95 shrink-0"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Building...
              </>
            ) : (
              <>
                {ctaLabel || "See Your Website"}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="google-maps-url"
          className="block text-sm font-medium text-muted-foreground"
        >
          Paste your Google Maps link:
        </label>
        <Input
          id="google-maps-url"
          type="url"
          placeholder="https://maps.google.com/..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          disabled={isLoading}
          className="h-12 text-base"
          autoFocus
        />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-base font-semibold"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Building your site...
          </>
        ) : (
          <>
            {ctaLabel || "See Your Website"}
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
