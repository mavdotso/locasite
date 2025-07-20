// Simple Builder Types - Completely independent from Visual Editor

// Section categories for the simple builder
export type SectionCategory =
  | "header"
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "contact"
  | "reviews"
  | "footer";

// Simple component data structure (independent from visual editor)
export interface SimpleComponentData {
  id: string;
  type: string;
  content: Record<string, unknown>; // Simple key-value pairs for content
  style?: SimpleStyleOptions;
  children?: SimpleComponentData[];
}

// Simplified style options
export interface SimpleStyleOptions {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  textAlign?: "left" | "center" | "right";
  fontSize?: "small" | "medium" | "large" | "xlarge";
}

// Section variation definition
export interface SectionVariation {
  id: string;
  name: string;
  description: string;
  preview?: string; // Base64 or URL to preview image
  category: SectionCategory;
  template: SimpleComponentData; // Template structure
  editableFields: string[]; // Dot notation paths to editable fields (e.g., "content.title")
}

// Section instance (variation + user data)
export interface SectionInstance {
  id: string;
  variationId: string;
  order: number;
  data: SimpleComponentData; // User's customized version of the template
}

// Simple page data structure
export interface SimplePageData {
  title: string;
  pageTitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  sections: SectionInstance[];
  theme: SimpleTheme;
}

// Simple theme definition
export interface SimpleTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    section: string;
    element: string;
  };
}

// Business preset definition
export interface BusinessPreset {
  id: string;
  type:
    | "restaurant"
    | "salon"
    | "medical"
    | "professional"
    | "retail"
    | "automotive";
  name: string;
  description: string;
  sections: {
    variationId: string;
    order: number;
  }[];
  theme: SimpleTheme;
}
