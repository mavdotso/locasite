"use client";

import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface BusinessURLInputProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  onGeneratePreview: () => void;
  placeholder?: string;
  buttonText?: string;
  showHelpText?: boolean;
  className?: string;
}

export function BusinessURLInput({
  url,
  setUrl,
  isLoading,
  onGeneratePreview,
  placeholder = "Paste a Google Maps business URL here...",
  buttonText = "Generate Preview",
  showHelpText = true,
  className,
}: BusinessURLInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePreview();
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <Input
          type="url"
          placeholder={placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-14 text-base"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onGeneratePreview();
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
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      {showHelpText && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Try it free • No credit card required • Setup in 60 seconds
        </p>
      )}
    </div>
  );
}