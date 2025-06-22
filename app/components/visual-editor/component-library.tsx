"use client";

import React, { useState, useMemo } from "react";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
import { useDragDrop } from "./drag-drop-provider";
import { cn } from "@/app/lib/utils";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Input } from "@/app/components/ui/input";
import { 
  Search, 
  ChevronRight, 
  ChevronDown,
  Layout,
  Type,
  Image,
  Square,
  Users,
  Film,
  Plus,
  Columns,
  GripVertical
} from "lucide-react";

// Define the hierarchical structure matching the mockup
interface TreeNode {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: TreeNode[];
  componentType?: string;
  isAddAction?: boolean;
  count?: number;
}

const componentTree: TreeNode[] = [
  {
    label: "Layout",
    icon: Layout,
    children: [
      { label: "Section", componentType: "SectionBlock", icon: Layout },
      { label: "Columns", componentType: "ColumnsBlock", icon: Columns },
      { label: "Card", componentType: "CardBlock", icon: Square },
      { label: "Accordion", componentType: "AccordionBlock", icon: Layout },
      { label: "Tabs", componentType: "TabsBlock", icon: Layout }
    ]
  },
  {
    label: "Content",
    icon: Type,
    children: [
      { label: "Text", componentType: "TextBlock", icon: Type },
      { label: "Button", componentType: "ButtonBlock", icon: Square },
      { label: "List", componentType: "ListBlock", icon: Layout },
      { label: "Alert", componentType: "AlertBlock", icon: Square },
      { label: "Badge", componentType: "BadgeBlock", icon: Square },
      { label: "Divider", componentType: "DividerBlock", icon: Layout },
      { label: "Spacer", componentType: "SpacerBlock", icon: Square }
    ]
  },
  {
    label: "Media",
    icon: Image,
    children: [
      { label: "Image", componentType: "ImageBlock", icon: Image },
      { label: "Logo", componentType: "LogoBlock", icon: Image },
      { label: "Video", componentType: "VideoBlock", icon: Film },
      { label: "Gallery Grid", componentType: "GalleryGridBlock", icon: Layout },
      { label: "Icon", componentType: "IconBlock", icon: Square }
    ]
  },
  {
    label: "Business",
    icon: Users,
    children: [
      { label: "Hero Section", componentType: "HeroSection", icon: Layout },
      { label: "Info Section", componentType: "InfoSection", icon: Layout },
      { label: "Gallery Section", componentType: "GallerySection", icon: Image },
      { label: "Reviews Section", componentType: "ReviewsSection", icon: Users },
      { label: "Business Hours", componentType: "BusinessHoursBlock", icon: Square },
      { label: "Social Links", componentType: "SocialLinksBlock", icon: Users },
      { label: "Payment Methods", componentType: "PaymentMethodsBlock", icon: Square },
      { label: "Review Stars", componentType: "ReviewStarsBlock", icon: Square }
    ]
  }
];


// Format component name for display
function formatComponentName(type: string): string {
  return type
    .replace(/Block$|Section$/, "")
    .replace(/([A-Z])/g, " $1")
    .trim();
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  onDragStart: (componentType: string, element: HTMLElement) => void;
  isDragging: boolean;
  searchQuery: string;
}

function TreeItem({ node, level, onDragStart, isDragging, searchQuery }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0 || searchQuery !== "");
  const hasChildren = node.children && node.children.length > 0;
  const Icon = node.icon;
  
  // Filter children based on search
  const filteredChildren = useMemo(() => {
    if (!node.children || !searchQuery) return node.children;
    
    return node.children.filter(child => {
      const searchText = `${child.label} ${child.componentType || ''}`.toLowerCase();
      return searchText.includes(searchQuery.toLowerCase());
    });
  }, [node.children, searchQuery]);

  // Check if this node or any children match search
  const isVisible = useMemo(() => {
    if (!searchQuery) return true;
    
    const nodeMatches = node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (node.componentType?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const childrenMatch = filteredChildren && filteredChildren.length > 0;
    
    return nodeMatches || childrenMatch;
  }, [node, searchQuery, filteredChildren]);

  if (!isVisible) return null;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    if (node.componentType) {
      const element = e.currentTarget as HTMLElement;
      onDragStart(node.componentType, element);
      
      // Create custom drag preview
      const dragPreview = document.createElement('div');
      dragPreview.className = 'fixed pointer-events-none z-50 bg-background border-2 border-primary rounded-lg shadow-xl p-3 opacity-90';
      dragPreview.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span class="text-sm font-medium">${node.label}</span>
        </div>
      `;
      dragPreview.style.position = 'absolute';
      dragPreview.style.top = '-9999px';
      document.body.appendChild(dragPreview);
      e.dataTransfer.setDragImage(dragPreview, 0, 0);
      
      setTimeout(() => {
        document.body.removeChild(dragPreview);
      }, 0);
    }
  };

  const isComponent = !!node.componentType;
  const isAddAction = !!node.isAddAction;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group",
          "hover:bg-muted",
          isDragging && "opacity-50",
          isComponent && "hover:bg-accent/10"
        )}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        onClick={handleClick}
        draggable={isComponent}
        onDragStart={isComponent ? handleDrag : undefined}
      >
        {/* Drag handle */}
        {isComponent && (
          <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
        )}
        
        {/* Expand/Collapse icon */}
        {hasChildren && (
          <div className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        )}
        
        {/* Icon */}
        {Icon && !hasChildren && (
          <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
        
        {/* Label */}
        <span className={cn(
          "text-sm flex-1",
          level === 0 && "font-semibold",
          isAddAction && "text-primary"
        )}>
          {node.label}
        </span>
        
        {/* Count badge */}
        {node.count && (
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {node.count}
          </span>
        )}
        
        {/* Add icon for actions */}
        {(isAddAction || isComponent) && (
          <Plus className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && filteredChildren && (
        <div>
          {filteredChildren.map((child, index) => (
            <TreeItem
              key={`${child.label}-${index}`}
              node={child}
              level={level + 1}
              onDragStart={onDragStart}
              isDragging={isDragging}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ComponentLibrary() {
  const { startDrag, isDragging } = useDragDrop();
  const [searchQuery, setSearchQuery] = useState("");

  const handleDragStart = (componentType: string, element: HTMLElement) => {
    startDrag({
      type: "new-component",
      componentType
    }, element);
  };

  // Create a complete tree with all components
  const completeTree = useMemo(() => {
    // Start with the predefined tree structure
    const tree = [...componentTree];
    
    // Add any components not already in the tree
    const addedTypes = new Set<string>();
    
    // Collect all component types already in tree
    const collectTypes = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.componentType) {
          addedTypes.add(node.componentType);
        }
        if (node.children) {
          collectTypes(node.children);
        }
      });
    };
    
    collectTypes(tree);
    
    // Add remaining components in a "Components" section
    const remainingComponents = Object.entries(componentConfigs)
      .filter(([type]) => !addedTypes.has(type))
      .map(([type, config]) => ({
        label: formatComponentName(type),
        componentType: type,
        icon: config.icon
      }));
    
    if (remainingComponents.length > 0) {
      tree.push({
        label: "Components",
        icon: Layout,
        children: remainingComponents
      });
    }
    return tree;
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-shrink-0 p-4 border-b border-border/50 space-y-3">
        <div>
          <h3 className="font-semibold text-sm text-foreground">Components</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Drag components to build your page
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-muted/50 border-border/50"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="py-2">
          {completeTree.map((node, index) => (
            <TreeItem
              key={`${node.label}-${index}`}
              node={node}
              level={0}
              onDragStart={handleDragStart}
              isDragging={isDragging}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}