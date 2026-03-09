"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Send, Check, Loader2 } from "lucide-react";
import { trackClaimEvent } from "@/app/lib/claim-analytics";

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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [showInput, setShowInput] = useState(false);
  const sendReferral = useAction(api.ownerReferrals.sendOwnerReferral);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("sending");
    try {
      await sendReferral({
        businessId,
        ownerEmail: trimmed,
        referrerSource,
        referrerPath,
      });
      trackClaimEvent("referral", "referral_submitted", businessId);
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  // Compact mode: icon button that expands into input
  if (compact) {
    if (status === "sent") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-green-600">
          <Check className="h-3.5 w-3.5" /> Sent
        </span>
      );
    }

    if (!showInput) {
      return (
        <button
          onClick={() => setShowInput(true)}
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          title={`Know the owner of ${businessName}? Send them their website`}
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share with owner</span>
        </button>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Owner's email"
          className="w-36 px-2 py-1 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
          required
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "sending" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Send"
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowInput(false)}
          className="text-xs text-neutral-400 hover:text-neutral-600"
        >
          &times;
        </button>
      </form>
    );
  }

  // Full mode: inline section for business page
  if (status === "sent") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-700">
          <Check className="h-5 w-5" />
          <p className="font-medium">
            Email sent! The owner will receive their website link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm font-medium text-blue-900 mb-2">
        Know the owner of {businessName}? Send them their free website.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
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
          disabled={status === "sending"}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
        >
          {status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs text-red-600 mt-1">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
