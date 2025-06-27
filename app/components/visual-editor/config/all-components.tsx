import { ComponentConfig } from "../types";
import {
  TextBlock,
  ImageBlock,
  LogoBlock,
  ButtonBlock,
  SpacerBlock,
  DividerBlock,
  VideoBlock,
  IconBlock,
  BadgeBlock,
  ReviewStarsBlock,
  BusinessHoursBlock,
  SocialLinksBlock,
  PaymentMethodsBlock,
  ListBlock,
  GalleryGridBlock,
  AlertBlock,
  NavigationBlock,
  ContactFormBlock,
} from "../blocks/basic-blocks";
import {
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  AccordionBlock,
  TabsBlock,
  ColumnContentBlock,
} from "../blocks/container-blocks";
import {
  HeaderBlock,
  HeroBlock,
  AboutBlock,
  ServicesBlock,
  GalleryBlock,
  TestimonialsBlock,
  ContactBlock,
  TeamBlock,
  CTABlock,
  FooterBlock,
} from "../blocks/business-blocks";
import {
  HeaderSection,
  OperatingHoursSection,
  LocationDirectionsSection,
  MenuPriceListSection,
  SpecialOffersSection,
  FAQSection,
  GoogleReviewsSection,
  BeforeAfterSection,
  ProcessTimelineSection,
  StatsCounterSection,
  TeamSection,
  FeaturesSection,
  CTABannerSection,
  ServicesDetailedSection,
} from "../blocks/local-business-sections";

// Combine all components
export const allComponentConfigs: Record<string, ComponentConfig> = {
  // Layout Components (shown first)
  SectionBlock,
  ColumnsBlock,
  ColumnContentBlock,
  CardBlock,

  // Basic Content Blocks
  TextBlock,
  ImageBlock,
  LogoBlock,
  ButtonBlock,
  SpacerBlock,
  DividerBlock,
  VideoBlock,
  IconBlock,
  ListBlock,
  GalleryGridBlock,
  AlertBlock,
  NavigationBlock,
  ContactFormBlock,

  // Business-Specific Blocks
  BadgeBlock,
  ReviewStarsBlock,
  BusinessHoursBlock,
  SocialLinksBlock,
  PaymentMethodsBlock,

  // Interactive Components
  AccordionBlock,
  TabsBlock,

  // Business Templates (expand into full sections)
  HeaderBlock,
  HeroBlock,
  AboutBlock,
  ServicesBlock,
  GalleryBlock,
  TestimonialsBlock,
  ContactBlock,
  TeamBlock,
  CTABlock,
  FooterBlock,

  // Local Business Sections
  HeaderSection,
  OperatingHoursSection,
  LocationDirectionsSection,
  MenuPriceListSection,
  SpecialOffersSection,
  FAQSection,
  GoogleReviewsSection,
  BeforeAfterSection,
  ProcessTimelineSection,
  StatsCounterSection,
  TeamSection,
  FeaturesSection,
  CTABannerSection,
  ServicesDetailedSection,
};
