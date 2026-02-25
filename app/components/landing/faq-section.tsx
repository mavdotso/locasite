'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/app/lib/site-config';

const faqs = [
  {
    question: 'How does Locasite work?',
    answer: 'Simply paste your Google Maps business URL into our generator. We automatically extract your business information, create a professional website, and give you a live link within 60 seconds. You can then customize every aspect of your site using our drag-and-drop editor.'
  },
  {
    question: 'Do I need technical skills to use Locasite?',
    answer: 'Not at all! Locasite is designed for business owners, not developers. Our intuitive interface makes it easy to create and customize your website without any coding knowledge. If you can use social media, you can use Locasite.'
  },
  {
    question: 'Can I use my own domain name?',
    answer: 'Yes! With our Professional and Business plans, you can connect your own custom domain. We provide step-by-step instructions and support to help you through the process. Free plan users get a professional subdomain (yourbusiness.locasite.com).'
  },
  {
    question: 'Will my website be mobile-friendly?',
    answer: 'Absolutely. Every Locasite website is automatically optimized for all devices - phones, tablets, and desktops. Your site will look perfect regardless of screen size, ensuring a great experience for all your visitors.'
  },
  {
    question: 'How does the Google Maps integration work?',
    answer: 'Our system automatically syncs with your Google Business Profile. This means your business hours, contact information, and reviews are always up-to-date on your website. Any changes you make on Google are reflected on your site within hours.'
  },
  {
    question: 'What about SEO? Will people find my website?',
    answer: 'SEO is built into every Locasite website. We automatically optimize your site structure, meta tags, and content for search engines. Plus, our fast loading speeds and mobile optimization give you an extra SEO boost. Many of our users see improved local search rankings within weeks.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time with no questions asked. There are no long-term contracts or cancellation fees. If you cancel, your site remains active until the end of your billing period.'
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We offer email support for all plans, with priority support for Professional users and 24/7 phone support for Business plan customers. We also have comprehensive documentation, video tutorials, and a helpful community forum.'
  },
  {
    question: 'Is my data secure with Locasite?',
    answer: 'Security is our top priority. All websites include SSL certificates, and we use enterprise-grade hosting with DDoS protection. Your data is encrypted, backed up daily, and we never share your information with third parties.'
  },
  {
    question: 'Can I create multiple websites?',
    answer: 'With our Business plan, you can create and manage multiple websites from a single account. This is perfect for agencies, franchises, or business owners with multiple locations. Each site can have its own custom domain and unique design.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Got Questions?
            <span className="text-primary"> We&apos;ve Got Answers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about creating your business website with Locasite
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border transition-all duration-200 hover:border-primary/20"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
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
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Still have questions? We&apos;re here to help!
          </p>
          <a 
            href={`mailto:${SITE_CONFIG.emails.support}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}