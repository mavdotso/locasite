"use client";

import { useState, useCallback, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface ShareWithOwnerProps {
  businessId: Id<"businesses">;
  businessName: string;
  pageUrl: string;
}

export function ShareWithOwner({
  businessId,
  businessName,
  pageUrl,
}: ShareWithOwnerProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const trackEvent = useMutation(api.businessEngagement.trackEvent);

  useEffect(() => {
    setCanNativeShare(!!navigator.share);
  }, []);

  const shareMessage = `Hey, someone built a free website for ${businessName}! Check it out and claim it: ${pageUrl}`;

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      toast.error("Failed to copy message");
      return false;
    }
  }, [shareMessage]);

  const handleShare = useCallback(async () => {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: `Free website for ${businessName}`,
          text: shareMessage,
          url: pageUrl,
        });
        trackEvent({ businessId, eventType: "share_click" });
        return;
      } catch (err: unknown) {
        const isAbort =
          err instanceof DOMException && err.name === "AbortError";
        if (isAbort) return;
      }
    }

    const didCopy = await copyToClipboard();
    if (didCopy) {
      trackEvent({ businessId, eventType: "share_click" });
    }
  }, [
    businessId,
    businessName,
    canNativeShare,
    copyToClipboard,
    pageUrl,
    shareMessage,
    trackEvent,
  ]);

  return (
    <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
      <div className="container flex items-center justify-between mx-auto gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-blue-800 flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            Know the owner? Let them know about their free website
          </p>
        </div>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : canNativeShare ? (
            <>
              <Share2 className="h-3.5 w-3.5" />
              Share with Owner
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy Message
            </>
          )}
        </button>
      </div>
    </div>
  );
}
