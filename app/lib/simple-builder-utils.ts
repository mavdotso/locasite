import { ComponentData } from "@/app/types/visual-editor";
import {
  SimplePageData,
  SectionInstance,
  SimpleComponentData,
  SimpleTheme,
} from "@/app/components/simple-builder/types/simple-builder";
import { getVariationById } from "@/app/components/simple-builder/sections/section-variations";

/**
 * Convert Simple mode sections to Pro mode components
 * This allows users to switch from Simple to Pro mode without losing their content
 */
export function convertSimpleToProMode(
  sections: SectionInstance[],
  theme?: SimpleTheme,
): ComponentData[] {
  const components: ComponentData[] = [];

  sections.forEach((section, index) => {
    const variation = getVariationById(section.variationId);
    if (!variation) return;

    // Convert the simple component data to visual editor component data
    const convertedComponent = convertSimpleComponentToVisual(
      section.data,
      index,
    );

    if (convertedComponent) {
      components.push(convertedComponent);
    }
  });

  // Add theme as metadata on the first component if provided
  if (theme && components.length > 0) {
    components[0].metadata = {
      ...components[0].metadata,
      theme,
    };
  }

  return components;
}

/**
 * Convert a simple component to visual editor component
 */
function convertSimpleComponentToVisual(
  simpleComponent: SimpleComponentData,
  _index: number,
): ComponentData {
  // Map simple component types to visual editor component types
  const typeMapping: Record<string, string> = {
    "hero-section": "HeroSection",
    "hero-split": "HeroSection",
    "hero-minimal": "HeroSection",
    "about-section": "AboutSection",
    "about-columns": "AboutSection",
    "about-timeline": "ProcessTimelineSection",
    "services-grid": "ServicesSection",
    "services-list": "ServicesDetailedSection",
    "services-pricing": "MenuPriceListSection",
    "gallery-grid": "GallerySection",
    "gallery-masonry": "GalleryGridBlock",
    "gallery-before-after": "BeforeAfterSection",
    "contact-form-map": "ContactSection",
    "contact-cards": "ContactSection",
    "contact-social": "SocialLinksBlock",
  };

  const visualType = typeMapping[simpleComponent.type] || "SectionBlock";

  // Convert content and style to props and layout
  const props: Record<string, unknown> = {
    ...simpleComponent.content,
  };

  const layout: Record<string, unknown> = {};

  if (simpleComponent.style) {
    if (simpleComponent.style.backgroundColor) {
      layout.backgroundColor = simpleComponent.style.backgroundColor;
    }
    if (simpleComponent.style.textColor) {
      layout.color = simpleComponent.style.textColor;
    }
    if (simpleComponent.style.padding) {
      layout.padding = simpleComponent.style.padding;
    }
    if (simpleComponent.style.margin) {
      layout.margin = simpleComponent.style.margin;
    }
    if (simpleComponent.style.textAlign) {
      layout.textAlign = simpleComponent.style.textAlign;
    }
  }

  return {
    id: simpleComponent.id,
    type: visualType,
    props,
    layout,
    children: simpleComponent.children?.map((child, childIndex) =>
      convertSimpleComponentToVisual(child, childIndex),
    ),
  };
}

/**
 * Convert Pro mode components to Simple mode sections
 * This is more complex as we need to identify which components can be converted
 */
export function convertProToSimple(
  components: ComponentData[],
): SectionInstance[] {
  const sections: SectionInstance[] = [];

  components.forEach((component, index) => {
    const simpleSection = convertVisualComponentToSimple(component, index);
    if (simpleSection) {
      sections.push(simpleSection);
    }
  });

  return sections;
}

/**
 * Convert a visual editor component to simple section
 */
function convertVisualComponentToSimple(
  component: ComponentData,
  order: number,
): SectionInstance | null {
  // Map visual editor component types to simple variation IDs
  const variationMapping: Record<string, string> = {
    HeroSection: "hero-center-bg",
    AboutSection: "about-text-image",
    ServicesSection: "services-grid",
    ServicesDetailedSection: "services-list-icons",
    MenuPriceListSection: "services-pricing-table",
    GallerySection: "gallery-grid",
    GalleryGridBlock: "gallery-masonry",
    BeforeAfterSection: "gallery-before-after",
    ContactSection: "contact-form-map",
    ProcessTimelineSection: "about-timeline",
    SocialLinksBlock: "contact-social-focus",
  };

  const variationId = variationMapping[component.type];
  if (!variationId) {
    // Component type not supported in simple mode
    return null;
  }

  const variation = getVariationById(variationId);
  if (!variation) return null;

  // Create simple component data from visual component
  const simpleData: SimpleComponentData = {
    id: component.id,
    type: variation.template.type,
    content: {
      ...component.props,
    },
    style: {
      backgroundColor: component.layout?.backgroundColor as string | undefined,
      textColor: undefined, // Text color is typically in props, not layout
      padding: component.layout?.padding as string | undefined,
      margin: component.layout?.margin as string | undefined,
      textAlign: component.layout?.textAlign as
        | "left"
        | "center"
        | "right"
        | undefined,
    },
  };

  return {
    id: component.id,
    variationId,
    order,
    data: simpleData,
  };
}

/**
 * Check if a page can be converted from Pro to Simple mode
 * Returns warnings about what might be lost in conversion
 */
export function checkProToSimpleConversion(components: ComponentData[]): {
  canConvert: boolean;
  warnings: string[];
  supportedCount: number;
  totalCount: number;
} {
  const warnings: string[] = [];
  let supportedCount = 0;
  const totalCount = components.length;

  const supportedTypes = new Set([
    "HeroSection",
    "AboutSection",
    "ServicesSection",
    "ServicesDetailedSection",
    "MenuPriceListSection",
    "GallerySection",
    "GalleryGridBlock",
    "BeforeAfterSection",
    "ContactSection",
    "ProcessTimelineSection",
    "SocialLinksBlock",
  ]);

  components.forEach((component) => {
    if (supportedTypes.has(component.type)) {
      supportedCount++;
    } else {
      warnings.push(
        `Component type "${component.type}" is not supported in Simple mode`,
      );
    }

    // Check for nested components that might be lost
    if (component.children && component.children.length > 0) {
      const hasUnsupportedChildren = component.children.some(
        (child) => !supportedTypes.has(child.type),
      );
      if (hasUnsupportedChildren) {
        warnings.push(`Nested components in "${component.type}" may be lost`);
      }
    }
  });

  return {
    canConvert: supportedCount > 0,
    warnings,
    supportedCount,
    totalCount,
  };
}

/**
 * Create an empty Simple page with a business preset
 */
export function createSimplePageFromPreset(
  businessId: string,
  _presetType: string,
  businessData?: Record<string, unknown>,
): SimplePageData | null {
  // This would typically use the business presets
  // For now, return a basic structure
  return {
    id: generateId(),
    businessId,
    title: (businessData?.name as string) || "New Page",
    sections: [],
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };
}

// Helper function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
