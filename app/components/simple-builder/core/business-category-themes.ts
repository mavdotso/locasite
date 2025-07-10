export interface CategoryTheme {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundGradient?: string;
    cardBackground: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    iconBackground: string;
    overlayGradient?: string;
  };
  decorativeElements: {
    pattern?: "dots" | "waves" | "circles" | "lines" | "shapes";
    icon?: string;
    animation?: "float" | "pulse" | "slide" | "rotate";
  };
  sectionStyles: {
    hero: {
      overlayOpacity: number;
      textAlign: "left" | "center" | "right";
      decorativeElement?: "dots" | "waves" | "circles" | "lines" | "shapes";
    };
    services: {
      cardStyle: "minimal" | "bordered" | "elevated" | "gradient";
      iconStyle: "rounded" | "square" | "circle";
      hoverEffect: "scale" | "shadow" | "glow" | "tilt";
    };
    gallery: {
      borderRadius: string;
      hoverEffect: "zoom" | "overlay" | "slide";
      spacing: string;
    };
    reviews: {
      cardStyle: "minimal" | "quote" | "bubble" | "elegant";
      starColor: string;
    };
    contact: {
      formStyle: "minimal" | "bordered" | "floating";
      buttonStyle: "rounded" | "square" | "pill";
    };
  };
}

