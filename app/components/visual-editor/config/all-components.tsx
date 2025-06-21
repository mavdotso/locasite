import { ComponentConfig } from "../types";
import { componentConfigs as businessComponents } from "./components";
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
  AlertBlock
} from "../blocks/basic-blocks";
import {
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  AccordionBlock,
  TabsBlock,
  ColumnContentBlock
} from "../blocks/container-blocks";

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
  
  // Business-Specific Blocks
  BadgeBlock,
  ReviewStarsBlock,
  BusinessHoursBlock,
  SocialLinksBlock,
  PaymentMethodsBlock,
  
  // Interactive Components
  AccordionBlock,
  TabsBlock,
  
  // Business-specific components (legacy)
  ...businessComponents
};