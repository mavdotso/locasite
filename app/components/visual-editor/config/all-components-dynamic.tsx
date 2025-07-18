import { ComponentConfig } from "@/app/types/visual-editor";

// Lazy load large block files
const loadBasicBlocks = () => import("../blocks/basic-blocks");
const loadContainerBlocks = () => import("../blocks/container-blocks");
const loadBusinessBlocks = () => import("../blocks/business-blocks");
const loadLocalBusinessSections = () =>
  import("../blocks/local-business-sections");

// Cache for loaded components
const componentCache: Record<string, ComponentConfig> = {};

// Create a proxy that loads components on demand
export const allComponentConfigs: Record<string, ComponentConfig> = new Proxy(
  componentCache,
  {
    get(target: Record<string, ComponentConfig>, prop: string) {
      // Return cached component if already loaded
      if (target[prop]) {
        return target[prop];
      }

      // Determine which module to load based on component name
      let loadPromise: Promise<Record<string, ComponentConfig>>;

      // Container blocks
      if (
        [
          "SectionBlock",
          "ColumnsBlock",
          "CardBlock",
          "AccordionBlock",
          "TabsBlock",
        ].includes(prop)
      ) {
        loadPromise = loadContainerBlocks();
      }
      // Basic blocks
      else if (
        [
          "TextBlock",
          "ImageBlock",
          "LogoBlock",
          "ButtonBlock",
          "SpacerBlock",
          "DividerBlock",
          "VideoBlock",
          "IconBlock",
          "ListBlock",
          "GalleryGridBlock",
          "AlertBlock",
          "NavigationBlock",
          "ContactFormBlock",
          "BadgeBlock",
          "ReviewStarsBlock",
          "BusinessHoursBlock",
          "SocialLinksBlock",
          "PaymentMethodsBlock",
        ].includes(prop)
      ) {
        loadPromise = loadBasicBlocks();
      }
      // Business blocks
      else if (
        [
          "HeaderBlock",
          "HeroBlock",
          "AboutBlock",
          "ServicesBlock",
          "GalleryBlock",
          "TestimonialsBlock",
          "ContactBlock",
          "TeamBlock",
          "CTABlock",
          "FooterBlock",
          "BusinessPageTemplate",
        ].includes(prop)
      ) {
        loadPromise = loadBusinessBlocks();
      }
      // Local business sections
      else if (
        [
          "HeaderSection",
          "HeroSection",
          "AboutSection",
          "GallerySection",
          "ContactSection",
          "OperatingHoursSection",
          "LocationDirectionsSection",
          "MenuPriceListSection",
          "SpecialOffersSection",
          "FAQSection",
          "GoogleReviewsSection",
          "BeforeAfterSection",
          "ProcessTimelineSection",
          "StatsCounterSection",
          "TeamSection",
          "FeaturesSection",
          "CTABannerSection",
          "ServicesDetailedSection",
        ].includes(prop)
      ) {
        loadPromise = loadLocalBusinessSections();
      } else {
        return undefined;
      }

      // Load the module and cache the component
      loadPromise.then((module) => {
        if (module[prop]) {
          target[prop] = module[prop];
        }
      });

      // Return a placeholder config while loading
      return {
        type: prop,
        label: prop,
        category: "loading",
        fields: [],
        defaultProps: {},
        render: () => null,
      };
    },

    has(_target: Record<string, ComponentConfig>, prop: string) {
      return [
        "SectionBlock",
        "ColumnsBlock",
        "CardBlock",
        "AccordionBlock",
        "TabsBlock",
        "TextBlock",
        "ImageBlock",
        "LogoBlock",
        "ButtonBlock",
        "SpacerBlock",
        "DividerBlock",
        "VideoBlock",
        "IconBlock",
        "ListBlock",
        "GalleryGridBlock",
        "AlertBlock",
        "NavigationBlock",
        "ContactFormBlock",
        "BadgeBlock",
        "ReviewStarsBlock",
        "BusinessHoursBlock",
        "SocialLinksBlock",
        "PaymentMethodsBlock",
        "HeaderBlock",
        "HeroBlock",
        "AboutBlock",
        "ServicesBlock",
        "GalleryBlock",
        "TestimonialsBlock",
        "ContactBlock",
        "TeamBlock",
        "CTABlock",
        "FooterBlock",
        "BusinessPageTemplate",
        "HeaderSection",
        "HeroSection",
        "AboutSection",
        "GallerySection",
        "ContactSection",
        "OperatingHoursSection",
        "LocationDirectionsSection",
        "MenuPriceListSection",
        "SpecialOffersSection",
        "FAQSection",
        "GoogleReviewsSection",
        "BeforeAfterSection",
        "ProcessTimelineSection",
        "StatsCounterSection",
        "TeamSection",
        "FeaturesSection",
        "CTABannerSection",
        "ServicesDetailedSection",
      ].includes(prop as string);
    },

    ownKeys() {
      return [
        "SectionBlock",
        "ColumnsBlock",
        "CardBlock",
        "AccordionBlock",
        "TabsBlock",
        "TextBlock",
        "ImageBlock",
        "LogoBlock",
        "ButtonBlock",
        "SpacerBlock",
        "DividerBlock",
        "VideoBlock",
        "IconBlock",
        "ListBlock",
        "GalleryGridBlock",
        "AlertBlock",
        "NavigationBlock",
        "ContactFormBlock",
        "BadgeBlock",
        "ReviewStarsBlock",
        "BusinessHoursBlock",
        "SocialLinksBlock",
        "PaymentMethodsBlock",
        "HeaderBlock",
        "HeroBlock",
        "AboutBlock",
        "ServicesBlock",
        "GalleryBlock",
        "TestimonialsBlock",
        "ContactBlock",
        "TeamBlock",
        "CTABlock",
        "FooterBlock",
        "BusinessPageTemplate",
        "HeaderSection",
        "HeroSection",
        "AboutSection",
        "GallerySection",
        "ContactSection",
        "OperatingHoursSection",
        "LocationDirectionsSection",
        "MenuPriceListSection",
        "SpecialOffersSection",
        "FAQSection",
        "GoogleReviewsSection",
        "BeforeAfterSection",
        "ProcessTimelineSection",
        "StatsCounterSection",
        "TeamSection",
        "FeaturesSection",
        "CTABannerSection",
        "ServicesDetailedSection",
      ];
    },
  },
);

// Preload essential components
export async function preloadEssentialComponents() {
  const [basic, container] = await Promise.all([
    loadBasicBlocks(),
    loadContainerBlocks(),
  ]);

  // Cache essential components
  Object.assign(allComponentConfigs, {
    TextBlock: basic.TextBlock,
    ImageBlock: basic.ImageBlock,
    ButtonBlock: basic.ButtonBlock,
    SectionBlock: container.SectionBlock,
    ColumnsBlock: container.ColumnsBlock,
  });
}
