import type { ComponentType } from "react";
import type { GenericPreviewConfig } from "@/app/components/landing/seo/previews/generic-business-preview";

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

// Preview config per category for GenericBusinessPreview
export const categoryPreviewConfigs: Record<string, GenericPreviewConfig> = {
  dentist: {
    businessName: "Bright Smile Dental",
    tagline: "Your Family Dentist\nin Downtown Tampa",
    location: "422 Main St, Tampa, FL 33602",
    phone: "(813) 555-0147",
    hours: "Mon–Fri 8am–5pm",
    services: [
      { name: "Teeth Cleaning", desc: "Professional cleaning & polishing" },
      { name: "Dental Implants", desc: "Permanent tooth replacement" },
      { name: "Teeth Whitening", desc: "Brighten your smile today" },
    ],
    accentColor: "#0ea5e9", accentLight: "#f0f9ff", accentDark: "#0c4a6e", navBg: "#0c4a6e", navText: "#bae6fd",
  },
  electrician: {
    businessName: "Volt Electric Services",
    tagline: "Licensed Electrician\nYou Can Trust",
    location: "780 Industrial Blvd, Orlando, FL 32801",
    phone: "(407) 555-0233",
    hours: "Mon–Sat 7am–6pm",
    services: [
      { name: "Panel Upgrades", desc: "200-amp service upgrades" },
      { name: "Wiring & Rewiring", desc: "Residential & commercial" },
      { name: "Emergency Repairs", desc: "Same-day service available" },
    ],
    accentColor: "#f59e0b", accentLight: "#fffbeb", accentDark: "#78350f", navBg: "#1c1917", navText: "#fde68a",
  },
  "barber-shop": {
    businessName: "Classic Cuts Barbershop",
    tagline: "Old-School Craft,\nModern Style",
    location: "215 Oak Ave, Miami, FL 33130",
    phone: "(305) 555-0182",
    hours: "Tue–Sat 9am–7pm",
    services: [
      { name: "Classic Haircut", desc: "Precision cut & hot towel finish" },
      { name: "Beard Trim", desc: "Shape, line-up & conditioning" },
      { name: "Hot Shave", desc: "Straight razor with warm lather" },
    ],
    accentColor: "#dc2626", accentLight: "#fef2f2", accentDark: "#450a0a", navBg: "#1c1917", navText: "#fecaca",
  },
  "nail-salon": {
    businessName: "Polished Nails & Spa",
    tagline: "Nails That Make\na Statement",
    location: "1055 Beach Dr, Clearwater, FL 33767",
    phone: "(727) 555-0199",
    hours: "Mon–Sat 9:30am–7pm",
    services: [
      { name: "Gel Manicure", desc: "Long-lasting color & shine" },
      { name: "Spa Pedicure", desc: "Relaxing soak & massage" },
      { name: "Nail Art", desc: "Custom designs & accents" },
    ],
    accentColor: "#ec4899", accentLight: "#fdf2f8", accentDark: "#500724", navBg: "#500724", navText: "#fbcfe8",
  },
  "auto-repair": {
    businessName: "Trusty Auto Repair",
    tagline: "Honest Mechanics,\nFair Prices",
    location: "3200 Commerce Pkwy, Tampa, FL 33619",
    phone: "(813) 555-0276",
    hours: "Mon–Fri 7:30am–5:30pm",
    services: [
      { name: "Brake Service", desc: "Pads, rotors & fluid flush" },
      { name: "Oil Change", desc: "Synthetic & conventional" },
      { name: "AC Repair", desc: "Diagnostics & recharge" },
    ],
    accentColor: "#2563eb", accentLight: "#eff6ff", accentDark: "#1e3a5f", navBg: "#1e3a5f", navText: "#bfdbfe",
  },
  hvac: {
    businessName: "CoolBreeze HVAC",
    tagline: "Stay Comfortable\nAll Year Round",
    location: "890 Tech Dr, Fort Lauderdale, FL 33309",
    phone: "(954) 555-0314",
    hours: "Mon–Sat 7am–7pm",
    services: [
      { name: "AC Installation", desc: "New units & replacements" },
      { name: "Heating Repair", desc: "Furnace & heat pump service" },
      { name: "Duct Cleaning", desc: "Improve air quality" },
    ],
    accentColor: "#0891b2", accentLight: "#ecfeff", accentDark: "#164e63", navBg: "#164e63", navText: "#a5f3fc",
  },
  gym: {
    businessName: "Iron Peak Fitness",
    tagline: "Strength Starts\nHere",
    location: "567 Fitness Way, Orlando, FL 32819",
    phone: "(407) 555-0401",
    hours: "5am–10pm Daily",
    services: [
      { name: "Personal Training", desc: "1-on-1 custom programs" },
      { name: "Group Classes", desc: "HIIT, yoga, spin & more" },
      { name: "Open Gym", desc: "Free weights & cardio" },
    ],
    accentColor: "#dc2626", accentLight: "#fef2f2", accentDark: "#1c1917", navBg: "#0a0a0a", navText: "#fca5a5",
  },
  "coffee-shop": {
    businessName: "Morning Ritual Coffee",
    tagline: "Locally Roasted,\nCarefully Brewed",
    location: "88 Main St, St. Petersburg, FL 33701",
    phone: "(727) 555-0122",
    hours: "6am–6pm Daily",
    services: [
      { name: "Espresso Drinks", desc: "Lattes, cappuccinos & more" },
      { name: "Pour Over", desc: "Single-origin selections" },
      { name: "Fresh Pastries", desc: "Baked in-house daily" },
    ],
    accentColor: "#92400e", accentLight: "#fef3c7", accentDark: "#451a03", navBg: "#292524", navText: "#fde68a",
  },
  bakery: {
    businessName: "Golden Crust Bakery",
    tagline: "Fresh-Baked\nEvery Morning",
    location: "342 Vine St, Coral Gables, FL 33134",
    phone: "(305) 555-0267",
    hours: "6am–3pm Tue–Sun",
    services: [
      { name: "Artisan Bread", desc: "Sourdough, rye & ciabatta" },
      { name: "Custom Cakes", desc: "Wedding & celebration cakes" },
      { name: "Pastries", desc: "Croissants, danishes & more" },
    ],
    accentColor: "#b45309", accentLight: "#fffbeb", accentDark: "#451a03", navBg: "#451a03", navText: "#fde68a",
  },
  landscaping: {
    businessName: "GreenScape Pros",
    tagline: "Professional Landscaping\nfor Your Home",
    location: "1400 Garden Rd, Brandon, FL 33510",
    phone: "(813) 555-0388",
    hours: "Mon–Sat 7am–5pm",
    services: [
      { name: "Lawn Care", desc: "Mowing, edging & fertilizing" },
      { name: "Garden Design", desc: "Custom landscape plans" },
      { name: "Irrigation", desc: "Sprinkler install & repair" },
    ],
    accentColor: "#16a34a", accentLight: "#f0fdf4", accentDark: "#14532d", navBg: "#14532d", navText: "#bbf7d0",
  },
  "cleaning-service": {
    businessName: "Sparkle Clean Co.",
    tagline: "Spotless Results,\nEvery Time",
    location: "2100 Service Ave, Hialeah, FL 33012",
    phone: "(786) 555-0201",
    hours: "Mon–Sat 7am–6pm",
    services: [
      { name: "Home Cleaning", desc: "Weekly & bi-weekly plans" },
      { name: "Deep Clean", desc: "Move-in/move-out ready" },
      { name: "Office Cleaning", desc: "Commercial spaces" },
    ],
    accentColor: "#0ea5e9", accentLight: "#f0f9ff", accentDark: "#0c4a6e", navBg: "#f0f9ff", navText: "#0c4a6e",
  },
  veterinarian: {
    businessName: "Paws & Claws Vet",
    tagline: "Caring for Your\nFurry Family",
    location: "555 Pet Lane, Hollywood, FL 33020",
    phone: "(954) 555-0177",
    hours: "Mon–Fri 8am–6pm · Sat 9am–2pm",
    services: [
      { name: "Wellness Exams", desc: "Annual checkups & vaccines" },
      { name: "Surgery", desc: "Spay, neuter & procedures" },
      { name: "Emergency Care", desc: "Urgent after-hours visits" },
    ],
    accentColor: "#16a34a", accentLight: "#f0fdf4", accentDark: "#14532d", navBg: "#14532d", navText: "#bbf7d0",
  },
  chiropractor: {
    businessName: "Align Chiropractic",
    tagline: "Natural Pain Relief\n& Wellness",
    location: "710 Health Blvd, Lakeland, FL 33801",
    phone: "(863) 555-0299",
    hours: "Mon–Fri 8am–6pm",
    services: [
      { name: "Spinal Adjustment", desc: "Gentle & effective" },
      { name: "Sports Rehab", desc: "Injury recovery & prevention" },
      { name: "Posture Correction", desc: "Ergonomic assessment" },
    ],
    accentColor: "#7c3aed", accentLight: "#f5f3ff", accentDark: "#2e1065", navBg: "#2e1065", navText: "#c4b5fd",
  },
  "dry-cleaner": {
    businessName: "Prestige Dry Cleaners",
    tagline: "Expert Garment Care\nSince 2005",
    location: "430 Plaza Dr, Tampa, FL 33609",
    phone: "(813) 555-0155",
    hours: "Mon–Fri 7am–7pm · Sat 8am–4pm",
    services: [
      { name: "Dry Cleaning", desc: "Suits, dresses & delicates" },
      { name: "Alterations", desc: "Tailoring & repairs" },
      { name: "Wash & Fold", desc: "By-the-pound laundry" },
    ],
    accentColor: "#6366f1", accentLight: "#eef2ff", accentDark: "#1e1b4b", navBg: "#1e1b4b", navText: "#c7d2fe",
  },
  "tattoo-shop": {
    businessName: "Black Ink Studio",
    tagline: "Custom Art,\nPermanent Expression",
    location: "920 Arts District, Miami, FL 33137",
    phone: "(305) 555-0344",
    hours: "Tue–Sat 11am–9pm",
    services: [
      { name: "Custom Tattoos", desc: "Original designs from our artists" },
      { name: "Cover-Ups", desc: "Transform existing work" },
      { name: "Piercings", desc: "Professional body piercing" },
    ],
    accentColor: "#f43f5e", accentLight: "#fff1f2", accentDark: "#1c1917", navBg: "#0a0a0a", navText: "#fecdd3",
  },
  "car-wash": {
    businessName: "Diamond Shine Car Wash",
    tagline: "Your Car Deserves\nthe Best",
    location: "2800 Auto Mall Dr, Orlando, FL 32808",
    phone: "(407) 555-0366",
    hours: "7am–8pm Daily",
    services: [
      { name: "Express Wash", desc: "Quick exterior clean" },
      { name: "Full Detail", desc: "Interior & exterior" },
      { name: "Ceramic Coating", desc: "Long-lasting protection" },
    ],
    accentColor: "#2563eb", accentLight: "#eff6ff", accentDark: "#1e3a5f", navBg: "#1e3a5f", navText: "#bfdbfe",
  },
  "pet-grooming": {
    businessName: "Happy Tails Grooming",
    tagline: "Pamper Your Pet\nWith Love",
    location: "600 Pet Park Rd, Clearwater, FL 33756",
    phone: "(727) 555-0288",
    hours: "Mon–Sat 8am–5pm",
    services: [
      { name: "Full Grooming", desc: "Bath, haircut & nails" },
      { name: "Bath & Brush", desc: "Quick refresh & deshedding" },
      { name: "Nail Trim", desc: "Walk-ins welcome" },
    ],
    accentColor: "#f97316", accentLight: "#fff7ed", accentDark: "#431407", navBg: "#431407", navText: "#fed7aa",
  },
  photographer: {
    businessName: "Captured Moments Studio",
    tagline: "Professional Photos\nThat Tell Your Story",
    location: "150 Creative Ave, St. Petersburg, FL 33710",
    phone: "(727) 555-0411",
    hours: "By Appointment",
    services: [
      { name: "Portraits", desc: "Family, headshots & senior" },
      { name: "Events", desc: "Weddings & celebrations" },
      { name: "Commercial", desc: "Product & brand photography" },
    ],
    accentColor: "#a855f7", accentLight: "#faf5ff", accentDark: "#2e1065", navBg: "#1c1917", navText: "#d8b4fe",
  },
  florist: {
    businessName: "Bloom & Petal",
    tagline: "Beautiful Arrangements\nfor Every Occasion",
    location: "88 Garden Row, Coral Gables, FL 33146",
    phone: "(305) 555-0199",
    hours: "Mon–Sat 8am–6pm",
    services: [
      { name: "Bouquets", desc: "Fresh-cut flower arrangements" },
      { name: "Wedding Flowers", desc: "Bridal & ceremony designs" },
      { name: "Plant Delivery", desc: "Indoor & outdoor plants" },
    ],
    accentColor: "#e11d48", accentLight: "#fff1f2", accentDark: "#4c0519", navBg: "#4c0519", navText: "#fecdd3",
  },
  roofing: {
    businessName: "Summit Roofing Co.",
    tagline: "Roofs Built\nto Last",
    location: "4500 Trade Way, Brandon, FL 33511",
    phone: "(813) 555-0422",
    hours: "Mon–Fri 7am–5pm",
    services: [
      { name: "Roof Replacement", desc: "Shingle, tile & metal" },
      { name: "Leak Repair", desc: "Emergency & scheduled" },
      { name: "Inspections", desc: "Free roof assessments" },
    ],
    accentColor: "#b45309", accentLight: "#fffbeb", accentDark: "#292524", navBg: "#1c1917", navText: "#fde68a",
  },
  "pest-control": {
    businessName: "Guardian Pest Solutions",
    tagline: "Protect Your Home\nFrom Pests",
    location: "1200 Shield Rd, Fort Lauderdale, FL 33311",
    phone: "(954) 555-0333",
    hours: "Mon–Sat 7am–6pm",
    services: [
      { name: "Termite Treatment", desc: "Inspection & prevention" },
      { name: "General Pest", desc: "Ants, roaches & spiders" },
      { name: "Lawn & Ornamental", desc: "Outdoor pest control" },
    ],
    accentColor: "#16a34a", accentLight: "#f0fdf4", accentDark: "#14532d", navBg: "#14532d", navText: "#bbf7d0",
  },
  handyman: {
    businessName: "FixIt Right Handyman",
    tagline: "No Job Too Small,\nNo Fix Too Tough",
    location: "330 Craft St, Hialeah, FL 33010",
    phone: "(786) 555-0277",
    hours: "Mon–Sat 8am–6pm",
    services: [
      { name: "Home Repairs", desc: "Drywall, doors & fixtures" },
      { name: "Assembly", desc: "Furniture & equipment" },
      { name: "Painting", desc: "Interior & exterior touch-ups" },
    ],
    accentColor: "#ea580c", accentLight: "#fff7ed", accentDark: "#431407", navBg: "#292524", navText: "#fdba74",
  },
  "pool-service": {
    businessName: "Crystal Pool Care",
    tagline: "Keep Your Pool\nSparkling Clean",
    location: "980 Aqua Dr, Hollywood, FL 33021",
    phone: "(954) 555-0188",
    hours: "Mon–Fri 7am–5pm",
    services: [
      { name: "Weekly Cleaning", desc: "Chemical balance & skimming" },
      { name: "Equipment Repair", desc: "Pumps, filters & heaters" },
      { name: "Resurfacing", desc: "Pool renovation & tile" },
    ],
    accentColor: "#0284c7", accentLight: "#f0f9ff", accentDark: "#0c4a6e", navBg: "#0c4a6e", navText: "#bae6fd",
  },
  "pressure-washing": {
    businessName: "PowerWash Pros",
    tagline: "Restore Your Property's\nCurb Appeal",
    location: "2200 Clean St, Lakeland, FL 33803",
    phone: "(863) 555-0344",
    hours: "Mon–Sat 7am–5pm",
    services: [
      { name: "Driveway Cleaning", desc: "Concrete & pavers" },
      { name: "House Washing", desc: "Soft wash exterior" },
      { name: "Deck & Patio", desc: "Wood & composite surfaces" },
    ],
    accentColor: "#0891b2", accentLight: "#ecfeff", accentDark: "#164e63", navBg: "#164e63", navText: "#a5f3fc",
  },
  "tree-service": {
    businessName: "Canopy Tree Experts",
    tagline: "Expert Tree Care\nYou Can Count On",
    location: "1600 Arbor Way, Tampa, FL 33612",
    phone: "(813) 555-0477",
    hours: "Mon–Sat 7am–5pm",
    services: [
      { name: "Tree Trimming", desc: "Shaping & crown reduction" },
      { name: "Tree Removal", desc: "Safe takedowns & stump grinding" },
      { name: "Emergency Service", desc: "Storm damage response" },
    ],
    accentColor: "#16a34a", accentLight: "#f0fdf4", accentDark: "#14532d", navBg: "#14532d", navText: "#bbf7d0",
  },
  lawyer: {
    businessName: "Rivera & Associates",
    tagline: "Experienced Legal\nRepresentation",
    location: "100 Justice Blvd, Miami, FL 33131",
    phone: "(305) 555-0501",
    hours: "Mon–Fri 8:30am–5:30pm",
    services: [
      { name: "Personal Injury", desc: "Car accidents & slip-and-fall" },
      { name: "Family Law", desc: "Divorce & custody" },
      { name: "Immigration", desc: "Visas & citizenship" },
    ],
    accentColor: "#1d4ed8", accentLight: "#eff6ff", accentDark: "#172554", navBg: "#172554", navText: "#bfdbfe",
  },
  accountant: {
    businessName: "TrueBooks Accounting",
    tagline: "Numbers You\nCan Trust",
    location: "800 Finance Row, Tampa, FL 33606",
    phone: "(813) 555-0533",
    hours: "Mon–Fri 8am–5pm",
    services: [
      { name: "Tax Preparation", desc: "Individual & business returns" },
      { name: "Bookkeeping", desc: "Monthly financial records" },
      { name: "Business Advisory", desc: "Growth & planning strategy" },
    ],
    accentColor: "#059669", accentLight: "#ecfdf5", accentDark: "#064e3b", navBg: "#064e3b", navText: "#a7f3d0",
  },
  "real-estate-agent": {
    businessName: "Keystone Realty Group",
    tagline: "Find Your Dream\nHome in Florida",
    location: "450 Realty Pkwy, Orlando, FL 32801",
    phone: "(407) 555-0599",
    hours: "Mon–Sat 9am–7pm",
    services: [
      { name: "Buying", desc: "Home search & negotiation" },
      { name: "Selling", desc: "Listing & marketing" },
      { name: "Rentals", desc: "Property management" },
    ],
    accentColor: "#b45309", accentLight: "#fffbeb", accentDark: "#451a03", navBg: "#292524", navText: "#fde68a",
  },
};

