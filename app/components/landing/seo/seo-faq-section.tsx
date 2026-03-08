"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SEOFaqSectionProps {
  faqs: Array<{ question: string; answer: string }>;
}

export default function SEOFaqSection({ faqs }: SEOFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            FAQ
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
            Common questions
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-brand-border"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                aria-expanded={openIndex === index}
              >
                <h3 className="font-semibold text-brand-ink text-[15px]">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`h-4 w-4 text-brand-taupe flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-brand-taupe text-[14px] leading-[1.6]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
