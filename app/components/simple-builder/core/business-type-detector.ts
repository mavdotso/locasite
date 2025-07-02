interface BusinessTypeKeywords {
  type: string;
  keywords: string[];
  themeId: string;
  suggestedSections: string[];
}

const businessTypeKeywords: BusinessTypeKeywords[] = [
  {
    type: "restaurant",
    keywords: [
      "restaurant",
      "cafe",
      "bistro",
      "diner",
      "eatery",
      "food",
      "dining",
      "cuisine",
      "menu",
      "chef",
      "kitchen",
      "bar",
      "grill",
      "pizza",
      "sushi",
      "bakery",
      "coffee",
    ],
    themeId: "restaurant-cafe",
    suggestedSections: [
      "hero-center-bg",
      "about-text-image",
      "services-carousel",
      "gallery-masonry",
      "reviews-grid",
      "contact-split",
    ],
  },
  {
    type: "medical",
    keywords: [
      "medical",
      "doctor",
      "clinic",
      "hospital",
      "health",
      "healthcare",
      "dental",
      "dentist",
      "physician",
      "surgery",
      "patient",
      "care",
      "treatment",
      "therapy",
      "wellness",
    ],
    themeId: "medical-healthcare",
    suggestedSections: [
      "hero-minimal",
      "about-features",
      "services-list-icons",
      "team-grid",
      "contact-form",
    ],
  },
  {
    type: "beauty",
    keywords: [
      "beauty",
      "salon",
      "spa",
      "hair",
      "nail",
      "makeup",
      "cosmetic",
      "aesthetic",
      "skincare",
      "massage",
      "wellness",
      "treatment",
      "facial",
      "styling",
      "barber",
    ],
    themeId: "beauty-salon-spa",
    suggestedSections: [
      "hero-split-screen",
      "about-text-image",
      "services-3-column",
      "gallery-grid",
      "reviews-carousel",
      "contact-centered",
    ],
  },
  {
    type: "fitness",
    keywords: [
      "gym",
      "fitness",
      "workout",
      "training",
      "exercise",
      "health",
      "wellness",
      "yoga",
      "pilates",
      "crossfit",
      "personal trainer",
      "sports",
      "athletic",
      "muscle",
      "strength",
    ],
    themeId: "gym-fitness",
    suggestedSections: [
      "hero-gradient-bg",
      "about-features",
      "services-grid",
      "team-carousel",
      "gallery-masonry",
      "contact-split",
    ],
  },
  {
    type: "professional",
    keywords: [
      "consulting",
      "law",
      "legal",
      "accounting",
      "finance",
      "insurance",
      "real estate",
      "agency",
      "firm",
      "office",
      "professional",
      "service",
      "advisory",
      "management",
    ],
    themeId: "professional-corporate",
    suggestedSections: [
      "hero-minimal",
      "about-two-column",
      "services-list-icons",
      "team-grid",
      "contact-form",
    ],
  },
  {
    type: "retail",
    keywords: [
      "shop",
      "store",
      "retail",
      "boutique",
      "fashion",
      "clothing",
      "accessories",
      "jewelry",
      "gift",
      "market",
      "shopping",
      "merchandise",
      "product",
      "sale",
    ],
    themeId: "bold-playful",
    suggestedSections: [
      "hero-split-screen",
      "about-text-image",
      "services-carousel",
      "gallery-grid",
      "reviews-grid",
      "contact-centered",
    ],
  },
  {
    type: "automotive",
    keywords: [
      "auto",
      "car",
      "vehicle",
      "repair",
      "mechanic",
      "garage",
      "service",
      "tire",
      "oil",
      "brake",
      "engine",
      "automotive",
      "dealership",
      "parts",
      "detailing",
    ],
    themeId: "automotive-repair",
    suggestedSections: [
      "hero-center-bg",
      "about-features",
      "services-3-column",
      "gallery-masonry",
      "reviews-list",
      "contact-split",
    ],
  },
];