export const businessCategoryThemes: Record<string, CategoryTheme> = {
  // Food & Dining
  restaurant: {
    name: "Restaurant & Dining",
    description: "Warm, inviting colors that stimulate appetite",
    colors: {
      primary: "#d97706", // Warm amber
      secondary: "#92400e", // Deep brown
      accent: "#ea580c", // Orange
      background: "#fffbf5", // Warm cream
      backgroundGradient: "linear-gradient(135deg, #fffbf5 0%, #fef3c7 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#fed7aa",
      textPrimary: "#451a03",
      textSecondary: "#78350f",
      iconBackground: "#fef3c7",
      overlayGradient:
        "linear-gradient(180deg, rgba(217,119,6,0.8) 0%, rgba(146,64,14,0.9) 100%)",
    },
    decorativeElements: {
      pattern: "waves",
      icon: "🍽️",
      animation: "float",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.4,
        textAlign: "center",
        decorativeElement: "waves",
      },
      services: {
        cardStyle: "elevated",
        iconStyle: "rounded",
        hoverEffect: "scale",
      },
      gallery: {
        borderRadius: "1rem",
        hoverEffect: "zoom",
        spacing: "1.5rem",
      },
      reviews: {
        cardStyle: "quote",
        starColor: "#fbbf24",
      },
      contact: {
        formStyle: "bordered",
        buttonStyle: "rounded",
      },
    },
  },

  // Beauty & Wellness
  beauty_salon: {
    name: "Beauty & Wellness",
    description: "Elegant, soft colors for beauty businesses",
    colors: {
      primary: "#db2777", // Pink
      secondary: "#fbbf24", // Gold
      accent: "#f472b6", // Light pink
      background: "#fdf2f8", // Very light pink
      backgroundGradient: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#fbcfe8",
      textPrimary: "#500724",
      textSecondary: "#9f1239",
      iconBackground: "#fce7f3",
      overlayGradient:
        "linear-gradient(180deg, rgba(219,39,119,0.7) 0%, rgba(244,114,182,0.8) 100%)",
    },
    decorativeElements: {
      pattern: "circles",
      icon: "💅",
      animation: "pulse",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.3,
        textAlign: "center",
        decorativeElement: "circles",
      },
      services: {
        cardStyle: "gradient",
        iconStyle: "circle",
        hoverEffect: "glow",
      },
      gallery: {
        borderRadius: "1.5rem",
        hoverEffect: "overlay",
        spacing: "1rem",
      },
      reviews: {
        cardStyle: "elegant",
        starColor: "#f472b6",
      },
      contact: {
        formStyle: "floating",
        buttonStyle: "pill",
      },
    },
  },

  // Healthcare
  medical: {
    name: "Medical & Healthcare",
    description: "Clean, professional colors for healthcare",
    colors: {
      primary: "#0891b2", // Cyan
      secondary: "#0e7490", // Dark cyan
      accent: "#06b6d4", // Bright cyan
      background: "#f0fdfa", // Very light cyan
      backgroundGradient: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#bae6fd",
      textPrimary: "#083344",
      textSecondary: "#0c4a6e",
      iconBackground: "#e0f2fe",
      overlayGradient:
        "linear-gradient(180deg, rgba(8,145,178,0.8) 0%, rgba(14,116,144,0.9) 100%)",
    },
    decorativeElements: {
      pattern: "lines",
      icon: "🏥",
      animation: "slide",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.2,
        textAlign: "left",
        decorativeElement: undefined,
      },
      services: {
        cardStyle: "bordered",
        iconStyle: "square",
        hoverEffect: "shadow",
      },
      gallery: {
        borderRadius: "0.5rem",
        hoverEffect: "slide",
        spacing: "1.5rem",
      },
      reviews: {
        cardStyle: "minimal",
        starColor: "#0891b2",
      },
      contact: {
        formStyle: "minimal",
        buttonStyle: "square",
      },
    },
  },

  // Fitness & Sports
  gym: {
    name: "Fitness & Sports",
    description: "Bold, energetic colors for fitness businesses",
    colors: {
      primary: "#ef4444", // Red
      secondary: "#171717", // Near black
      accent: "#f59e0b", // Amber
      background: "#fafafa",
      backgroundGradient: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#e5e5e5",
      textPrimary: "#171717",
      textSecondary: "#525252",
      iconBackground: "#fee2e2",
      overlayGradient:
        "linear-gradient(180deg, rgba(239,68,68,0.9) 0%, rgba(23,23,23,0.95) 100%)",
    },
    decorativeElements: {
      pattern: "shapes",
      icon: "💪",
      animation: "pulse",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.7,
        textAlign: "center",
        decorativeElement: "shapes",
      },
      services: {
        cardStyle: "elevated",
        iconStyle: "square",
        hoverEffect: "tilt",
      },
      gallery: {
        borderRadius: "0.25rem",
        hoverEffect: "zoom",
        spacing: "1rem",
      },
      reviews: {
        cardStyle: "bubble",
        starColor: "#ef4444",
      },
      contact: {
        formStyle: "bordered",
        buttonStyle: "square",
      },
    },
  },

  // Automotive
  car_repair: {
    name: "Automotive Services",
    description: "Strong, industrial colors for automotive businesses",
    colors: {
      primary: "#0284c7", // Blue
      secondary: "#475569", // Slate
      accent: "#f59e0b", // Amber
      background: "#f8fafc",
      backgroundGradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#cbd5e1",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      iconBackground: "#dbeafe",
      overlayGradient:
        "linear-gradient(180deg, rgba(2,132,199,0.85) 0%, rgba(71,85,105,0.9) 100%)",
    },
    decorativeElements: {
      pattern: "lines",
      icon: "🔧",
      animation: "rotate",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.5,
        textAlign: "left",
        decorativeElement: "lines",
      },
      services: {
        cardStyle: "bordered",
        iconStyle: "square",
        hoverEffect: "shadow",
      },
      gallery: {
        borderRadius: "0.5rem",
        hoverEffect: "slide",
        spacing: "1.5rem",
      },
      reviews: {
        cardStyle: "minimal",
        starColor: "#f59e0b",
      },
      contact: {
        formStyle: "bordered",
        buttonStyle: "square",
      },
    },
  },

  // Professional Services
  professional: {
    name: "Professional Services",
    description: "Trustworthy, corporate colors for professional services",
    colors: {
      primary: "#1e40af", // Blue
      secondary: "#64748b", // Slate
      accent: "#0891b2", // Cyan
      background: "#f8fafc",
      backgroundGradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#e2e8f0",
      textPrimary: "#0f172a",
      textSecondary: "#64748b",
      iconBackground: "#e0e7ff",
      overlayGradient:
        "linear-gradient(180deg, rgba(30,64,175,0.8) 0%, rgba(100,116,139,0.85) 100%)",
    },
    decorativeElements: {
      pattern: "dots",
      icon: "💼",
      animation: "slide",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.4,
        textAlign: "left",
        decorativeElement: "dots",
      },
      services: {
        cardStyle: "minimal",
        iconStyle: "square",
        hoverEffect: "shadow",
      },
      gallery: {
        borderRadius: "0.5rem",
        hoverEffect: "overlay",
        spacing: "1.5rem",
      },
      reviews: {
        cardStyle: "quote",
        starColor: "#1e40af",
      },
      contact: {
        formStyle: "minimal",
        buttonStyle: "square",
      },
    },
  },

  // Retail & Shopping
  retail: {
    name: "Retail & Shopping",
    description: "Vibrant, trendy colors for retail businesses",
    colors: {
      primary: "#7c3aed", // Purple
      secondary: "#10b981", // Green
      accent: "#f59e0b", // Amber
      background: "#fafafa",
      backgroundGradient: "linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#e4e4e7",
      textPrimary: "#18181b",
      textSecondary: "#71717a",
      iconBackground: "#ede9fe",
      overlayGradient:
        "linear-gradient(180deg, rgba(124,58,237,0.8) 0%, rgba(16,185,129,0.85) 100%)",
    },
    decorativeElements: {
      pattern: "shapes",
      icon: "🛍️",
      animation: "float",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.3,
        textAlign: "center",
        decorativeElement: "shapes",
      },
      services: {
        cardStyle: "gradient",
        iconStyle: "rounded",
        hoverEffect: "scale",
      },
      gallery: {
        borderRadius: "1rem",
        hoverEffect: "zoom",
        spacing: "1.5rem",
      },
      reviews: {
        cardStyle: "bubble",
        starColor: "#f59e0b",
      },
      contact: {
        formStyle: "floating",
        buttonStyle: "pill",
      },
    },
  },

  // Creative & Entertainment
  creative: {
    name: "Creative & Entertainment",
    description: "Bold, artistic colors for creative businesses",
    colors: {
      primary: "#ec4899", // Pink
      secondary: "#8b5cf6", // Purple
      accent: "#06b6d4", // Cyan
      background: "#fafafa",
      backgroundGradient: "linear-gradient(135deg, #fdf4ff 0%, #f0fdfa 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#f3e8ff",
      textPrimary: "#1e1b4b",
      textSecondary: "#6b21a8",
      iconBackground: "#fae8ff",
      overlayGradient:
        "linear-gradient(45deg, rgba(236,72,153,0.8) 0%, rgba(139,92,246,0.8) 50%, rgba(6,182,212,0.8) 100%)",
    },
    decorativeElements: {
      pattern: "circles",
      icon: "🎨",
      animation: "rotate",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.4,
        textAlign: "center",
        decorativeElement: "circles",
      },
      services: {
        cardStyle: "gradient",
        iconStyle: "circle",
        hoverEffect: "tilt",
      },
      gallery: {
        borderRadius: "1.5rem",
        hoverEffect: "overlay",
        spacing: "1rem",
      },
      reviews: {
        cardStyle: "elegant",
        starColor: "#ec4899",
      },
      contact: {
        formStyle: "floating",
        buttonStyle: "pill",
      },
    },
  },

  // Education
  education: {
    name: "Education & Learning",
    description: "Inspiring, trustworthy colors for educational institutions",
    colors: {
      primary: "#2563eb", // Blue
      secondary: "#059669", // Green
      accent: "#f59e0b", // Amber
      background: "#f9fafb",
      backgroundGradient: "linear-gradient(135deg, #f9fafb 0%, #eff6ff 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#dbeafe",
      textPrimary: "#1e293b",
      textSecondary: "#475569",
      iconBackground: "#dbeafe",
      overlayGradient:
        "linear-gradient(180deg, rgba(37,99,235,0.8) 0%, rgba(5,150,105,0.85) 100%)",
    },
    decorativeElements: {
      pattern: "dots",
      icon: "📚",
      animation: "slide",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.3,
        textAlign: "center",
        decorativeElement: "dots",
      },
      services: {
        cardStyle: "bordered",
        iconStyle: "rounded",
        hoverEffect: "shadow",
      },
      gallery: {
        borderRadius: "0.75rem",
        hoverEffect: "slide",
        spacing: "1.5rem",
      },
      reviews: {
        cardStyle: "quote",
        starColor: "#f59e0b",
      },
      contact: {
        formStyle: "bordered",
        buttonStyle: "rounded",
      },
    },
  },

  // Home Services
  home_services: {
    name: "Home Services",
    description: "Reliable, friendly colors for home service businesses",
    colors: {
      primary: "#059669", // Green
      secondary: "#0891b2", // Cyan
      accent: "#f59e0b", // Amber
      background: "#f9fafb",
      backgroundGradient: "linear-gradient(135deg, #f9fafb 0%, #ecfdf5 100%)",
      cardBackground: "#ffffff",
      cardBorder: "#d1fae5",
      textPrimary: "#064e3b",
      textSecondary: "#047857",
      iconBackground: "#d1fae5",
      overlayGradient:
        "linear-gradient(180deg, rgba(5,150,105,0.8) 0%, rgba(8,145,178,0.85) 100%)",
    },
    decorativeElements: {
      pattern: "lines",
      icon: "🏠",
      animation: "float",
    },
    sectionStyles: {
      hero: {
        overlayOpacity: 0.4,
        textAlign: "left",
        decorativeElement: "lines",
      },
      services: {
        cardStyle: "elevated",
        iconStyle: "rounded",
        hoverEffect: "scale",
      },
      gallery: {
        borderRadius: "0.75rem",
        hoverEffect: "zoom",
        spacing: "1.5rem",
      },
      reviews: {
        cardStyle: "minimal",
        starColor: "#f59e0b",
      },
      contact: {
        formStyle: "bordered",
        buttonStyle: "rounded",
      },
    },
  },
};

