import { SectionVariation, SectionCategory } from "../types/simple-builder";

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Hero Section Variations
export const heroVariations: SectionVariation[] = [
  {
    id: "hero-center-bg",
    name: "Center Hero with Background",
    description: "Full-width hero with centered content and background image",
    category: "hero",
    template: {
      id: generateId(),
      type: "hero-section",
      content: {
        title: "Welcome to Your Business",
        subtitle: "Your trusted partner for quality services",
        ctaText: "Get Started",
        ctaLink: "#contact",
        backgroundImage: "/api/placeholder/1920/800",
        overlay: true,
        overlayOpacity: 0.5,
      },
      style: {
        textAlign: "center",
        padding: "6rem 2rem",
      },
    },
    editableFields: [
      "content.title",
      "content.subtitle",
      "content.ctaText",
      "content.backgroundImage",
    ],
  },
  {
    id: "hero-split-screen",
    name: "Split Screen Hero",
    description: "Hero with content on left and image on right",
    category: "hero",
    template: {
      id: generateId(),
      type: "hero-split",
      content: {
        title: "Welcome to Your Business",
        subtitle: "Experience excellence in every service we provide",
        ctaText: "Contact Us",
        ctaLink: "#contact",
        image: "/api/placeholder/800/600",
        imageAlt: "Hero image",
      },
      style: {
        padding: "0",
      },
    },
    editableFields: [
      "content.title",
      "content.subtitle",
      "content.ctaText",
      "content.image",
    ],
  },
  {
    id: "hero-minimal",
    name: "Minimal Text Hero",
    description: "Simple hero with text and call-to-action",
    category: "hero",
    template: {
      id: generateId(),
      type: "hero-minimal",
      content: {
        title: "Your Business Name",
        subtitle: "Quality service you can trust",
        ctaText: "Learn More",
        ctaLink: "#about",
      },
      style: {
        textAlign: "center",
        padding: "6rem 2rem",
        backgroundColor: "#f5f5f5",
      },
    },
    editableFields: ["content.title", "content.subtitle", "content.ctaText"],
  },
];

