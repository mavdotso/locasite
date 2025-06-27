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
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  AccordionBlock,
  TabsBlock,
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
  HeroSection,
  AboutSection,
  GallerySection,
  ContactSection,
} from "../blocks/local-business-sections";

// Combine all components
export const allComponentConfigs: Record<string, ComponentConfig> = {
  // Container Blocks
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  AccordionBlock,
  TabsBlock,

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
  HeroSection,
  AboutSection,
  GallerySection,
  ContactSection,
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
