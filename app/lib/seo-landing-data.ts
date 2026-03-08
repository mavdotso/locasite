import type { ComponentType } from "react";

export interface SEOLandingPageConfig {
  slug: string;
  businessType: string;
  businessTypeLower: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  definitionText: string;
  previewDomain: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedPages: Array<{ slug: string; label: string }>;
  previewComponent: ComponentType;
}

export const seoPages: Record<string, Omit<SEOLandingPageConfig, "previewComponent">> = {
  "free-restaurant-website": {
    slug: "free-restaurant-website",
    businessType: "Restaurant",
    businessTypeLower: "restaurant",
    h1: "Get a Free Restaurant Website in 30 Seconds",
    metaTitle: "Free Restaurant Website in 30 Seconds | Locosite",
    metaDescription:
      "Get a free professional restaurant website in 30 seconds. Paste your Google Maps link — menu, photos, hours, reviews auto-imported. No design skills needed.",
    definitionText:
      "Locosite creates a free professional website for your restaurant in 30 seconds using your existing Google Maps listing — no design work required.",
    previewDomain: "marias-italian-kitchen.locosite.io",
    faqs: [
      {
        question: "How does Locosite build my restaurant website?",
        answer:
          "Paste your Google Maps link and we pull your restaurant name, address, hours, menu photos, and reviews to build a complete website automatically. No forms, no questionnaires — your information is already there.",
      },
      {
        question: "Will my menu be on the website?",
        answer:
          "Yes. If your Google Maps listing includes menu items or photos, they appear on your site. You can edit and expand your menu anytime with a Starter plan ($9/mo).",
      },
      {
        question: "Can customers find my restaurant on Google?",
        answer:
          "Your Locosite website is SEO-optimized with your restaurant name, location, hours, and menu. It helps you show up in searches like \"restaurants near me\" alongside your Google listing.",
      },
      {
        question: "Do I need to pay anything?",
        answer:
          "Publishing is completely free. Your site goes live at yourname.locosite.io. Upgrade to Starter ($9/mo) to edit content, or Pro ($29/mo) for a custom domain like yourrestaurant.com.",
      },
      {
        question: "Can I take online orders through my website?",
        answer:
          "Not yet — but your site prominently displays your phone number, address, and hours so customers can reach you easily. Online ordering is on our roadmap.",
      },
    ],
    relatedPages: [
      { slug: "free-small-business-website", label: "Free Small Business Website" },
      { slug: "free-website-from-google-maps", label: "Google Maps to Website" },
    ],
  },

  "free-small-business-website": {
    slug: "free-small-business-website",
    businessType: "Small Business",
    businessTypeLower: "small business",
    h1: "Get a Free Small Business Website in 30 Seconds",
    metaTitle: "Free Small Business Website — Paste Your Google Maps Link | Locosite",
    metaDescription:
      "Get a free professional small business website in 30 seconds. Paste your Google Maps link — no design skills needed. No credit card required.",
    definitionText:
      "Locosite creates a free professional website for your small business in 30 seconds using your existing Google Maps listing — no design work required.",
    previewDomain: "sunrise-dry-cleaning.locosite.io",
    faqs: [
      {
        question: "Do I really get a free website?",
        answer:
          "Yes — completely free. Your site publishes at yourname.locosite.io with no time limit and no credit card required. Paid plans ($9/mo or $29/mo) add editing and custom domains.",
      },
      {
        question: "What kind of businesses does this work for?",
        answer:
          "Any business with a Google Maps listing: dry cleaners, auto shops, bakeries, law offices, gyms, pet groomers — you name it. If you're on Google Maps, we can build your site.",
      },
      {
        question: "How is this different from Wix or Squarespace?",
        answer:
          "Those tools require you to design and build everything from scratch. Locosite auto-generates your site from your Google Maps listing — your info, your photos, your reviews. No templates to pick, no pages to build.",
      },
      {
        question: "Can I edit my website after it's published?",
        answer:
          "The free plan publishes your site as-is from your Google listing. Upgrade to Starter ($9/mo) to edit content, or Pro ($29/mo) for a custom domain and full visual editor.",
      },
    ],
    relatedPages: [
      { slug: "free-restaurant-website", label: "Free Restaurant Website" },
      { slug: "free-website-from-google-maps", label: "Google Maps to Website" },
    ],
  },

  "free-website-from-google-maps": {
    slug: "free-website-from-google-maps",
    businessType: "Business",
    businessTypeLower: "business",
    h1: "Turn Your Google Maps Listing Into a Free Website",
    metaTitle: "Turn Your Google Maps Listing Into a Free Website | Locosite",
    metaDescription:
      "Paste your Google Maps link and get a free professional website in 30 seconds. Name, photos, hours, reviews — all imported automatically. No design needed.",
    definitionText:
      "Locosite turns your Google Maps listing into a free professional website in 30 seconds — your name, photos, hours, and reviews are imported automatically.",
    previewDomain: "your-business.locosite.io",
    faqs: [
      {
        question: "How does the Google Maps to website conversion work?",
        answer:
          "Paste your Google Maps URL into our form. We extract your business name, address, phone, hours, photos, and reviews, then generate a multi-section website automatically. The whole process takes about 30 seconds.",
      },
      {
        question: "What information gets pulled from my Google listing?",
        answer:
          "Business name, address, phone number, hours of operation, photos, Google reviews, service categories, and description. Everything that's publicly visible on your Google Maps listing.",
      },
      {
        question: "Is this safe? Are you scraping my data?",
        answer:
          "We only use publicly available information from your Google Maps listing — the same data anyone sees when they search for your business. You maintain full control and can take your site down anytime.",
      },
      {
        question: "What if my Google listing is incomplete?",
        answer:
          "Your website is generated from whatever information is available. We recommend updating your Google Business Profile first for the best results, then regenerating your site.",
      },
      {
        question: "Do I need a Google Maps listing to use Locosite?",
        answer:
          "Yes — a Google Maps listing is required. If your business isn't on Google Maps yet, create a free Google Business Profile first, then come back to generate your website.",
      },
    ],
    relatedPages: [
      { slug: "free-restaurant-website", label: "Free Restaurant Website" },
      { slug: "free-salon-website", label: "Free Salon Website" },
    ],
  },

  "free-salon-website": {
    slug: "free-salon-website",
    businessType: "Salon",
    businessTypeLower: "salon",
    h1: "Get a Free Salon Website in 30 Seconds",
    metaTitle: "Free Salon Website in 30 Seconds | Locosite",
    metaDescription:
      "Get a free professional salon website in 30 seconds. Paste your Google Maps link — services, photos, reviews auto-imported. No design skills or credit card needed.",
    definitionText:
      "Locosite creates a free professional website for your salon in 30 seconds using your existing Google Maps listing — no design work required.",
    previewDomain: "bella-hair-studio.locosite.io",
    faqs: [
      {
        question: "Will my salon services and prices show up?",
        answer:
          "If your Google Maps listing includes service information, it appears on your site. You can add a full service menu with prices by upgrading to Starter ($9/mo).",
      },
      {
        question: "Can clients book appointments through my website?",
        answer:
          "Your site displays your phone number and address prominently so clients can call to book. If you use an online booking tool, you can link to it from your site with a Starter plan.",
      },
      {
        question: "Does it look professional enough for a salon?",
        answer:
          "Yes. Each site is auto-designed with clean typography, your photos, and a layout tailored to service businesses. It looks like a custom-built salon website, not a generic template.",
      },
      {
        question: "Can I show my work portfolio or gallery?",
        answer:
          "Photos from your Google Maps listing are displayed automatically. With a Starter plan, you can add more photos and create a dedicated gallery section.",
      },
    ],
    relatedPages: [
      { slug: "free-restaurant-website", label: "Free Restaurant Website" },
      { slug: "free-plumber-website", label: "Free Plumber Website" },
    ],
  },

  "free-plumber-website": {
    slug: "free-plumber-website",
    businessType: "Plumber",
    businessTypeLower: "plumber",
    h1: "Get a Free Plumber Website in 30 Seconds",
    metaTitle: "Free Plumber Website in 30 Seconds | Locosite",
    metaDescription:
      "Get a free professional plumber website in 30 seconds. Paste your Google Maps link — services, reviews, service area auto-imported. No design skills needed.",
    definitionText:
      "Locosite creates a free professional website for your plumbing business in 30 seconds using your existing Google Maps listing — no design work required.",
    previewDomain: "reliable-plumbing-co.locosite.io",
    faqs: [
      {
        question: "Why does a plumber need a website?",
        answer:
          "When someone has a plumbing emergency, they Google it. A website with your reviews, services, and phone number builds trust and gets calls. Without one, customers choose the plumber who does have a site.",
      },
      {
        question: "Will it show my service area and licenses?",
        answer:
          "Your address and service area from Google Maps appear on your site. You can add license numbers, certifications, and service area details with a Starter plan ($9/mo).",
      },
      {
        question: "Can customers request quotes through the website?",
        answer:
          "Your phone number is displayed prominently for immediate calls. With a Starter plan, you can add a contact form for quote requests.",
      },
      {
        question: "How do I stand out from other plumbers online?",
        answer:
          "Your Google reviews are imported and displayed on your site, building trust immediately. Most local plumbers don't have a website — having one already puts you ahead.",
      },
    ],
    relatedPages: [
      { slug: "free-salon-website", label: "Free Salon Website" },
      { slug: "free-small-business-website", label: "Free Small Business Website" },
    ],
  },
};

export const allSeoPageSlugs = Object.keys(seoPages);
