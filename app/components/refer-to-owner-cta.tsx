"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Share2, Copy, Check, Send, Loader2, ChevronDown } from "lucide-react";
import { useEngagementTracking } from "@/app/hooks/use-engagement-tracking";

interface ReferToOwnerCTAProps {
  businessId: Id<"businesses">;
  businessName: string;
  referrerSource: "category" | "business_page";
  referrerPath: string;
  compact?: boolean;
}

export function ReferToOwnerCTA({
  businessId,
  businessName,
  referrerSource,
  referrerPath,
  compact = false,
}: ReferToOwnerCTAProps) {
  const [shareStatus, setShareStatus] = useState<
    "idle" | "shared" | "copied"
  >("idle");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const sendReferral = useAction(api.ownerReferrals.sendOwnerReferral);
  const { trackClick } = useEngagementTracking(businessId);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimerRef.current), []);

  const getShareMessage = useCallback(() => {
    const pageUrl = `${window.location.origin}${referrerPath}`;
    return `Hey, someone built a free website for ${businessName}! Check it out and claim it: ${pageUrl}`;
  }, [businessName, referrerPath]);

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setShareStatus("copied");
    clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setShareStatus("idle"), 3000);
  }, []);

  const handleShare = useCallback(async () => {
    trackClick("share_click");

    const message = getShareMessage();
    const pageUrl = `${window.location.origin}${referrerPath}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Free website for ${businessName}`,
          text: message,
          url: pageUrl,
        });
        setShareStatus("shared");
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => setShareStatus("idle"), 3000);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          await copyToClipboard(message);
        }
      }
    } else {
      await copyToClipboard(message);
    }
  }, [businessName, referrerPath, trackClick, getShareMessage, copyToClipboard]);

  const handleCopy = useCallback(async () => {
    trackClick("share_click");
    await copyToClipboard(getShareMessage());
  }, [trackClick, getShareMessage, copyToClipboard]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setEmailStatus("sending");
    try {
      await sendReferral({
        businessId,
        ownerEmail: trimmed,
        referrerSource,
        referrerPath,
      });
      setEmailStatus("sent");
      setEmail("");
    } catch {
      setEmailStatus("error");
    }
  };

  // Compact mode: share icon button
  if (compact) {
    if (shareStatus === "shared" || shareStatus === "copied") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-green-600">
          <Check className="h-3.5 w-3.5" />
          {shareStatus === "copied" ? "Copied" : "Shared"}
        </span>
      );
    }

    return (
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
        title={`Know the owner of ${businessName}? Share their free website`}
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Share with owner</span>
      </button>
    );
  }

  // Full mode: business page
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm font-medium text-blue-900 mb-3">
        Know the owner of {businessName}? Let them know about their free
        website.
      </p>

      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={handleShare}
          disabled={shareStatus !== "idle"}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-70 flex items-center gap-1.5 transition-colors"
        >
          {shareStatus !== "idle" ? (
            <>
              <Check className="h-4 w-4" />
              {shareStatus === "copied" ? "Copied!" : "Shared!"}
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Share with owner
            </>
          )}
        </button>

        <button
          onClick={handleCopy}
          disabled={shareStatus !== "idle"}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 disabled:opacity-70 flex items-center gap-1.5 transition-colors"
        >
          {shareStatus === "copied" ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy message
            </>
          )}
        </button>
      </div>

      {emailStatus === "sent" ? (
        <div className="flex items-center gap-1.5 text-sm text-green-700 mt-2">
          <Check className="h-4 w-4" />
          Email sent! The owner will receive their website link.
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1 transition-colors"
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showEmailForm ? "rotate-180" : ""}`}
            />
            Know their email? Send it directly
          </button>

          {showEmailForm && (
            <form
              onSubmit={handleEmailSubmit}
              className="flex gap-2 mt-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Owner's email address"
                className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={emailStatus === "sending"}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
              >
                {emailStatus === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send
              </button>
            </form>
          )}
          {emailStatus === "error" && (
            <p className="text-xs text-red-600 mt-1">
              Something went wrong. Please try again.
            </p>
          )}
        </>
      )}
    </div>
  );
}