export function detectBusinessType(
  businessName: string,
  businessDescription?: string,
): BusinessTypeKeywords | null {
  const searchText =
    `${businessName} ${businessDescription || ""}`.toLowerCase();

  let bestMatch: BusinessTypeKeywords | null = null;
  let highestScore = 0;

  for (const businessType of businessTypeKeywords) {
    let score = 0;

    for (const keyword of businessType.keywords) {
      if (searchText.includes(keyword)) {
        score += keyword.length; // Longer keywords get higher scores
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = businessType;
    }
  }

  return highestScore > 0 ? bestMatch : null;
}

export function getThemeRecommendations(businessType: string | null) {
  if (!businessType) {
    return {
      primary: ["modern-minimal", "professional-corporate", "bold-playful"],
      secondary: ["elegant-luxury", "restaurant-cafe"],
    };
  }

  const typeMatch = businessTypeKeywords.find((bt) => bt.type === businessType);
  if (!typeMatch) {
    return {
      primary: ["modern-minimal", "professional-corporate"],
      secondary: ["bold-playful", "elegant-luxury"],
    };
  }

  // Return the matched theme as primary, and some alternatives
  const allThemes = [
    "modern-minimal",
    "bold-playful",
    "professional-corporate",
    "elegant-luxury",
    "restaurant-cafe",
    "beauty-salon-spa",
    "gym-fitness",
    "medical-healthcare",
    "automotive-repair",
  ];

  const primary = [typeMatch.themeId];
  const secondary = allThemes
    .filter((theme) => theme !== typeMatch.themeId)
    .slice(0, 3);

  return { primary, secondary };
}

export function getSectionRecommendations(
  businessType: string | null,
): string[] {
  if (!businessType) {
    return [
      "hero-center-bg",
      "about-text-image",
      "services-3-column",
      "gallery-grid",
      "reviews-grid",
      "contact-split",
    ];
  }

  const typeMatch = businessTypeKeywords.find((bt) => bt.type === businessType);
  return typeMatch
    ? typeMatch.suggestedSections
    : [
        "hero-center-bg",
        "about-text-image",
        "services-3-column",
        "contact-split",
      ];
}

export function generateBusinessContent(
  businessType: string,
  businessName: string,
) {
  const templates = {
    restaurant: {
      hero: {
        title: `Welcome to ${businessName}`,
        subtitle:
          "Experience exceptional dining in a warm, inviting atmosphere",
        ctaText: "View Menu",
        ctaLink: "#menu",
        secondaryCtaText: "Book a Table",
        secondaryCtaLink: "#reservations",
      },
      about: {
        title: "Our Story",
        content: `At ${businessName}, we believe in creating memorable dining experiences through fresh ingredients, innovative recipes, and warm hospitality. Our passion for food brings people together.`,
      },
      services: {
        title: "What We Offer",
        items: [
          {
            title: "Fine Dining",
            description: "Exquisite dishes crafted by our expert chefs",
            icon: "🍽️",
          },
          {
            title: "Private Events",
            description: "Perfect venue for your special occasions",
            icon: "🎉",
          },
          {
            title: "Catering",
            description: "Bringing our cuisine to your location",
            icon: "🚚",
          },
        ],
      },
    },
    medical: {
      hero: {
        title: `${businessName} - Your Health Partner`,
        subtitle: "Providing compassionate, comprehensive healthcare services",
        ctaText: "Book Appointment",
        ctaLink: "#appointment",
        secondaryCtaText: "Our Services",
        secondaryCtaLink: "#services",
      },
      about: {
        title: "Committed to Your Health",
        content: `${businessName} is dedicated to providing exceptional medical care with a personal touch. Our experienced team uses the latest medical technology to ensure the best outcomes for our patients.`,
      },
      services: {
        title: "Our Services",
        items: [
          {
            title: "General Practice",
            description: "Comprehensive primary healthcare services",
            icon: "🏥",
          },
          {
            title: "Preventive Care",
            description: "Health screenings and wellness programs",
            icon: "🛡️",
          },
          {
            title: "Specialized Treatment",
            description: "Expert care for specific conditions",
            icon: "⚕️",
          },
        ],
      },
    },
    beauty: {
      hero: {
        title: `${businessName}`,
        subtitle: "Where beauty meets relaxation",
        ctaText: "Book Now",
        ctaLink: "#booking",
        secondaryCtaText: "View Services",
        secondaryCtaLink: "#services",
      },
      about: {
        title: "Your Beauty Destination",
        content: `Welcome to ${businessName}, where we combine expertise with luxury to create your perfect beauty experience. Our skilled professionals are dedicated to helping you look and feel your best.`,
      },
      services: {
        title: "Our Services",
        items: [
          {
            title: "Hair Services",
            description: "Cut, color, and styling by expert stylists",
            icon: "💇",
          },
          {
            title: "Spa Treatments",
            description: "Relaxing facials and body treatments",
            icon: "🧖",
          },
          {
            title: "Nail Care",
            description: "Manicures and pedicures with premium products",
            icon: "💅",
          },
        ],
      },
    },
    fitness: {
      hero: {
        title: `Transform Your Life at ${businessName}`,
        subtitle: "Your journey to fitness starts here",
        ctaText: "Start Free Trial",
        ctaLink: "#trial",
        secondaryCtaText: "View Classes",
        secondaryCtaLink: "#classes",
      },
      about: {
        title: "Achieve Your Goals",
        content: `${businessName} is more than a gym - it's a community dedicated to helping you reach your fitness potential. With state-of-the-art equipment and expert trainers, we're here to support your journey.`,
      },
      services: {
        title: "What We Offer",
        items: [
          {
            title: "Personal Training",
            description: "One-on-one coaching for maximum results",
            icon: "💪",
          },
          {
            title: "Group Classes",
            description: "Fun, motivating classes for all levels",
            icon: "🏃",
          },
          {
            title: "Nutrition Guidance",
            description: "Personalized meal plans and advice",
            icon: "🥗",
          },
        ],
      },
    },
    professional: {
      hero: {
        title: `${businessName}`,
        subtitle: "Professional solutions for your business needs",
        ctaText: "Get Consultation",
        ctaLink: "#consultation",
        secondaryCtaText: "Learn More",
        secondaryCtaLink: "#about",
      },
      about: {
        title: "Excellence in Service",
        content: `${businessName} provides expert professional services with integrity and dedication. Our team brings years of experience to deliver solutions that drive your success.`,
      },
      services: {
        title: "Our Services",
        items: [
          {
            title: "Consulting",
            description: "Strategic advice for business growth",
            icon: "📊",
          },
          {
            title: "Implementation",
            description: "Turning strategies into results",
            icon: "⚙️",
          },
          {
            title: "Support",
            description: "Ongoing assistance for continued success",
            icon: "🤝",
          },
        ],
      },
    },
    retail: {
      hero: {
        title: `Discover ${businessName}`,
        subtitle: "Unique finds for every style",
        ctaText: "Shop Now",
        ctaLink: "#shop",
        secondaryCtaText: "New Arrivals",
        secondaryCtaLink: "#new",
      },
      about: {
        title: "Curated with Care",
        content: `${businessName} brings you carefully selected products that combine quality, style, and value. We're passionate about helping you find exactly what you're looking for.`,
      },
      services: {
        title: "Why Shop With Us",
        items: [
          {
            title: "Unique Selection",
            description: "Handpicked items you won't find elsewhere",
            icon: "🛍️",
          },
          {
            title: "Personal Service",
            description: "Expert advice and styling assistance",
            icon: "👗",
          },
          {
            title: "Easy Returns",
            description: "Shop with confidence - hassle-free returns",
            icon: "↩️",
          },
        ],
      },
    },
  };

  const defaultTemplate = templates.professional;
  return templates[businessType as keyof typeof templates] || defaultTemplate;
}
