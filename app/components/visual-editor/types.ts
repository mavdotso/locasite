// Type definitions for the visual editor

// Field type definitions
export type FieldType = 
  | "text" 
  | "textarea" 
  | "image" 
  | "color" 
  | "select" 
  | "number" 
  | "array";

export interface BaseField {
  type: FieldType;
  label: string;
  defaultValue?: unknown;
  required?: boolean;
  placeholder?: string;
  hidden?: boolean;
}

export interface TextField extends BaseField {
  type: "text";
  defaultValue?: string;
  maxLength?: number;
}

export interface TextareaField extends BaseField {
  type: "textarea";
  defaultValue?: string;
  rows?: number;
}

export interface ImageField extends BaseField {
  type: "image";
  defaultValue?: string;
  accept?: string;
}

export interface ColorField extends BaseField {
  type: "color";
  defaultValue?: string;
  presets?: string[];
}

export interface SelectField extends BaseField {
  type: "select";
  defaultValue?: string;
  options: { value: string; label: string }[];
}

export interface NumberField extends BaseField {
  type: "number";
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
}

export interface ArrayField extends BaseField {
  type: "array";
  defaultValue?: unknown[];
  itemType: Field;
  maxItems?: number;
}

export type Field = 
  | TextField 
  | TextareaField 
  | ImageField 
  | ColorField 
  | SelectField 
  | NumberField 
  | ArrayField;

// Component definition
export interface ComponentConfig {
  fields: Record<string, Field>;
  defaultProps?: Record<string, unknown>;
  render: (
    props: Record<string, unknown>, 
    editMode?: boolean, 
    business?: unknown, 
    children?: React.ReactNode,
    onUpdate?: (newProps: Record<string, unknown>) => void
  ) => React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  category?: string;
  acceptsChildren?: boolean; // Whether this component can contain other components
  inline?: boolean; // Whether this is an inline element (for text flow)
  isTemplate?: boolean; // Whether this is a template that returns multiple blocks
  template?: (business?: unknown) => ComponentTemplate[]; // Template definition
}

// Template block structure
export interface ComponentTemplate {
  type: string;
  props: Record<string, unknown>;
  children?: ComponentTemplate[];
}

// Layout options
export interface LayoutOptions {
  // Layout
  display?: "block" | "flex" | "grid" | "inline" | "inline-block";
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: string;
  
  // Spacing
  padding?: string;
  margin?: string;
  
  // Size
  width?: string;
  height?: string;
  fullWidth?: boolean;
  
  // Style
  background?: {
    type: "color" | "gradient" | "image";
    value: string;
  };
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  opacity?: number;
  
  // Typography (for text components)
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
}

// Page data model
export interface ComponentData {
  id: string;
  type: string;
  props: Record<string, unknown>;
  layout?: LayoutOptions;
  children?: ComponentData[]; // Support nested components
  parentId?: string; // Track parent component
  metadata?: Record<string, unknown>; // Additional metadata (e.g., column index)
}

export interface PageData {
  title: string;
  components: ComponentData[];
}

// Editor state
export interface EditorState {
  selectedComponentId: string | null;
  isDragging: boolean;
  draggedComponent: ComponentData | null;
  dropZoneActive: string | null;
}

// Drag & Drop
export interface DragItem {
  type: "new-component" | "existing-component";
  componentType?: string;
  component?: ComponentData;
  index?: number;
}

export interface DropZone {
  id: string;
  index: number;
  accepts: string[];
}