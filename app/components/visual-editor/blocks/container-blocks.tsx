import React from "react";
import { ComponentConfig } from "../types";
import { 
  Box,
  Columns,
  CreditCard,
  ChevronDown,
  Layout
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

// Section Block - Main container for other blocks
export const SectionBlock: ComponentConfig = {
  fields: {
    width: {
      type: "select",
      label: "Container Width",
      defaultValue: "container",
      options: [
        { value: "full", label: "Full Width" },
        { value: "container", label: "Container" },
        { value: "narrow", label: "Narrow" }
      ]
    },
    verticalPadding: {
      type: "select",
      label: "Vertical Padding",
      defaultValue: "medium",
      options: [
        { value: "none", label: "None" },
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "xlarge", label: "Extra Large" }
      ]
    }
  },
  render: (props, editMode, _business, children, _onUpdate) => {
    const { width, verticalPadding } = props as {
      width?: string;
      verticalPadding?: string;
    };
    
    const widthClasses = {
      full: "w-full",
      container: "container mx-auto px-4",
      narrow: "max-w-4xl mx-auto px-4"
    };
    
    const paddingClasses = {
      none: "",
      small: "py-8",
      medium: "py-16",
      large: "py-24",
      xlarge: "py-32"
    };
    
    return (
      <section className={cn(
        widthClasses[width as keyof typeof widthClasses] || widthClasses.container,
        paddingClasses[verticalPadding as keyof typeof paddingClasses] || paddingClasses.medium,
        editMode && "min-h-[100px] relative"
      )}>
        {children || (
          editMode && (
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground">Drop content blocks here</p>
            </div>
          )
        )}
      </section>
    );
  },
  icon: Box,
  category: "Layout",
  acceptsChildren: true
};

// Columns Block - Multi-column layouts
export const ColumnsBlock: ComponentConfig = {
  fields: {
    columns: {
      type: "select",
      label: "Number of Columns",
      defaultValue: "2",
      options: [
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
        { value: "4", label: "4 Columns" }
      ]
    },
    gap: {
      type: "select",
      label: "Column Gap",
      defaultValue: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" }
      ]
    },
    stackOnMobile: {
      type: "select",
      label: "Stack on Mobile",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props, editMode, _business, children, _onUpdate) => {
    const { columns, gap, stackOnMobile } = props as {
      columns?: string;
      gap?: string;
      stackOnMobile?: string;
    };
    
    const gridClasses = {
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4"
    };
    
    const gapClasses = {
      small: "gap-2",
      medium: "gap-6",
      large: "gap-10"
    };
    
    const mobileClasses = stackOnMobile === "yes" ? "grid-cols-1" : "";
    
    // Create placeholder columns in edit mode
    const columnCount = parseInt(columns || "2");
    
    // For columns, we need to structure children differently
    // Each column should be able to accept multiple children
    // For now, distribute children among columns
    const childrenArray = React.Children.toArray(children);
    const columnsContent = Array(columnCount).fill(null).map((_, colIndex) => {
      const colChildren = childrenArray.filter((_, childIndex) => childIndex % columnCount === colIndex);
      return colChildren.length > 0 ? colChildren : null;
    });
    
    return (
      <div className={cn(
        "grid",
        mobileClasses,
        `md:${gridClasses[columns as keyof typeof gridClasses] || gridClasses["2"]}`,
        gapClasses[gap as keyof typeof gapClasses] || gapClasses.medium
      )}>
        {columnsContent.map((colContent, index) => (
          <div 
            key={index}
            className={cn(
              "column-drop-zone",
              editMode && !colContent && "min-h-[100px] border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center bg-muted/20"
            )}
          >
            {colContent || (
              editMode && <p className="text-sm text-muted-foreground">Column {index + 1}</p>
            )}
          </div>
        ))}
      </div>
    );
  },
  icon: Columns,
  category: "Layout",
  acceptsChildren: true
};

// Card Block - Content card with header
export const CardBlock: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Card Title",
      defaultValue: "Card Title"
    },
    description: {
      type: "textarea",
      label: "Card Description",
      defaultValue: "",
      rows: 2
    },
    variant: {
      type: "select",
      label: "Variant",
      defaultValue: "default",
      options: [
        { value: "default", label: "Default" },
        { value: "outline", label: "Outline" },
        { value: "ghost", label: "Ghost" }
      ]
    }
  },
  render: (props, editMode, _business, children, _onUpdate) => {
    const { title, description, variant } = props as {
      title?: string;
      description?: string;
      variant?: string;
    };
    
    const variantClasses = {
      default: "",
      outline: "border-2",
      ghost: "border-0 shadow-none"
    };
    
    return (
      <Card className={variantClasses[variant as keyof typeof variantClasses] || ""}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          {children || (
            editMode && (
              <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Drop content here</p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    );
  },
  icon: CreditCard,
  category: "Layout",
  acceptsChildren: true
};

// Accordion Block - Expandable content sections
export const AccordionBlock: ComponentConfig = {
  fields: {
    items: {
      type: "array",
      label: "Accordion Items",
      defaultValue: [
        { title: "Section 1", content: "Content for section 1" },
        { title: "Section 2", content: "Content for section 2" }
      ],
      itemType: {
        type: "text",
        label: "Item"
      },
      maxItems: 10
    },
    type: {
      type: "select",
      label: "Accordion Type",
      defaultValue: "single",
      options: [
        { value: "single", label: "Single (one open at a time)" },
        { value: "multiple", label: "Multiple (many can be open)" }
      ]
    }
  },
  render: (props, _editMode, _business, _children, _onUpdate) => {
    const { items, type } = props as {
      items?: Array<{ title: string; content: string }>;
      type?: string;
    };
    
    const accordionItems = items || [];
    
    return (
      <Accordion type={type as "single" | "multiple"} className="w-full">
        {accordionItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
  icon: ChevronDown,
  category: "Interactive"
};

// Tabs Block - Tabbed content
export const TabsBlock: ComponentConfig = {
  fields: {
    tabs: {
      type: "array",
      label: "Tabs",
      defaultValue: [
        { label: "Tab 1", content: "Content for tab 1" },
        { label: "Tab 2", content: "Content for tab 2" }
      ],
      itemType: {
        type: "text",
        label: "Tab"
      },
      maxItems: 6
    }
  },
  render: (props, editMode, _business, children, _onUpdate) => {
    const { tabs } = props as {
      tabs?: Array<{ label: string; content: string }>;
    };
    
    const tabItems = tabs || [];
    
    return (
      <Tabs defaultValue="tab-0" className="w-full">
        <TabsList className="w-full justify-start">
          {tabItems.map((tab, index) => (
            <TabsTrigger key={index} value={`tab-${index}`}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabItems.map((tab, index) => (
          <TabsContent key={index} value={`tab-${index}`}>
            <div className="pt-4">
              {(Array.isArray(children) ? children[index] : null) || (
                editMode ? (
                  <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Content for {tab.label}</p>
                  </div>
                ) : (
                  <p>{tab.content}</p>
                )
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  },
  icon: Layout,
  category: "Interactive",
  acceptsChildren: true
};