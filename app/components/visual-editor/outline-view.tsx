"use client";

import React from "react";
import { ComponentData, PageData } from "./types";
import { componentConfigs } from "./config/components";
import { cn } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronRight,
  FileText,
  Eye,
  Layers
} from "lucide-react";

interface OutlineViewProps {
  pageData: PageData;
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
}

interface OutlineItemProps {
  component: ComponentData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  depth?: number;
}

function OutlineItem({ 
  component, 
  index, 
  isSelected, 
  onSelect,
  depth = 0 
}: OutlineItemProps) {
  const config = componentConfigs[component.type];
  const Icon = config?.icon || FileText;
  const label = component.type.replace(/Block$/, "");
  
  // Get a preview of the component's main content
  const getPreview = () => {
    const props = component.props;
    if (props.title && typeof props.title === 'string') {
      return props.title;
    }
    if (props.content && typeof props.content === 'string') {
      return props.content.substring(0, 50) + (props.content.length > 50 ? '...' : '');
    }
    return `${label} ${index + 1}`;
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
        "hover:bg-muted",
        isSelected && "bg-primary/10 text-primary"
      )}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
      onClick={onSelect}
    >
      <ChevronRight className="w-3 h-3 opacity-0" />
      <Icon className="w-4 h-4 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        <div className="text-xs text-muted-foreground truncate">
          {getPreview()}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            // Toggle visibility would be implemented here
          }}
        >
          <Eye className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export default function OutlineView({
  pageData,
  selectedComponentId,
  onSelectComponent,
  onToggleVisibility: _onToggleVisibility
}: OutlineViewProps) {
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Page Outline</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {pageData.components.length} components
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Page Title */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md mb-2",
              "border border-dashed"
            )}
          >
            <FileText className="w-4 h-4" />
            <div className="text-sm font-medium">{pageData.title}</div>
          </div>

          {/* Components */}
          <div className="space-y-1">
            {pageData.components.map((component, index) => (
              <OutlineItem
                key={component.id}
                component={component}
                index={index}
                isSelected={selectedComponentId === component.id}
                onSelect={() => onSelectComponent(component.id)}
              />
            ))}
          </div>

          {pageData.components.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No components yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag components from the library to get started
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}