"use client";

import React from "react";
import { componentConfigs } from "./config/components";
import { useDragDrop } from "./drag-drop-provider";
import { cn } from "@/app/lib/utils";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

export default function ComponentLibrary() {
  const { startDrag, isDragging } = useDragDrop();

  // Group components by category
  const componentsByCategory = Object.entries(componentConfigs).reduce((acc, [type, config]) => {
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
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Components</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Drag components to add them to your page
        </p>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b h-auto p-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="p-4 mt-0">
              <div className="grid gap-3">
                {componentsByCategory[category].map(({ type, config }) => {
                  const Icon = config.icon;
                  return (
                    <div
                      key={type}
                      draggable
                      onDragStart={() => handleDragStart(type)}
                      className={cn(
                        "p-4 border rounded-lg cursor-move transition-all",
                        "hover:border-primary hover:shadow-sm",
                        "flex items-center gap-3",
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
                            {config.fields.title.defaultValue}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </ScrollArea>
    </div>
  );
}