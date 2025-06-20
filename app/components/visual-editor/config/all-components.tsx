import { ComponentConfig } from "../types";
import { componentConfigs as businessComponents } from "./components";
import { 
  TextBlock, 
  ImageBlock, 
  ButtonBlock, 
  SpacerBlock, 
  DividerBlock,
  VideoBlock
} from "../blocks/basic-blocks";
import {
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  AccordionBlock,
  TabsBlock
} from "../blocks/container-blocks";

// Combine all components
export const allComponentConfigs: Record<string, ComponentConfig> = {
  // Layout Components (shown first)
  SectionBlock,
  ColumnsBlock,
  CardBlock,
  
  // Basic Content Blocks
  TextBlock,
  ImageBlock,
  ButtonBlock,
  SpacerBlock,
  DividerBlock,
  VideoBlock,
  
  // Interactive Components
  AccordionBlock,
  TabsBlock,
  
  // Business-specific components (legacy)
  ...businessComponents
};