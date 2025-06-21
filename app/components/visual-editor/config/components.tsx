import { ComponentConfig } from "../types";
import { 
  HeroBlock,
  AboutBlock,
  ServicesBlock,
  GalleryBlock,
  TestimonialsBlock,
  ContactBlock,
  TeamBlock,
  CTABlock,
  FooterBlock
} from "../blocks/business-blocks";
import {
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  VideoBlock,
  SpacerBlock,
  IconBlock,
  BadgeBlock,
  ReviewStarsBlock,
  BusinessHoursBlock,
  SocialLinksBlock,
  PaymentMethodsBlock,
  ListBlock,
  AlertBlock
} from "../blocks/basic-blocks";
import {
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  TabsBlock,
  AccordionBlock
} from "../blocks/container-blocks";
import {
  OperatingHoursSection,
  LocationDirectionsSection,
  MenuPriceListSection,
  SpecialOffersSection,
  FAQSection,
  ServiceAreaSection,
  InsurancePaymentSection
} from "../blocks/local-business-sections";
import {
  AwardsCertificationsSection,
  CommunityInvolvementSection,
  GoogleReviewsSection,
  MembershipBadgesSection,
  CustomerSuccessSection
} from "../blocks/trust-sections";
import {
  QuickActionsBar,
  MobileCallBar,
  BackToTopButton
} from "../blocks/quick-actions";

export const componentConfigs: Record<string, ComponentConfig> = {
  // Basic Blocks
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  VideoBlock,
  SpacerBlock,
  IconBlock,
  ListBlock,
  AlertBlock,
  
  // Business-Specific Blocks
  BadgeBlock,
  ReviewStarsBlock,
  BusinessHoursBlock,
  SocialLinksBlock,
  PaymentMethodsBlock,
  
  // Container Blocks
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  TabsBlock,
  AccordionBlock,
  
  // Business Sections
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
  OperatingHoursSection,
  LocationDirectionsSection,
  MenuPriceListSection,
  SpecialOffersSection,
  FAQSection,
  ServiceAreaSection,
  InsurancePaymentSection,
  
  // Trust & Social Proof
  AwardsCertificationsSection,
  CommunityInvolvementSection,
  GoogleReviewsSection,
  MembershipBadgesSection,
  CustomerSuccessSection,
  
  // Mobile & Quick Actions
  QuickActionsBar,
  MobileCallBar,
  BackToTopButton
};