// Generate SEO page config for a category
function generateSeoPageConfig(
  slug: string,
  businessType: string,
  businessTypeLower: string,
  previewDomain: string,
  faqs: Array<{ question: string; answer: string }>,
  relatedSlugs: string[],
): Omit<SEOLandingPageConfig, "previewComponent"> {
  return {
    slug,
    businessType,
    businessTypeLower,
    h1: `Get a Free ${businessType} Website in 30 Seconds`,
    metaTitle: `Free ${businessType} Website in 30 Seconds`,
    metaDescription: `Get a free professional ${businessTypeLower} website in 30 seconds. Paste your Google Maps link — photos, hours, reviews auto-imported. No design skills needed.`,
    definitionText: `Locosite creates a free professional website for your ${businessTypeLower} in 30 seconds using your existing Google Maps listing — no design work required.`,
    previewDomain,
    faqs,
    relatedPages: relatedSlugs.map((s) => ({
      slug: s,
      label: s
        .replace("free-", "Free ")
        .replace("-website", " Website")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    })),
  };
}

export const seoPages: Record<string, Omit<SEOLandingPageConfig, "previewComponent">> = {
  "free-restaurant-website": {
    slug: "free-restaurant-website",
    businessType: "Restaurant",
    businessTypeLower: "restaurant",
    h1: "Get a Free Restaurant Website in 30 Seconds",
    metaTitle: "Free Restaurant Website in 30 Seconds",
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
    metaTitle: "Free Small Business Website — Paste Your Google Maps Link",
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
    metaTitle: "Turn Your Google Maps Listing Into a Free Website",
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
    metaTitle: "Free Salon Website in 30 Seconds",
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
    metaTitle: "Free Plumber Website in 30 Seconds",
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

  // --- Generated categories (25+ new pages) ---

  "free-dentist-website": generateSeoPageConfig(
    "free-dentist-website", "Dentist", "dental practice", "bright-smile-dental.locosite.io",
    [
      { question: "Why does a dental practice need a website?", answer: "Patients search online for dentists before booking. A website with your hours, services, location, and reviews builds trust and helps new patients find you — without relying on directory sites you don't control." },
      { question: "Will my dental services show up on the site?", answer: "Your Google Maps listing info is imported automatically. With a Starter plan ($9/mo), you can add a full list of services, insurance accepted, and new patient forms." },
      { question: "Can patients book appointments online?", answer: "Your phone number and address are displayed prominently. If you use an online booking tool, you can link to it from your site with a Starter plan." },
      { question: "Is this HIPAA compliant?", answer: "Locosite displays only publicly available information from your Google Maps listing. No patient data is collected or stored. Contact forms (on paid plans) go directly to your email." },
    ],
    ["free-small-business-website", "free-restaurant-website"],
  ),

  "free-electrician-website": generateSeoPageConfig(
    "free-electrician-website", "Electrician", "electrical business", "volt-electric-services.locosite.io",
    [
      { question: "Why does an electrician need a website?", answer: "When someone needs an electrician, they Google it. A professional website with your license info, services, and reviews gets you calls over competitors without a web presence." },
      { question: "Can I show my license and certifications?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), you can add license numbers, certifications, insurance details, and a full service list." },
      { question: "Will it show my service area?", answer: "Your business address from Google Maps appears on your site. You can highlight your full service area with a Starter plan." },
      { question: "How does this compare to Angi or HomeAdvisor?", answer: "Those platforms charge per lead and you compete with other electricians. Your Locosite website is yours — no per-lead fees, no competing ads, and it ranks in Google alongside your listing." },
    ],
    ["free-plumber-website", "free-small-business-website"],
  ),

  "free-barber-shop-website": generateSeoPageConfig(
    "free-barber-shop-website", "Barber Shop", "barber shop", "classic-cuts-barbershop.locosite.io",
    [
      { question: "Will my barbershop photos show up?", answer: "Yes — photos from your Google Maps listing are imported automatically, including your shop interior and work examples. You can add more photos with a Starter plan." },
      { question: "Can clients see my walk-in availability?", answer: "Your hours of operation are displayed prominently. If you use an online booking tool, you can link to it from your site." },
      { question: "Can I list my prices?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), you can add a full price list for cuts, fades, beard trims, and more." },
      { question: "Do I really need a website if I have Instagram?", answer: "Instagram is great for showcasing your work, but it doesn't rank in Google searches. A website captures customers searching 'barber shop near me' who aren't on social media." },
    ],
    ["free-salon-website", "free-small-business-website"],
  ),

  "free-nail-salon-website": generateSeoPageConfig(
    "free-nail-salon-website", "Nail Salon", "nail salon", "polished-nails-spa.locosite.io",
    [
      { question: "Can clients see my service menu?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), you can add a full service menu with prices for manicures, pedicures, acrylics, and more." },
      { question: "Will my work photos show up?", answer: "Photos from your Google Maps listing appear automatically. Add your best nail art and salon photos with a Starter plan." },
      { question: "Can I show my reviews?", answer: "Yes — your Google reviews are imported and displayed on your site, helping new clients trust your work before they visit." },
      { question: "Is this better than just having a Google listing?", answer: "Your Google listing is a directory entry. A website gives you a full online presence where you control the message, showcase your best work, and appear professional." },
    ],
    ["free-salon-website", "free-restaurant-website"],
  ),

  "free-auto-repair-website": generateSeoPageConfig(
    "free-auto-repair-website", "Auto Repair Shop", "auto repair shop", "trusty-auto-repair.locosite.io",
    [
      { question: "Why does an auto shop need a website?", answer: "When someone's car breaks down, they search 'auto repair near me' immediately. A website with your reviews, services, and hours builds trust and gets you the call over shops without one." },
      { question: "Can I list all my services?", answer: "Your Google Maps info is imported automatically. With a Starter plan ($9/mo), you can add a full service list — oil changes, brake work, diagnostics, and more." },
      { question: "Will customers see my certifications?", answer: "With a Starter plan, you can add ASE certifications, warranty info, and any brand affiliations to build customer confidence." },
      { question: "How does this help me get more customers?", answer: "Your website is SEO-optimized with your shop name, location, and services. It appears in Google searches alongside your Maps listing, doubling your online presence." },
    ],
    ["free-plumber-website", "free-small-business-website"],
  ),

  "free-hvac-website": generateSeoPageConfig(
    "free-hvac-website", "HVAC", "HVAC business", "coolbreeze-hvac.locosite.io",
    [
      { question: "Why does an HVAC company need a website?", answer: "Florida heat means constant AC demand. When a system fails, homeowners search online immediately. A website with your services, reviews, and phone number gets you the emergency call." },
      { question: "Can I show my service area?", answer: "Your business address is imported from Google Maps. With a Starter plan, you can highlight all the cities and zip codes you serve." },
      { question: "Will it show my licenses?", answer: "With a Starter plan ($9/mo), you can add your contractor license, EPA certifications, and insurance details to build trust with homeowners." },
      { question: "Can customers request service online?", answer: "Your phone number is displayed prominently for immediate calls. With a Starter plan, you can add a service request form." },
    ],
    ["free-electrician-website", "free-plumber-website"],
  ),

  "free-gym-website": generateSeoPageConfig(
    "free-gym-website", "Gym", "gym or fitness center", "iron-peak-fitness.locosite.io",
    [
      { question: "Can I show my class schedule?", answer: "Your hours are imported from Google Maps. With a Starter plan ($9/mo), you can add a full class schedule, trainer bios, and membership info." },
      { question: "Will my gym photos show up?", answer: "Photos from your Google Maps listing are imported automatically — equipment, facilities, and more. Add additional photos with a Starter plan." },
      { question: "Can members sign up online?", answer: "Your site displays contact info for inquiries. If you use a membership platform, you can link to it from your Locosite page." },
      { question: "How is this different from a Facebook page?", answer: "Facebook limits who sees your posts and clutters your page with ads. A website is your professional presence that ranks in Google when people search 'gyms near me.'" },
    ],
    ["free-small-business-website", "free-salon-website"],
  ),

  "free-coffee-shop-website": generateSeoPageConfig(
    "free-coffee-shop-website", "Coffee Shop", "coffee shop", "morning-ritual-coffee.locosite.io",
    [
      { question: "Can I show my menu?", answer: "Your basic info from Google Maps is imported. With a Starter plan ($9/mo), you can add your full drink menu, food items, and daily specials." },
      { question: "Will it help people find my shop?", answer: "Your website is SEO-optimized with your location and hours, helping you appear in 'coffee shop near me' searches alongside your Google listing." },
      { question: "Can I promote events or live music?", answer: "With a Starter plan, you can update your site with upcoming events, seasonal drinks, and special promotions." },
      { question: "Do I need a website if I already have Yelp?", answer: "Yelp and Google listings are directory entries you don't fully control. A website gives you a professional presence where you tell your story without competitor ads." },
    ],
    ["free-bakery-website", "free-restaurant-website"],
  ),

  "free-bakery-website": generateSeoPageConfig(
    "free-bakery-website", "Bakery", "bakery", "golden-crust-bakery.locosite.io",
    [
      { question: "Can I show my baked goods?", answer: "Photos from your Google Maps listing are imported automatically. With a Starter plan ($9/mo), you can add a full gallery of your breads, cakes, and pastries." },
      { question: "Can customers place custom orders?", answer: "Your phone number is displayed prominently for order calls. With a Starter plan, you can add an order form or link to your ordering system." },
      { question: "Will it show my hours and location?", answer: "Yes — your address, phone number, and hours of operation are imported directly from your Google Maps listing and displayed prominently." },
      { question: "Can I add catering information?", answer: "With a Starter plan ($9/mo), you can add catering menus, pricing, and minimum order details to attract corporate and event orders." },
    ],
    ["free-coffee-shop-website", "free-restaurant-website"],
  ),

  "free-landscaping-website": generateSeoPageConfig(
    "free-landscaping-website", "Landscaping", "landscaping business", "greenscape-pros.locosite.io",
    [
      { question: "Can I show before-and-after photos?", answer: "Photos from your Google Maps listing are imported. With a Starter plan ($9/mo), you can add a portfolio with before-and-after project photos." },
      { question: "Will it show my service area?", answer: "Your business address is displayed from Google Maps. You can specify your full service area with a Starter plan." },
      { question: "Can customers get quotes?", answer: "Your phone number is displayed prominently. With a Starter plan, you can add a quote request form with project details." },
      { question: "Why do I need a website as a landscaper?", answer: "Homeowners search online before hiring. A professional website with your work photos and reviews builds trust and separates you from unlicensed competitors." },
    ],
    ["free-plumber-website", "free-small-business-website"],
  ),

  "free-cleaning-service-website": generateSeoPageConfig(
    "free-cleaning-service-website", "Cleaning Service", "cleaning service", "sparkle-clean-co.locosite.io",
    [
      { question: "Can I list my cleaning packages?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), you can add cleaning packages, pricing tiers, and a service area map." },
      { question: "Will my reviews show up?", answer: "Yes — your Google reviews are imported and displayed, which is critical for cleaning services where trust is everything." },
      { question: "Can customers book cleanings online?", answer: "Your phone number is displayed for booking calls. With a Starter plan, you can add a booking form or link to your scheduling tool." },
      { question: "Is this worth it for a small cleaning business?", answer: "Absolutely. Most cleaning companies get found through Google searches. A professional website helps you stand out from competitors and look established." },
    ],
    ["free-small-business-website", "free-plumber-website"],
  ),

  "free-veterinarian-website": generateSeoPageConfig(
    "free-veterinarian-website", "Veterinarian", "veterinary practice", "paws-claws-vet.locosite.io",
    [
      { question: "Can I list my veterinary services?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), you can add a full list of services, accepted pet types, and emergency info." },
      { question: "Will pet owners see my reviews?", answer: "Yes — Google reviews from pet owners are imported and displayed, helping new clients trust your practice." },
      { question: "Can I link to my online pharmacy?", answer: "With a Starter plan, you can add links to your online pharmacy, appointment booking, and patient portal." },
      { question: "Do vet clinics really need websites?", answer: "When a pet gets sick, owners Google 'vet near me' immediately. A website with your hours, emergency info, and reviews gets you chosen over clinics without one." },
    ],
    ["free-dentist-website", "free-small-business-website"],
  ),

  "free-chiropractor-website": generateSeoPageConfig(
    "free-chiropractor-website", "Chiropractor", "chiropractic practice", "align-chiropractic.locosite.io",
    [
      { question: "Can I describe my treatment methods?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), you can add detailed descriptions of your techniques, conditions treated, and patient resources." },
      { question: "Will it help attract new patients?", answer: "Your website is SEO-optimized for searches like 'chiropractor near me.' Combined with your Google reviews, it builds trust and drives new patient calls." },
      { question: "Can patients see my credentials?", answer: "With a Starter plan, you can add your education, certifications, specializations, and years of experience." },
      { question: "How does this compare to a directory listing?", answer: "Directory listings compete with other chiropractors on the same page. Your own website lets you control the message and showcase what makes your practice unique." },
    ],
    ["free-dentist-website", "free-small-business-website"],
  ),

  "free-dry-cleaner-website": generateSeoPageConfig(
    "free-dry-cleaner-website", "Dry Cleaner", "dry cleaning business", "prestige-dry-cleaners.locosite.io",
    [
      { question: "Can I list my services and prices?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), you can add a full service menu with prices for dry cleaning, alterations, and specialty items." },
      { question: "Will customers see my hours?", answer: "Yes — your hours, location, and phone number are imported directly from your Google Maps listing and displayed prominently." },
      { question: "Can I promote pickup and delivery?", answer: "With a Starter plan, you can highlight pickup/delivery service, coverage area, and scheduling options." },
      { question: "Why would a dry cleaner need a website?", answer: "People searching 'dry cleaner near me' choose businesses that look established. A professional website with reviews and service info gets you picked over the competition." },
    ],
    ["free-small-business-website", "free-salon-website"],
  ),

  "free-tattoo-shop-website": generateSeoPageConfig(
    "free-tattoo-shop-website", "Tattoo Shop", "tattoo shop", "black-ink-studio.locosite.io",
    [
      { question: "Can I show my artists' portfolios?", answer: "Photos from your Google Maps listing are imported. With a Starter plan ($9/mo), you can create a full gallery organized by artist and style." },
      { question: "Can clients book consultations?", answer: "Your phone number and location are displayed for walk-ins and calls. With a Starter plan, add a consultation form or link to your booking system." },
      { question: "Will it show my shop's reviews?", answer: "Yes — Google reviews are imported and displayed prominently. Great reviews are the #1 factor for tattoo shops since clients need to trust the artist." },
      { question: "Is Instagram enough for a tattoo shop?", answer: "Instagram showcases your work but doesn't rank in Google searches. A website captures people searching 'tattoo shop near me' who aren't on social media yet." },
    ],
    ["free-barber-shop-website", "free-salon-website"],
  ),

  "free-car-wash-website": generateSeoPageConfig(
    "free-car-wash-website", "Car Wash", "car wash", "diamond-shine-car-wash.locosite.io",
    [
      { question: "Can I list my wash packages?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), you can add your full menu of wash packages with descriptions and pricing." },
      { question: "Can customers see my hours?", answer: "Yes — your hours, location, and phone number are imported and displayed prominently so customers know exactly when to visit." },
      { question: "Can I promote membership plans?", answer: "With a Starter plan, you can highlight unlimited wash memberships, loyalty programs, and fleet pricing." },
      { question: "Why does a car wash need a website?", answer: "When people search 'car wash near me,' a professional website with photos and reviews makes you stand out from basic directory listings." },
    ],
    ["free-auto-repair-website", "free-small-business-website"],
  ),

  "free-pet-grooming-website": generateSeoPageConfig(
    "free-pet-grooming-website", "Pet Grooming", "pet grooming business", "happy-tails-grooming.locosite.io",
    [
      { question: "Can I show my grooming services?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), you can add services, pricing by dog size, and breed-specific offerings." },
      { question: "Will pet photos show up?", answer: "Photos from your Google Maps listing are imported automatically. Showcase your best before-and-after grooming work with a Starter plan." },
      { question: "Can pet owners book online?", answer: "Your phone number is displayed for booking. With a Starter plan, add a booking form or link to your scheduling system." },
      { question: "Do I need a website for a grooming business?", answer: "Pet owners research groomers carefully before trusting someone with their pet. A professional website with reviews and photos builds that trust instantly." },
    ],
    ["free-veterinarian-website", "free-small-business-website"],
  ),

  "free-photographer-website": generateSeoPageConfig(
    "free-photographer-website", "Photographer", "photography business", "captured-moments-studio.locosite.io",
    [
      { question: "Can I show my photography portfolio?", answer: "Photos from your Google Maps listing are imported. With a Starter plan ($9/mo), you can add a full portfolio gallery organized by category — weddings, portraits, events." },
      { question: "Can clients book sessions?", answer: "Your phone number and location are displayed. With a Starter plan, add a contact form for session inquiries and booking." },
      { question: "Will it help me rank on Google?", answer: "Your website is SEO-optimized for searches like 'photographer near me' and '[city] photographer,' helping potential clients find you organically." },
      { question: "Is this enough if I already have a portfolio site?", answer: "Locosite complements your portfolio by adding business credibility — reviews, location, hours, and SEO optimization that pure portfolio sites often lack." },
    ],
    ["free-small-business-website", "free-salon-website"],
  ),

  "free-florist-website": generateSeoPageConfig(
    "free-florist-website", "Florist", "flower shop", "bloom-and-petal.locosite.io",
    [
      { question: "Can customers see my arrangements?", answer: "Photos from your Google Maps listing are imported. With a Starter plan ($9/mo), add a full gallery of bouquets, arrangements, and wedding work." },
      { question: "Can I take orders through the website?", answer: "Your phone number is displayed for phone orders. With a Starter plan, add an order form or link to your delivery service." },
      { question: "Will it help with wedding bookings?", answer: "A professional website with your floral portfolio and reviews helps brides find and trust you. It's far more effective than relying on marketplace listings alone." },
      { question: "Can I promote seasonal specials?", answer: "With a Starter plan ($9/mo), you can update your site with seasonal arrangements, holiday specials, and delivery promotions." },
    ],
    ["free-bakery-website", "free-small-business-website"],
  ),

  "free-roofing-website": generateSeoPageConfig(
    "free-roofing-website", "Roofing", "roofing company", "summit-roofing-co.locosite.io",
    [
      { question: "Why does a roofer need a website?", answer: "Homeowners search online after storm damage or when planning a roof replacement. A website with your license, reviews, and services builds trust for a high-ticket decision." },
      { question: "Can I show my license and insurance?", answer: "With a Starter plan ($9/mo), you can add your contractor license, insurance details, manufacturer certifications, and warranty information." },
      { question: "Will it help me get roofing leads?", answer: "Your website is SEO-optimized for searches like 'roofer near me.' Combined with your Google reviews, it generates organic leads without per-click advertising costs." },
      { question: "Can customers request inspections?", answer: "Your phone number is displayed prominently. With a Starter plan, add a roof inspection request form to capture leads." },
    ],
    ["free-plumber-website", "free-electrician-website"],
  ),

  "free-pest-control-website": generateSeoPageConfig(
    "free-pest-control-website", "Pest Control", "pest control company", "guardian-pest-solutions.locosite.io",
    [
      { question: "Can I list the pests I treat?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), add a full list of pests you treat — termites, roaches, ants, rodents, mosquitoes, and more." },
      { question: "Will it help with emergency calls?", answer: "Your phone number is displayed prominently. When someone has a pest emergency, your website gets you the call over competitors without one." },
      { question: "Can I promote annual service plans?", answer: "With a Starter plan, you can highlight maintenance plans, seasonal treatments, and bundled service packages." },
      { question: "How does this compare to paying for leads?", answer: "Lead services charge per call. Your own website generates free organic leads from Google searches like 'pest control near me' — with no per-lead fees." },
    ],
    ["free-landscaping-website", "free-small-business-website"],
  ),

  "free-handyman-website": generateSeoPageConfig(
    "free-handyman-website", "Handyman", "handyman service", "fixit-right-handyman.locosite.io",
    [
      { question: "Can I list all the services I offer?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), add your full list of services — plumbing, electrical, drywall, painting, assembly, and more." },
      { question: "Will customers see my reviews?", answer: "Yes — Google reviews are imported and displayed. For handymen, reviews are critical because customers need to trust you inside their home." },
      { question: "Do I need a website as a handyman?", answer: "Most handymen rely on word-of-mouth. A website with reviews captures the customers who search online — and there are a lot of them." },
      { question: "Can customers request quotes?", answer: "Your phone number is displayed for quote calls. With a Starter plan, add a quote request form where customers describe their project." },
    ],
    ["free-plumber-website", "free-electrician-website"],
  ),

  "free-pool-service-website": generateSeoPageConfig(
    "free-pool-service-website", "Pool Service", "pool service company", "crystal-pool-care.locosite.io",
    [
      { question: "Can I list my pool services?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), add your full service menu — weekly cleaning, equipment repair, resurfacing, and more." },
      { question: "Will it help attract pool owners?", answer: "Your website is SEO-optimized for searches like 'pool service near me.' In Florida, that's a year-round stream of homeowners looking for help." },
      { question: "Can I promote maintenance plans?", answer: "With a Starter plan, you can highlight weekly and monthly maintenance packages, seasonal openings/closings, and chemical treatment plans." },
      { question: "Why can't I just use Nextdoor?", answer: "Nextdoor is great for neighborhood referrals, but a website captures homeowners actively searching Google — a much larger audience that's ready to hire." },
    ],
    ["free-landscaping-website", "free-pressure-washing-website"],
  ),

  "free-pressure-washing-website": generateSeoPageConfig(
    "free-pressure-washing-website", "Pressure Washing", "pressure washing business", "powerwash-pros.locosite.io",
    [
      { question: "Can I show before-and-after results?", answer: "Photos from your Google Maps listing are imported. With a Starter plan ($9/mo), add dramatic before-and-after photos that sell your service better than words." },
      { question: "Will it help me get more jobs?", answer: "Your website is SEO-optimized for searches like 'pressure washing near me.' Homeowners who find you online are ready to hire." },
      { question: "Can I list my pricing?", answer: "With a Starter plan, you can add service pricing, package deals, and a quote request form for custom jobs." },
      { question: "Do pressure washing businesses need websites?", answer: "Many competitors rely only on Facebook or yard signs. A professional website with reviews immediately sets you apart as a legitimate, trustworthy business." },
    ],
    ["free-pool-service-website", "free-landscaping-website"],
  ),

  "free-tree-service-website": generateSeoPageConfig(
    "free-tree-service-website", "Tree Service", "tree service company", "canopy-tree-experts.locosite.io",
    [
      { question: "Can I show my tree work?", answer: "Photos from your Google Maps listing are imported. With a Starter plan ($9/mo), add project photos — removals, trimming, stump grinding, and emergency storm work." },
      { question: "Will it help with emergency calls?", answer: "Your phone number is displayed prominently. After storms, homeowners search 'tree service near me' — your website puts you first." },
      { question: "Can I show my license and insurance?", answer: "With a Starter plan, add your arborist certification, liability insurance, and worker's comp details — critical for tree work where safety is paramount." },
      { question: "Why do I need a website for tree service?", answer: "Tree work is a trust-based service. Homeowners want to verify you're legitimate before letting someone operate heavy equipment on their property. A website builds that trust." },
    ],
    ["free-landscaping-website", "free-roofing-website"],
  ),

  "free-lawyer-website": generateSeoPageConfig(
    "free-lawyer-website", "Law Firm", "law firm", "rivera-associates.locosite.io",
    [
      { question: "Can I list my practice areas?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), add practice areas, attorney bios, case results, and client testimonials." },
      { question: "Will potential clients find me?", answer: "Your website is SEO-optimized for searches like 'lawyer near me' and specific practice areas. It helps you attract clients searching for legal help in your area." },
      { question: "Is this professional enough for a law firm?", answer: "Yes. Each site is auto-designed with clean, authoritative styling. With a paid plan, you get full control over content and a custom domain like yourfirm.com." },
      { question: "Can clients schedule consultations?", answer: "Your phone number is displayed prominently for calls. With a Starter plan, add a consultation request form to capture leads." },
    ],
    ["free-small-business-website", "free-dentist-website"],
  ),

  "free-accountant-website": generateSeoPageConfig(
    "free-accountant-website", "Accountant", "accounting firm", "truebooks-accounting.locosite.io",
    [
      { question: "Can I list my accounting services?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), add tax prep, bookkeeping, payroll, advisory services, and industry specializations." },
      { question: "Will it help during tax season?", answer: "When people search 'accountant near me' or 'tax preparation [city],' your website appears in results — bringing you clients right when they need help most." },
      { question: "Can clients upload documents?", answer: "Your site displays contact info for client inquiries. For document management, link to your client portal from your Locosite page." },
      { question: "Is this suitable for a CPA firm?", answer: "Yes. The auto-generated design is clean and professional. With a paid plan, add credentials, specializations, and a custom domain for a fully branded experience." },
    ],
    ["free-lawyer-website", "free-small-business-website"],
  ),

  "free-real-estate-agent-website": generateSeoPageConfig(
    "free-real-estate-agent-website", "Real Estate Agent", "real estate business", "keystone-realty-group.locosite.io",
    [
      { question: "Can I show my listings?", answer: "Your basic info is imported from Google Maps. With a Starter plan ($9/mo), add featured listings, neighborhood guides, and links to your MLS search." },
      { question: "Will homebuyers find me online?", answer: "Your website is SEO-optimized for searches like 'real estate agent near me' and '[city] homes for sale,' driving organic traffic from motivated buyers and sellers." },
      { question: "Can I add my agent credentials?", answer: "With a Starter plan, add your license number, designations (CRS, ABR, etc.), years of experience, and areas of specialization." },
      { question: "How does this compare to Zillow?", answer: "Zillow distributes your leads to multiple agents. Your own website gives you a direct relationship with clients — no shared leads, no competing agents on the same page." },
    ],
    ["free-lawyer-website", "free-small-business-website"],
  ),
};

export const allSeoPageSlugs = Object.keys(seoPages);