// About Section Variations
export const aboutVariations: SectionVariation[] = [
  {
    id: "about-text-image",
    name: "Text with Side Image",
    description: "About section with text content and accompanying image",
    category: "about",
    template: {
      id: generateId(),
      type: "about-section",
      content: {
        title: "About Us",
        content:
          "We are dedicated to providing exceptional service to our community. With years of experience and a commitment to excellence, we've built a reputation for quality and reliability.",
        image: "/api/placeholder/600/400",
        imagePosition: "right",
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.content", "content.image"],
  },
  {
    id: "about-two-column",
    name: "Two Column Text",
    description: "About section with two columns of text",
    category: "about",
    template: {
      id: generateId(),
      type: "about-columns",
      content: {
        title: "Our Story",
        column1:
          "Founded with a vision to deliver exceptional service, we have grown from humble beginnings to become a trusted name in our industry. Our journey began with a simple belief: quality and customer satisfaction should never be compromised.",
        column2:
          "Today, we continue to uphold these values while embracing innovation and growth. Our team of dedicated professionals works tirelessly to ensure every client receives the attention and service they deserve.",
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.column1", "content.column2"],
  },
  {
    id: "about-timeline",
    name: "Timeline Story",
    description: "About section with timeline format",
    category: "about",
    template: {
      id: generateId(),
      type: "about-timeline",
      content: {
        title: "Our Journey",
        timeline: [
          {
            year: "2015",
            title: "Founded",
            description: "Started with a vision to serve our community",
          },
          {
            year: "2018",
            title: "Expansion",
            description: "Grew our team and services",
          },
          {
            year: "2021",
            title: "Recognition",
            description: "Awarded for excellence in service",
          },
          {
            year: "2024",
            title: "Today",
            description: "Continuing to innovate and serve",
          },
        ],
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.timeline"],
  },
];

// Services Section Variations
export const servicesVariations: SectionVariation[] = [
  {
    id: "services-3-column",
    name: "3-Column Service Cards",
    description: "Services displayed in three column grid",
    category: "services",
    template: {
      id: generateId(),
      type: "services-grid",
      content: {
        title: "Our Services",
        services: [
          {
            title: "Service One",
            description: "Professional service with attention to detail",
            icon: "star",
          },
          {
            title: "Service Two",
            description: "Quality solutions tailored to your needs",
            icon: "check",
          },
          {
            title: "Service Three",
            description: "Reliable and efficient service delivery",
            icon: "heart",
          },
        ],
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.services"],
  },
  {
    id: "services-list-icons",
    name: "Service List with Icons",
    description: "Services in a list format with icons",
    category: "services",
    template: {
      id: generateId(),
      type: "services-list",
      content: {
        title: "What We Offer",
        services: [
          {
            title: "Professional Consultation",
            description: "Expert advice tailored to your specific needs",
            icon: "users",
            features: [
              "Free initial consultation",
              "Personalized recommendations",
              "Follow-up support",
            ],
          },
          {
            title: "Quality Implementation",
            description: "Skilled execution with attention to detail",
            icon: "settings",
            features: [
              "Professional team",
              "Quality materials",
              "Timely completion",
            ],
          },
          {
            title: "Ongoing Support",
            description: "Continued assistance after project completion",
            icon: "headphones",
            features: [
              "24/7 support",
              "Regular maintenance",
              "Satisfaction guarantee",
            ],
          },
        ],
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.services"],
  },
  {
    id: "services-pricing-table",
    name: "Pricing Table Layout",
    description: "Services with pricing information",
    category: "services",
    template: {
      id: generateId(),
      type: "services-pricing",
      content: {
        title: "Our Pricing",
        pricingTiers: [
          {
            name: "Basic",
            price: "$99",
            description: "Essential features included",
            features: ["Feature 1", "Feature 2", "Feature 3"],
          },
          {
            name: "Premium",
            price: "$199",
            description: "Advanced features and priority support",
            features: [
              "All Basic features",
              "Feature 4",
              "Feature 5",
              "Priority support",
            ],
          },
          {
            name: "Custom",
            price: "Contact Us",
            description: "Tailored to your specific needs",
            features: [
              "All Premium features",
              "Custom solutions",
              "Dedicated support",
            ],
          },
        ],
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.pricingTiers"],
  },
];

// Gallery Section Variations
export const galleryVariations: SectionVariation[] = [
  {
    id: "gallery-grid",
    name: "Grid Gallery",
    description: "Images in a responsive grid layout",
    category: "gallery",
    template: {
      id: generateId(),
      type: "gallery-grid",
      content: {
        title: "Our Work",
        images: [
          { src: "/api/placeholder/400/300", alt: "Gallery image 1" },
          { src: "/api/placeholder/400/300", alt: "Gallery image 2" },
          { src: "/api/placeholder/400/300", alt: "Gallery image 3" },
          { src: "/api/placeholder/400/300", alt: "Gallery image 4" },
          { src: "/api/placeholder/400/300", alt: "Gallery image 5" },
          { src: "/api/placeholder/400/300", alt: "Gallery image 6" },
        ],
        columns: 3,
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.images"],
  },
  {
    id: "gallery-masonry",
    name: "Masonry Gallery",
    description: "Pinterest-style masonry layout",
    category: "gallery",
    template: {
      id: generateId(),
      type: "gallery-masonry",
      content: {
        title: "Portfolio",
        images: [
          { src: "/api/placeholder/400/500", alt: "Gallery image 1" },
          { src: "/api/placeholder/400/300", alt: "Gallery image 2" },
          { src: "/api/placeholder/400/400", alt: "Gallery image 3" },
          { src: "/api/placeholder/400/600", alt: "Gallery image 4" },
          { src: "/api/placeholder/400/350", alt: "Gallery image 5" },
          { src: "/api/placeholder/400/450", alt: "Gallery image 6" },
        ],
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.images"],
  },
  {
    id: "gallery-before-after",
    name: "Before/After Gallery",
    description: "Comparison slider for before and after images",
    category: "gallery",
    template: {
      id: generateId(),
      type: "gallery-before-after",
      content: {
        title: "Our Transformations",
        comparisons: [
          {
            before: { src: "/api/placeholder/600/400", alt: "Before" },
            after: { src: "/api/placeholder/600/400", alt: "After" },
            title: "Project One",
          },
          {
            before: { src: "/api/placeholder/600/400", alt: "Before" },
            after: { src: "/api/placeholder/600/400", alt: "After" },
            title: "Project Two",
          },
        ],
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.comparisons"],
  },
];

// Contact Section Variations
export const contactVariations: SectionVariation[] = [
  {
    id: "contact-form-map",
    name: "Contact Form with Map",
    description: "Contact form alongside location map",
    category: "contact",
    template: {
      id: generateId(),
      type: "contact-form-map",
      content: {
        title: "Get In Touch",
        showForm: true,
        showMap: true,
        showInfo: true,
        address: "123 Main Street, City, State 12345",
        phone: "(555) 123-4567",
        email: "info@business.com",
        hours: "Mon-Fri: 9AM-5PM",
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: [
      "content.title",
      "content.address",
      "content.phone",
      "content.email",
      "content.hours",
    ],
  },
  {
    id: "contact-info-cards",
    name: "Contact Info Cards",
    description: "Contact information in card layout",
    category: "contact",
    template: {
      id: generateId(),
      type: "contact-cards",
      content: {
        title: "Contact Us",
        cards: [
          {
            icon: "map-pin",
            title: "Visit Us",
            info: "123 Main Street, City, State 12345",
          },
          {
            icon: "phone",
            title: "Call Us",
            info: "(555) 123-4567",
          },
          {
            icon: "mail",
            title: "Email Us",
            info: "info@business.com",
          },
        ],
      },
      style: {
        padding: "4rem 2rem",
      },
    },
    editableFields: ["content.title", "content.cards"],
  },
  {
    id: "contact-social-focus",
    name: "Social Links Focus",
    description: "Contact section emphasizing social media",
    category: "contact",
    template: {
      id: generateId(),
      type: "contact-social",
      content: {
        title: "Connect With Us",
        subtitle: "Follow us on social media for updates and news",
        socialLinks: [
          { platform: "facebook", url: "#" },
          { platform: "instagram", url: "#" },
          { platform: "twitter", url: "#" },
          { platform: "linkedin", url: "#" },
        ],
      },
      style: {
        padding: "4rem 2rem",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      },
    },
    editableFields: [
      "content.title",
      "content.subtitle",
      "content.socialLinks",
    ],
  },
];

// Export all variations
export const allSectionVariations: SectionVariation[] = [
  ...heroVariations,
  ...aboutVariations,
  ...servicesVariations,
  ...galleryVariations,
  ...contactVariations,
];

// Helper function to get variations by category
export const getVariationsByCategory = (
  category: SectionCategory,
): SectionVariation[] => {
  return allSectionVariations.filter(
    (variation) => variation.category === category,
  );
};

// Helper function to get variation by ID
export const getVariationById = (id: string): SectionVariation | undefined => {
  return allSectionVariations.find((variation) => variation.id === id);
};
