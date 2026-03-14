"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { api } from "@/convex/_generated/api";

interface SelfServeCreationFormProps {
  category?: string;
  variant?: "hero" | "default";
}

export default function SelfServeCreationForm({
  category = "",
  variant = "hero",
}: SelfServeCreationFormProps) {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createWebsite = useAction(api.selfServe.createSelfServeWebsite);

  const isHero = variant === "hero";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = businessName.trim();
    const trimmedCity = city.trim();

    if (!trimmedName) {
      setError("Please enter your business name.");
      return;
    }
    if (!trimmedCity) {
      setError("Please enter your city.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createWebsite({
        businessName: trimmedName,
        category: category || "Business",
        city: trimmedCity,
        state: "FL",
        phone: phone.trim() || undefined,
      });

      window.location.href = `${result.url}?claimed=true&token=${result.claimToken}`;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    if (error) setError(null);
  };

  if (isHero) {
    return (
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Your business name"
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              clearError();
            }}
            disabled={isLoading}
            className="h-12 text-base flex-1 bg-white/10 border-white/20 text-brand-cream placeholder:text-brand-sage/60 focus-visible:ring-brand-amber"
          />
          <Input
            type="text"
            placeholder="City (e.g. Orlando)"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              clearError();
            }}
            disabled={isLoading}
            className="h-12 text-base sm:w-40 bg-white/10 border-white/20 text-brand-cream placeholder:text-brand-sage/60 focus-visible:ring-brand-amber"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearError();
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
                Get My Free Website
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
      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Your business name"
          value={businessName}
          onChange={(e) => {
            setBusinessName(e.target.value);
            clearError();
          }}
          disabled={isLoading}
          className="h-12 text-base"
          autoFocus
        />
        <Input
          type="text"
          placeholder="City (e.g. Orlando)"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            clearError();
          }}
          disabled={isLoading}
          className="h-12 text-base"
        />
        <Input
          type="tel"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearError();
          }}
          disabled={isLoading}
          className="h-12 text-base"
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
            Get My Free Website
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
