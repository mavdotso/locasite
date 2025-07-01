"use client";

import React, { useState } from "react";
import { PageData, ComponentData } from "../core/types";
import ComponentLibrary from "../library/component-library";
import { cn } from "@/app/lib/utils";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { ChevronDown, FileText, Layers } from "lucide-react";
import { allComponentConfigs as componentConfigs } from "../config/all-components";

interface LeftSidebarProps {
  pageData: PageData;
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onOpenTemplates?: () => void;
}

interface ComponentItemProps {
  component: ComponentData;
  depth: number;
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  expandedComponents: Set<string>;
  onToggleExpand: (id: string) => void;
}

function ComponentItem({
  component,
  depth,
  selectedComponentId,
  onSelectComponent,
  expandedComponents,
  onToggleExpand,
}: ComponentItemProps) {
  const config = componentConfigs[component.type];
  const Icon = config?.icon || FileText;
  const label = component.type.replace(/Block$|Section$/, "");
  const hasChildren = component.children && component.children.length > 0;
  const isExpanded = expandedComponents.has(component.id);

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors group",
          "hover:bg-muted",
          selectedComponentId === component.id && "bg-accent/10",
        )}
        style={{ paddingLeft: `${8 + depth * 24}px` }}
        onClick={() => onSelectComponent(component.id)}
      >
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(component.id);
            }}
            className="p-0.5 hover:bg-muted-foreground/10 rounded"
          >
            <ChevronDown
              className={cn(
                "w-3 h-3 text-muted-foreground transition-transform",
                !isExpanded && "-rotate-90",
              )}
            />
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm flex-1 truncate">{label}</span>
        {hasChildren && (
          <span className="text-xs text-muted-foreground">
            {component.children!.length}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <>
          {component.children!.map((child) => (
            <ComponentItem
              key={child.id}
              component={child}
              depth={depth + 1}
              selectedComponentId={selectedComponentId}
              onSelectComponent={onSelectComponent}
              expandedComponents={expandedComponents}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </>
      )}
    </>
  );
}

export default function LeftSidebar({
  pageData,
  selectedComponentId,
  onSelectComponent,
  onOpenTemplates,
}: LeftSidebarProps) {
  const [isStructureExpanded, setIsStructureExpanded] = useState(false);
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(
    new Set(),
  );

  const toggleComponentExpand = (id: string) => {
    setExpandedComponents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Page Structure Section */}
      <div
        className={cn(
          "border-b border-border/50 transition-all duration-300 flex-shrink-0",
          isStructureExpanded ? "max-h-[33.333%] flex flex-col" : "h-auto",
        )}
      >
        {/* Header */}
        <button
          type="button"
          onClick={() => setIsStructureExpanded(!isStructureExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Page Structure</h3>
          </div>
          <ChevronDown
            className={cn(
              "w-4 w-4 text-muted-foreground transition-transform duration-200",
              !isStructureExpanded && "-rotate-90",
            )}
          />
        </button>

        {/* Content */}
        {isStructureExpanded && (
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="p-2 pb-4">
              {pageData.components.length > 0 ? (
                <div className="space-y-0.5">
                  {pageData.components.map((component) => (
                    <ComponentItem
                      key={component.id}
                      component={component}
                      depth={0}
                      selectedComponentId={selectedComponentId}
                      onSelectComponent={onSelectComponent}
                      expandedComponents={expandedComponents}
                      onToggleExpand={toggleComponentExpand}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">
                    No components yet
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Component Library Section (remaining height) */}
      <div className="flex-1 min-h-0">
        <ComponentLibrary onOpenTemplates={onOpenTemplates} />
      </div>
    </div>
  );
}
