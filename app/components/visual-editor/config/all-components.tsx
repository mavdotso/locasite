import { ComponentConfig } from "../types";
import {
  // Basic Blocks
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
} from "../blocks/basic-blocks";

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
  BusinessPageTemplate,
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

  // Business Templates (expand into full sections)
  BusinessPageTemplate,
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
