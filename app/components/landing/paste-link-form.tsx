"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { env } from "@/env";

function getConvexSiteUrl(): string {
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

export default function PasteLinkForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        "That doesn\u2019t look like a Google Maps link. Try copying the URL from your browser while viewing your business on Google Maps."
      );
      return;
    }

    setIsLoading(true);

    try {
      const convexSiteUrl = getConvexSiteUrl();

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
          data?.error || `Something went wrong (${response.status}).`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.success || !data.businessId) {
        throw new Error("We couldn\u2019t create your site. Please try again.");
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
            See Your Website
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
