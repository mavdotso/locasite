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
  render: (props: Record<string, unknown>, editMode?: boolean, business?: unknown) => React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  category?: string;
}

// Layout options
export interface LayoutOptions {
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: "none" | "small" | "medium" | "large";
  padding?: "none" | "small" | "medium" | "large";
  margin?: "none" | "small" | "medium" | "large";
  fullWidth?: boolean;
  background?: {
    type: "color" | "gradient" | "image";
    value: string;
  };
}

// Page data model
export interface ComponentData {
  id: string;
  type: string;
  props: Record<string, unknown>;
  layout?: LayoutOptions;
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