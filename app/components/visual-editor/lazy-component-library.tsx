"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";

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
  GripVertical,
} from "lucide-react";

// Define the hierarchical structure
interface TreeNode {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: TreeNode[];
  componentType?: string;
  isAddAction?: boolean;
  metadata?: Record<string, unknown>;
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
      { label: "Tabs", componentType: "TabsBlock", icon: Layout },
    ],
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
      { label: "Spacer", componentType: "SpacerBlock", icon: Square },
    ],
  },
  {
    label: "Media",
    icon: Image,
    children: [
      { label: "Image", componentType: "ImageBlock", icon: Image },
      { label: "Logo", componentType: "LogoBlock", icon: Image },
      { label: "Video", componentType: "VideoBlock", icon: Film },
      {
        label: "Gallery Grid",
        componentType: "GalleryGridBlock",
        icon: Layout,
      },
      { label: "Icon", componentType: "IconBlock", icon: Square },
    ],
  },
  {
    label: "Business",
    icon: Users,
    children: [
      { label: "Hero Section", componentType: "HeroSection", icon: Layout },
      { label: "Info Section", componentType: "InfoSection", icon: Layout },
      {
        label: "Gallery Section",
        componentType: "GallerySection",
        icon: Image,
      },
      {
        label: "Reviews Section",
        componentType: "ReviewsSection",
        icon: Users,
      },
      {
        label: "Business Hours",
        componentType: "BusinessHoursBlock",
        icon: Square,
      },
      { label: "Social Links", componentType: "SocialLinksBlock", icon: Users },
      {
        label: "Payment Methods",
        componentType: "PaymentMethodsBlock",
        icon: Square,
      },
      {
        label: "Review Stars",
        componentType: "ReviewStarsBlock",
        icon: Square,
      },
    ],
  },
];

// Lazy loaded tree item component
// Define the tree node structure
interface TreeNode {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: TreeNode[];
  componentType?: string;
  isAddAction?: boolean;
  metadata?: Record<string, unknown>;
  count?: number;
}

interface LazyTreeItemProps {
  node: TreeNode;
  level: number;
  onDragStart: (
    componentType: string,
    element: HTMLElement,
    metadata?: Record<string, unknown>,
  ) => void;
  isDragging: boolean;
  searchQuery: string;
  isVisible: boolean;
  onHover?: (componentType: string) => void;
}

const LazyTreeItem = React.memo(function LazyTreeItem({
  node,
  level,
  onDragStart,
  isDragging,
  searchQuery,
  isVisible,
}: LazyTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(
    level === 0 || searchQuery !== "",
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const hasChildren = node.children && node.children.length > 0;
  const Icon = node.icon;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true);
          }
        });
      },
      {
        rootMargin: "50px", // Load items 50px before they come into view
        threshold: 0.1,
      },
    );

    const element = itemRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [isVisible, isLoaded]);

  // Filter children based on search
  const filteredChildren = useMemo(() => {
    if (!node.children || !searchQuery) return node.children;

    return node.children.filter((child: TreeNode) => {
      const searchText =
        `${child.label} ${child.componentType || ""}`.toLowerCase();
      return searchText.includes(searchQuery.toLowerCase());
    });
  }, [node.children, searchQuery]);

  if (!isVisible) return null;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    if (node.componentType) {
      const element = e.currentTarget as HTMLElement;
      onDragStart(node.componentType, element, node.metadata);
    }
  };

  // Show loading skeleton if not loaded yet
  if (!isLoaded) {
    return (
      <div
        ref={itemRef}
        className="flex items-center gap-2 px-3 py-2 animate-pulse"
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        <div className="w-4 h-4 bg-muted rounded"></div>
        <div className="w-20 h-4 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div ref={itemRef}>
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 group",
          "hover:bg-muted/50",
          node.componentType && "hover:bg-accent/10",
          isDragging && "opacity-50",
        )}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={handleClick}
        draggable={!!node.componentType}
        onDragStart={handleDrag}
      >
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-muted-foreground/10 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        )}

        {!hasChildren && <div className="w-4" />}

        {Icon && (
          <Icon
            className={cn(
              "w-4 h-4 flex-shrink-0",
              node.componentType
                ? "text-muted-foreground group-hover:text-foreground"
                : "text-muted-foreground",
            )}
          />
        )}

        <span
          className={cn(
            "text-sm flex-1 truncate transition-colors",
            node.componentType ? "group-hover:text-foreground" : "font-medium",
          )}
        >
          {node.label}
        </span>

        {node.componentType && (
          <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {hasChildren && isExpanded && filteredChildren && (
        <div className="space-y-0.5">
          {filteredChildren.map((child, index) => (
            <LazyTreeItem
              key={`${child.label}-${index}`}
              node={child}
              level={level + 1}
              onDragStart={onDragStart}
              isDragging={isDragging}
              searchQuery={searchQuery}
              isVisible={true}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default function LazyComponentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const { startDrag, isDragging } = useDragDrop();

  const handleDragStart = useCallback(
    (
      componentType: string,
      element: HTMLElement,
      metadata?: Record<string, unknown>,
    ) => {
      startDrag(
        {
          type: "new-component",
          componentType,
          metadata,
        },
        element,
      );
    },
    [startDrag],
  );

  // Filter tree based on search
  const filteredTree = useMemo(() => {
    if (!searchQuery) return componentTree;

    return componentTree
      .map((category) => {
        const filteredChildren = category.children?.filter((child) => {
          const searchText =
            `${child.label} ${child.componentType || ""}`.toLowerCase();
          return searchText.includes(searchQuery.toLowerCase());
        });

        if (filteredChildren && filteredChildren.length > 0) {
          return { ...category, children: filteredChildren };
        }

        return null;
      })
      .filter(Boolean) as TreeNode[];
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex-shrink-0">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-muted-foreground" />
          Add Components
        </h3>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
      </div>

      {/* Component Tree */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-2 space-y-1">
          {filteredTree.length > 0 ? (
            filteredTree.map((category, index) => (
              <LazyTreeItem
                key={`${category.label}-${index}`}
                node={category}
                level={0}
                onDragStart={handleDragStart}
                isDragging={isDragging}
                searchQuery={searchQuery}
                isVisible={true}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No components found
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
