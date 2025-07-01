import { BusinessPreset } from "../types/simple-builder";

export const businessPresets: BusinessPreset[] = [
  {
    id: "restaurant",
    type: "restaurant",
    name: "Restaurant",
    description: "Perfect for restaurants, cafes, and food establishments",
    sections: [
      { variationId: "hero-center-bg", order: 0 },
      { variationId: "about-text-image", order: 1 },
      { variationId: "services-pricing-table", order: 2 }, // Menu
      { variationId: "gallery-grid", order: 3 },
      { variationId: "contact-form-map", order: 4 },
    ],
    theme: {
      colors: {
        primary: "#D97706", // Amber
        secondary: "#92400E",
        accent: "#F59E0B",
        background: "#FFFFFF",
        text: "#1F2937",
        muted: "#F3F4F6",
      },
      fonts: {
        heading: "Playfair Display",
        body: "Inter",
      },
      spacing: {
        section: "4rem",
        element: "1rem",
      },
    },
  },
  {
    id: "salon",
    type: "salon",
    name: "Salon & Beauty",
    description: "Ideal for hair salons, spas, and beauty services",
    sections: [
      { variationId: "hero-split-screen", order: 0 },
      { variationId: "services-list-icons", order: 1 },
      { variationId: "gallery-before-after", order: 2 },
      { variationId: "about-two-column", order: 3 },
      { variationId: "contact-info-cards", order: 4 },
    ],
    theme: {
      colors: {
        primary: "#EC4899", // Pink
        secondary: "#BE185D",
        accent: "#F472B6",
        background: "#FFFFFF",
        text: "#1F2937",
        muted: "#FDF2F8",
      },
      fonts: {
        heading: "Montserrat",
        body: "Open Sans",
      },
      spacing: {
        section: "5rem",
        element: "1.25rem",
      },
    },
  },
  {
    id: "medical",
    type: "medical",
    name: "Medical & Healthcare",
    description: "Professional layout for clinics and healthcare providers",
    sections: [
      { variationId: "hero-minimal", order: 0 },
      { variationId: "services-3-column", order: 1 },
      { variationId: "about-timeline", order: 2 },
      { variationId: "contact-form-map", order: 3 },
    ],
    theme: {
      colors: {
        primary: "#0891B2", // Cyan
        secondary: "#0E7490",
        accent: "#06B6D4",
        background: "#FFFFFF",
        text: "#1F2937",
        muted: "#F0FDFA",
      },
      fonts: {
        heading: "Roboto",
        body: "Roboto",
      },
      spacing: {
        section: "4rem",
        element: "1rem",
      },
    },
  },
  {
    id: "professional",
    type: "professional",
    name: "Professional Services",
    description: "Clean design for consultants, lawyers, and professionals",
    sections: [
      { variationId: "hero-minimal", order: 0 },
      { variationId: "about-text-image", order: 1 },
      { variationId: "services-list-icons", order: 2 },
      { variationId: "contact-social-focus", order: 3 },
    ],
    theme: {
      colors: {
        primary: "#4F46E5", // Indigo
        secondary: "#4338CA",
        accent: "#6366F1",
        background: "#FFFFFF",
        text: "#1F2937",
        muted: "#F5F3FF",
      },
      fonts: {
        heading: "Poppins",
        body: "Inter",
      },
      spacing: {
        section: "5rem",
        element: "1.25rem",
      },
    },
  },
  {
    id: "retail",
    type: "retail",
    name: "Retail & E-commerce",
    description: "Showcase products and drive sales",
    sections: [
      { variationId: "hero-center-bg", order: 0 },
      { variationId: "services-pricing-table", order: 1 }, // Products
      { variationId: "gallery-masonry", order: 2 },
      { variationId: "about-text-image", order: 3 },
      { variationId: "contact-info-cards", order: 4 },
    ],
    theme: {
      colors: {
        primary: "#059669", // Emerald
        secondary: "#047857",
        accent: "#10B981",
        background: "#FFFFFF",
        text: "#1F2937",
        muted: "#F0FDF4",
      },
      fonts: {
        heading: "Raleway",
        body: "Source Sans Pro",
      },
      spacing: {
        section: "4rem",
        element: "1rem",
      },
    },
  },
  {
    id: "automotive",
    type: "automotive",
    name: "Automotive Services",
    description: "For auto repair shops, dealerships, and car services",
    sections: [
      { variationId: "hero-split-screen", order: 0 },
      { variationId: "services-3-column", order: 1 },
      { variationId: "gallery-grid", order: 2 },
      { variationId: "about-timeline", order: 3 },
      { variationId: "contact-form-map", order: 4 },
    ],
    theme: {
      colors: {
        primary: "#DC2626", // Red
        secondary: "#B91C1C",
        accent: "#EF4444",
        background: "#FFFFFF",
        text: "#1F2937",
        muted: "#FEF2F2",
      },
      fonts: {
        heading: "Oswald",
        body: "Roboto",
      },
      spacing: {
        section: "4rem",
        element: "1rem",
      },
    },
  },
];

// Helper function to get preset by type
export function getPresetByType(
  type: BusinessPreset["type"],
): BusinessPreset | undefined {
  return businessPresets.find((preset) => preset.type === type);
}

// Helper function to apply preset to page data
export function applyPresetToPage(preset: BusinessPreset): {
  sections: Array<{
    variationId: string;
    order: number;
  }>;
  theme: BusinessPreset["theme"];
} {
  return {
    sections: preset.sections,
    theme: preset.theme,
  };
}
