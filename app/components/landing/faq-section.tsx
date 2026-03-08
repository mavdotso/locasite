'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How did you build my website without me asking?',
    answer:
      'We used your publicly available Google Maps listing \u2014 the same information anyone can see when they search for your business. We automated the design and layout work. Think of it as a professional website that was always waiting for you to show up.',
  },
  {
    question: "What's included in the $9/month?",
    answer:
      'Hosting, SSL security certificate (the padlock in browsers), automatic backups, and minor content updates when your hours or menu change. No hidden fees.',
  },
  {
    question: 'Can I use my own domain name?',
    answer:
      "Yes. If you already own a domain (like yourrestaurant.com), we can connect it. If you don't, your site launches at yourname.locosite.io and you can add a custom domain anytime.",
  },
  {
    question: "What if I don't like it?",
    answer:
      "Preview it for free before you pay. We don't charge until you decide to publish. If the preview looks wrong, email us and we'll fix it.",
  },
  {
    question: 'Do I have to pay every month forever?',
    answer:
      'No. The $9/month is hosting \u2014 standard for any website. If you cancel, your site comes down. The $149 one-time fee is a setup and design cost, not a recurring subscription.',
  },
  {
    question: 'Is this just a single page or a real website?',
    answer:
      "It's a real, multi-section website: home, about, menu or services, hours, contact, and a reviews section. Not a placeholder page.",
  },
  {
    question: 'How is this different from my Google Business Profile?',
    answer:
      "Google Business Profile shows up in Maps and local search results. A website gives you a destination \u2014 somewhere to send people, run promotions, display your full menu, and own your online presence without depending on Google's algorithm or a third-party platform.",
  },
  {
    question: "What happens if I don't claim my site?",
    answer:
      'Your preview stays up for 48 hours after we send it. After that, we archive it and may offer it to other businesses searching for that listing. The site doesn\u2019t stay live without a claim.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            FAQ
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
            Questions we get every day
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
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
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