// Helper function to get theme by business category
export function getBusinessCategoryTheme(
  category: string | undefined,
): CategoryTheme {
  if (!category) {
    return businessCategoryThemes.professional;
  }

  // Normalize category
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, "_");

  // Direct match
  if (businessCategoryThemes[normalizedCategory]) {
    return businessCategoryThemes[normalizedCategory];
  }

  // Category mapping for Google Business categories
  const categoryMap: Record<string, string> = {
    // Food & Dining
    restaurant: "restaurant",
    cafe: "restaurant",
    coffee_shop: "restaurant",
    bar: "restaurant",
    bakery: "restaurant",
    fast_food_restaurant: "restaurant",

    // Beauty & Wellness
    beauty_salon: "beauty_salon",
    spa: "beauty_salon",
    hair_care: "beauty_salon",
    nail_salon: "beauty_salon",
    massage_therapist: "beauty_salon",

    // Healthcare
    doctor: "medical",
    dentist: "medical",
    hospital: "medical",
    clinic: "medical",
    pharmacy: "medical",
    veterinary_care: "medical",

    // Fitness
    gym: "gym",
    fitness_center: "gym",
    yoga_studio: "gym",
    personal_trainer: "gym",
    sports_complex: "gym",

    // Automotive
    car_repair: "car_repair",
    car_dealer: "car_repair",
    car_wash: "car_repair",
    auto_parts_store: "car_repair",

    // Professional Services
    lawyer: "professional",
    accounting: "professional",
    insurance_agency: "professional",
    real_estate_agency: "professional",
    bank: "professional",

    // Retail
    clothing_store: "retail",
    jewelry_store: "retail",
    furniture_store: "retail",
    electronics_store: "retail",
    book_store: "retail",

    // Creative
    art_gallery: "creative",
    photography_studio: "creative",
    graphic_designer: "creative",
    web_designer: "creative",

    // Education
    school: "education",
    university: "education",
    tutoring_service: "education",

    // Home Services
    plumber: "home_services",
    electrician: "home_services",
    contractor: "home_services",
    cleaning_service: "home_services",
    landscaping: "home_services",
  };

  // Check category mapping
  for (const [key, value] of Object.entries(categoryMap)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return businessCategoryThemes[value];
    }
  }

  // Default to professional theme
  return businessCategoryThemes.professional;
}
