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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import ResizableColumns from "../resizable-columns";

// Section Block - Main container for other blocks with background options
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
    },
    backgroundColor: {
      type: "select",
      label: "Background Color",
      defaultValue: "default",
      options: [
        { value: "default", label: "Default" },
        { value: "muted", label: "Muted" },
        { value: "card", label: "Card" },
        { value: "primary", label: "Primary" },
        { value: "secondary", label: "Secondary" },
        { value: "accent", label: "Accent" },
        { value: "transparent", label: "Transparent" }
      ]
    },
    backgroundImage: {
      type: "image",
      label: "Background Image",
      accept: "image/*"
    },
    backgroundImageStyle: {
      type: "select",
      label: "Background Style",
      defaultValue: "cover",
      options: [
        { value: "cover", label: "Cover" },
        { value: "contain", label: "Contain" },
        { value: "fixed", label: "Fixed" }
      ]
    },
    overlayOpacity: {
      type: "number",
      label: "Overlay Opacity",
      defaultValue: 0,
      min: 0,
      max: 0.9,
      step: 0.1,
      showSlider: true
    }
  },
  render: (props, editMode, _business, children, _onUpdate) => {
    const { 
      width, 
      verticalPadding, 
      backgroundColor, 
      backgroundImage, 
      backgroundImageStyle,
      overlayOpacity 
    } = props as {
      width?: string;
      verticalPadding?: string;
      backgroundColor?: string;
      backgroundImage?: string;
      backgroundImageStyle?: string;
      overlayOpacity?: number;
    };
    
    const widthClasses = {
      full: "w-full",
      container: "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",
      narrow: "max-w-4xl mx-auto px-4 sm:px-6"
    };
    
    const paddingClasses = {
      none: "",
      small: "py-6 sm:py-8",
      medium: "py-12 sm:py-16",
      large: "py-16 sm:py-24",
      xlarge: "py-20 sm:py-32"
    };
    
    const bgColorClasses = {
      default: "",
      muted: "bg-muted",
      card: "bg-card",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      accent: "bg-accent text-accent-foreground",
      transparent: "bg-transparent"
    };
    
    const bgImageStyles = backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: backgroundImageStyle === "contain" ? "contain" : "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: backgroundImageStyle === "fixed" ? "fixed" : "scroll"
    } : {};
    
    return (
      <section 
        className={cn(
          "relative",
          bgColorClasses[backgroundColor as keyof typeof bgColorClasses] || "",
          editMode && "min-h-[100px]"
        )}
        style={bgImageStyles}
      >
        {backgroundImage && overlayOpacity !== undefined && overlayOpacity > 0 && (
          <div 
            className="absolute inset-0 bg-background" 
            style={{ opacity: overlayOpacity }}
          />
        )}
        <div className={cn(
          "relative",
          widthClasses[width as keyof typeof widthClasses] || widthClasses.container,
          paddingClasses[verticalPadding as keyof typeof paddingClasses] || paddingClasses.medium
        )}>
          {editMode && !children ? (
            <div 
              className="relative min-h-[100px] border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10 transition-colors hover:bg-muted/20"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Drop will be handled by the DropZone component
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-sm text-muted-foreground">Drop items here</p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </section>
    );
  },
  icon: Box,
  category: "Basic",
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
    columnWidths: {
      type: "array",
      label: "Column Widths",
      defaultValue: [],
      itemType: {
        type: "number",
        label: "Width"
      },
      hidden: true // Hidden from UI, managed by resize handles
    },
    gap: {
      type: "select",
      label: "Column Gap",
      defaultValue: "medium",
      options: [
        { value: "none", label: "None" },
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" }
      ]
    },
    direction: {
      type: "select",
      label: "Direction",
      defaultValue: "row",
      options: [
        { value: "row", label: "Row (Horizontal)" },
        { value: "col", label: "Column (Vertical)" }
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
    },
    verticalAlign: {
      type: "select",
      label: "Vertical Alignment",
      defaultValue: "top",
      options: [
        { value: "top", label: "Top" },
        { value: "center", label: "Center" },
        { value: "bottom", label: "Bottom" }
      ]
    },
    minHeight: {
      type: "text",
      label: "Minimum Height",
      defaultValue: "100px",
      placeholder: "e.g. 100px, 50vh, 0"
    }
  },
  render: (props, editMode, _business, children, onUpdate) => {
    const { columns, gap, direction, stackOnMobile, columnWidths, verticalAlign, minHeight } = props as {
      columns?: string;
      gap?: string;
      direction?: string;
      stackOnMobile?: string;
      columnWidths?: number[];
      verticalAlign?: 'top' | 'center' | 'bottom';
      minHeight?: string;
    };
    
    const columnCount = parseInt(columns || "2");
    const isVertical = direction === "col";
    
    const handleColumnWidthsChange = (widths: number[]) => {
      if (onUpdate) {
        onUpdate({ columnWidths: widths });
      }
    };
    
    const childrenArray = React.Children.toArray(children);
    
    // Check if we have pre-distributed columns by looking for column-content divs
    const isPreDistributed = childrenArray.length > 0 && 
      childrenArray.every(child => {
        const el = child as React.ReactElement<{ className?: string }>;
        return el?.props?.className === 'column-content';
      });
    
    if (isPreDistributed) {
      // Children are already distributed into columns by PreviewPanel or BusinessPageRenderer
      if (isVertical) {
        return (
          <div className="flex flex-col gap-6">
            {childrenArray}
          </div>
        );
      }
      
      return (
        <ResizableColumns
          columnCount={columnCount}
          gap={gap || "medium"}
          stackOnMobile={stackOnMobile || "yes"}
          initialWidths={columnWidths}
          onColumnWidthsChange={handleColumnWidthsChange}
          isEditMode={editMode}
          verticalAlign={verticalAlign || "top"}
          minHeight={minHeight || "100px"}
        >
          {childrenArray.map((colContent, colIndex) => (
            <div key={colIndex} className="column-drop-zone overflow-hidden">
              {(colContent as React.ReactElement<{ children?: React.ReactNode }>).props.children}
              {editMode && !(colContent as React.ReactElement<{ children?: React.ReactNode }>).props.children && (
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20">
                  <p className="text-sm text-muted-foreground">Column {colIndex + 1}</p>
                </div>
              )}
            </div>
          ))}
        </ResizableColumns>
      );
    }
    
    // This path should not be reached if BusinessPageRenderer is working correctly
    // It's only used for direct children without pre-distribution
    const columnContents: React.ReactNode[][] = Array(columnCount).fill(null).map(() => []);
    
    // Distribute children to columns
    childrenArray.forEach((child, index) => {
      // For vertical layout, all children go in one column
      if (isVertical) {
        columnContents[0].push(child);
      } else {
        // Default distribution by index
        const columnIndex = index % columnCount;
        columnContents[columnIndex].push(child);
      }
    });
    
    // For vertical layout, use flex
    if (isVertical) {
      return (
        <div className="flex flex-col gap-6">
          {columnContents.map((colChildren, colIndex) => (
            <div key={colIndex}>
              {colChildren}
              {editMode && colChildren.length === 0 && (
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20">
                  <p className="text-sm text-muted-foreground">Column {colIndex + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // For horizontal layout, use ResizableColumns
    return (
      <ResizableColumns
        columnCount={columnCount}
        gap={gap || "medium"}
        stackOnMobile={stackOnMobile || "yes"}
        initialWidths={columnWidths}
        onColumnWidthsChange={handleColumnWidthsChange}
        isEditMode={editMode}
        verticalAlign={verticalAlign || "top"}
        minHeight={minHeight || "100px"}
      >
        {columnContents.map((colChildren, colIndex) => (
          <div key={colIndex} className="min-w-0">
            {colChildren}
            {editMode && colChildren.length === 0 && (
              <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground">Column {colIndex + 1}</p>
              </div>
            )}
          </div>
        ))}
      </ResizableColumns>
    );
  },
  icon: Columns,
  category: "Basic",
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
  category: "Basic",
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
      items?: Array<{ title: string; content: string } | string>;
      type?: string;
    };
    
    const accordionItems = items || [];
    
    return (
      <Accordion type={type as "single" | "multiple"} className="w-full">
        {accordionItems.map((item, index) => {
          // Handle both object and string formats
          const itemData = typeof item === 'string' ? { title: item, content: '' } : item;
          return (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{itemData.title}</AccordionTrigger>
              <AccordionContent>
                {itemData.content || 'Content goes here'}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  },
  icon: ChevronDown,
  category: "Basic"
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
  category: "Basic",
  acceptsChildren: true
};

// Column Content Block - Used as a child of ColumnsBlock to wrap content in each column
export const ColumnContentBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business, children) => {
    // This is a wrapper component that just renders its children
    return <>{children}</>;
  },
  icon: Layout,
  category: "Basic",
  acceptsChildren: true
};