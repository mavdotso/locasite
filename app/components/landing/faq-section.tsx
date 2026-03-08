'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does Locosite work?',
    answer: 'You tell us about your business and we build your website for you. Our team handles the design, development, and deployment. Your professional website is ready in 7 business days.',
  },
  {
    question: 'Do I need any technical skills?',
    answer: 'None at all. We do everything for you. Just tell us your business name, what you do, and any preferences you have. We take care of the rest.',
  },
  {
    question: 'What do I get for $149?',
    answer: 'A professionally designed, mobile-responsive website with a contact form, custom domain setup, SSL security, and SEO optimization. Built specifically for your business, not from a generic template.',
  },
  {
    question: 'What does the $9/month cover?',
    answer: 'Hosting, maintenance, security updates, uptime monitoring, basic analytics, and small content updates. Everything you need to keep your site running smoothly.',
  },
  {
    question: 'Can I use my own domain name?',
    answer: 'Yes. We set up your custom domain for you as part of the $149 claim fee. If you already own a domain, we\'ll configure it. If you need one, we\'ll help you get one.',
  },
  {
    question: 'What if I\'m not happy with the website?',
    answer: 'You get one round of revisions included. If you\'re still not satisfied, we offer a full money-back guarantee. No risk.',
  },
  {
    question: 'Can I cancel the monthly plan?',
    answer: 'Yes, cancel anytime with no questions asked. No long-term contracts. If you cancel, your site stays live until the end of your billing period.',
  },
  {
    question: 'How long until my site is live?',
    answer: '7 business days from the time you claim your site. We\'ll send you a preview link for review before going live.',
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
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                aria-expanded={openIndex === index}
              >
                <h3 className="font-semibold text-brand-ink text-[15px]">{faq.question}</h3>
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
