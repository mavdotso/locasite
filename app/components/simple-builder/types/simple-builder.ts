// Simple Builder Types - Completely independent from Visual Editor

// Section categories for the simple builder
export type SectionCategory =
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "contact"
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
  id: string;
  businessId: string;
  title: string;
  sections: SectionInstance[];
  theme?: SimpleTheme;
  metadata?: {
    createdAt: number;
    updatedAt: number;
    publishedAt?: number;
  };
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

// Editor state
export interface SimpleEditorState {
  pageData: SimplePageData;
  selectedSectionId: string | null;
  isAddingSectionOpen: boolean;
  isDragging: boolean;
  draggedSectionId: string | null;
  previewMode: boolean;
}

// Editable field definition
export interface EditableField {
  path: string; // Dot notation path (e.g., "content.title")
  type: "text" | "textarea" | "image" | "color" | "select";
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select type
}

// Section library item for the UI
export interface SectionLibraryItem {
  category: SectionCategory;
  variations: SectionVariation[];
}
