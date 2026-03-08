'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does Locosite work?',
    answer:
      'Paste your Google Maps or Google Business link. We automatically pull your business info — name, photos, hours, location — and generate a professional website. You can edit anything you want, then hit Publish. That\'s it.',
  },
  {
    question: 'Do I need any technical skills?',
    answer:
      'None at all. If you can copy a link and click a button, you can build your website. Our editor is point-and-click — no code, no design experience needed.',
  },
  {
    question: 'What do I get for $149?',
    answer:
      'A professionally designed website auto-generated from your Google Business profile, a WYSIWYG editor to customize anything, your own domain, one-click publish, mobile-responsive design, SSL security, and local SEO optimization.',
  },
  {
    question: 'What does the $9/month cover?',
    answer:
      'Hosting, security updates, uptime monitoring, basic analytics, and email support. Everything you need to keep your site running smoothly. Cancel anytime.',
  },
  {
    question: 'Can I use my own domain name?',
    answer:
      'Yes. Your own domain is included with your $149 purchase. If you already own a domain, we\'ll help you connect it. If you need one, we\'ll set it up for you.',
  },
  {
    question: 'What if I want to make changes later?',
    answer:
      'You can edit your site anytime using our built-in editor. Change text, swap photos, update your hours — it\'s all point-and-click. No need to contact anyone.',
  },
  {
    question: 'Can I cancel the monthly plan?',
    answer:
      'Yes, cancel anytime with no questions asked. No long-term contracts. If you cancel, your site stays live until the end of your billing period.',
  },
  {
    question: 'How long until my site is live?',
    answer:
      'Minutes. Paste your Google Maps link, review the auto-generated site, make any edits you want, and hit Publish. Your site can be live the same day.',
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
            Questions? Answers.
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
