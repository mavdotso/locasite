"use client";

import React, { useState, useMemo } from "react";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
import { useDragDrop } from "./drag-drop-provider";
import { cn } from "@/app/lib/utils";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export default function ComponentLibrary() {
  const { startDrag, isDragging } = useDragDrop();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return componentConfigs;
    
    return Object.fromEntries(
      Object.entries(componentConfigs).filter(([type, config]) => {
        const searchableText = `${type} ${config.category || ''} ${JSON.stringify(config.fields)}`;
        return searchableText.toLowerCase().includes(query);
      })
    );
  }, [searchQuery]);

  // Group components by category
  const componentsByCategory = Object.entries(filteredComponents).reduce((acc, [type, config]) => {
    const category = config.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ type, config });
    return acc;
  }, {} as Record<string, Array<{ type: string; config: typeof componentConfigs[string] }>>);

  const categories = Object.keys(componentsByCategory);

  const handleDragStart = (componentType: string) => {
    startDrag({
      type: "new-component",
      componentType
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b space-y-3">
        <div>
          <h3 className="font-semibold text-sm">Components</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Drag components to build your page
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Main Tabs: Blocks vs Pre-made Sections */}
      <Tabs defaultValue="blocks" className="flex-1 flex flex-col overflow-hidden">
        {/* No results message */}
        {searchQuery && categories.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No components found for &quot;{searchQuery}&quot;</p>
          </div>
        )}
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 rounded-none border-b">
            <TabsTrigger
              value="blocks"
              className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary pb-2"
            >
              Building Blocks
            </TabsTrigger>
            <TabsTrigger
              value="sections"
              className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary pb-2"
            >
              Pre-made Sections
            </TabsTrigger>
          </TabsList>

          {/* Building Blocks Tab */}
          <TabsContent value="blocks" className="mt-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
            {/* Component Categories */}
            <Tabs defaultValue={categories[0] || ""} className="w-full flex flex-col overflow-hidden">
              {categories.length > 1 && (
                <TabsList className="w-full justify-start bg-transparent h-auto p-0 rounded-none border-b">
                  {categories.filter(cat => cat !== "Content" && cat !== "Media" && cat !== "Contact" && cat !== "Social" && cat !== "Location").map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary pb-2"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              )}

              {categories.filter(cat => cat !== "Content" && cat !== "Media" && cat !== "Contact" && cat !== "Social" && cat !== "Location").map((category) => (
                <TabsContent key={category} value={category} className="p-4 mt-0">
                  <div className="grid gap-3">
                    {componentsByCategory[category].map(({ type, config }) => {
                      const Icon = config.icon;
                      return (
                        <ComponentCard
                          key={type}
                          type={type}
                          config={config}
                          Icon={Icon}
                          onDragStart={() => handleDragStart(type)}
                          isDragging={isDragging}
                          showPreview={false}
                        />
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            </ScrollArea>
          </TabsContent>

          {/* Pre-made Sections Tab */}
          <TabsContent value="sections" className="mt-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="grid gap-3">
                  {Object.entries(componentsByCategory)
                    .filter(([category]) => ["Content", "Media", "Contact", "Social", "Location"].includes(category))
                    .flatMap(([_, components]) => components)
                    .map(({ type, config }) => {
                      const Icon = config.icon;
                      return (
                        <ComponentCard
                          key={type}
                          type={type}
                          config={config}
                          Icon={Icon}
                          onDragStart={() => handleDragStart(type)}
                          isDragging={isDragging}
                          showPreview={false}
                        />
                      );
                    })}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
    </div>
  );
}

// Component Card
interface ComponentCardProps {
  type: string;
  config: typeof componentConfigs[string];
  Icon: React.ComponentType<{ className?: string }> | undefined;
  onDragStart: () => void;
  isDragging: boolean;
  showPreview?: boolean;
}

function ComponentCard({ type, config, Icon, onDragStart, isDragging, showPreview = true }: ComponentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate a simple preview of the component
  const getPreviewContent = () => {
    switch (type) {
      case 'HeroBlock':
        return (
          <div className="h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded flex items-center justify-center p-4">
            <div className="text-center">
              <div className="h-2 w-20 bg-primary/40 rounded mb-2 mx-auto" />
              <div className="h-1.5 w-16 bg-primary/30 rounded" />
            </div>
          </div>
        );
      case 'TextBlock':
        return (
          <div className="p-3 space-y-2">
            <div className="h-2 w-16 bg-muted-foreground/30 rounded" />
            <div className="space-y-1">
              <div className="h-1 w-full bg-muted-foreground/20 rounded" />
              <div className="h-1 w-3/4 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        );
      case 'GalleryBlock':
        return (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-1">
              <div className="aspect-square bg-muted-foreground/20 rounded" />
              <div className="aspect-square bg-muted-foreground/20 rounded" />
              <div className="aspect-square bg-muted-foreground/20 rounded" />
              <div className="aspect-square bg-muted-foreground/20 rounded" />
            </div>
          </div>
        );
      case 'ContactBlock':
        return (
          <div className="p-3 space-y-2">
            <div className="h-1.5 w-12 bg-muted-foreground/30 rounded" />
            <div className="space-y-1">
              <div className="h-3 w-full bg-muted-foreground/10 rounded" />
              <div className="h-3 w-full bg-muted-foreground/10 rounded" />
            </div>
            <div className="h-4 w-16 bg-primary/30 rounded" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          draggable
          onDragStart={onDragStart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative p-4 border rounded-lg cursor-move transition-all",
            "hover:border-primary hover:shadow-sm",
            "flex items-center gap-3 group",
            "w-full overflow-hidden",
            isDragging && "opacity-50"
          )}
        >
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">
              {type.replace(/Block$/, "")}
            </h4>
            {config.fields.title?.defaultValue && (
              <p className="text-xs text-muted-foreground truncate">
                {String(config.fields.title.defaultValue)}
              </p>
            )}
          </div>
          <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          
          {/* Preview on hover - removed to prevent overlap */}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Drag to add {type.replace(/Block$/, "")} component</p>
      </TooltipContent>
    </Tooltip>
  );
}