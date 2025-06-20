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
  IconBlock
} from "../blocks/basic-blocks";
import {
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  TabsBlock,
  AccordionBlock
} from "../blocks/container-blocks";

export const componentConfigs: Record<string, ComponentConfig> = {
  // Basic Blocks
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  VideoBlock,
  SpacerBlock,
  IconBlock,
  
  // Container Blocks
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  TabsBlock,
  AccordionBlock,
  
  // Business Blocks
  HeroBlock,
  AboutBlock,
  ServicesBlock,
  GalleryBlock,
  TestimonialsBlock,
  ContactBlock,
  TeamBlock,
  CTABlock,
  FooterBlock
};