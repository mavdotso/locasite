"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const joinWaitlist = useMutation(api.managedWaitlist.join);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const result = await joinWaitlist({ email: email.trim() });
      if (result.alreadyJoined) {
        setMessage("You're already on the list! We'll notify you at launch.");
      } else {
        setMessage("You're on the list! We'll email you when we launch.");
      }
      setStatus("success");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 bg-brand-pine/20 border border-brand-sage/30 rounded-lg px-6 py-4">
          <svg className="h-5 w-5 text-brand-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-brand-cream font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-brand-cream placeholder:text-brand-sage/60 focus:outline-none focus:ring-2 focus:ring-brand-amber/50 text-sm"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-brand-amber px-6 py-3 font-semibold text-brand-ink text-sm hover:bg-brand-amber/90 transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === "loading" ? "Joining…" : "Get notified"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-1 w-full">{message}</p>
      )}
    </form>
  );
}
