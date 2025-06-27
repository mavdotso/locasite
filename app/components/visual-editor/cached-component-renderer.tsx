"use client";

import React, { memo, useMemo } from "react";
import { ComponentData } from "./types";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
import { useComponentCache } from "./hooks/use-component-cache";
import { Doc } from "@/convex/_generated/dataModel";

interface CachedComponentRendererProps {
  component: ComponentData;
  business: Doc<"businesses">;
  isEditMode: boolean;
  onUpdate?: (props: Record<string, unknown>) => void;
  children?: React.ReactNode;
}

export const CachedComponentRenderer = memo(function CachedComponentRenderer({
  component,
  business,
  isEditMode,
  onUpdate,
  children,
}: CachedComponentRendererProps) {
  const {
    getCachedComponent,
    setCachedComponent,
    getCachedProps,
    setCachedProps,
    getComponentCacheKey,
  } = useComponentCache();

  const config = componentConfigs[component.type];

  // Generate cache key
  const cacheKey = useMemo(
    () => getComponentCacheKey(component, [String(isEditMode)]),
    [component, isEditMode, getComponentCacheKey],
  );

  // Check if we have a cached version
  const cachedComponent = getCachedComponent(cacheKey);
  if (cachedComponent && !isEditMode) {
    // Return cached component in view mode
    return <>{cachedComponent}</>;
  }

  // Check for cached props
  let componentProps = getCachedProps(component.id);
  if (!componentProps) {
    componentProps = {
      ...component.props,
      business,
    };
    setCachedProps(component.id, componentProps);
  }

  if (!config) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        Unknown component type: {component.type}
      </div>
    );
  }

  // Render component
  const renderedComponent = config.render(
    componentProps,
    isEditMode,
    business,
    children,
    onUpdate || (() => {}),
  );

  // Cache the rendered component if not in edit mode
  if (!isEditMode) {
    setCachedComponent(cacheKey, renderedComponent);
  }

  return <>{renderedComponent}</>;
});

// Export a hook to clear cache when component updates
export function useClearComponentCache(componentId: string) {
  const { clearComponentCache } = useComponentCache();

  React.useEffect(() => {
    return () => {
      // Clear cache when component unmounts or updates
      clearComponentCache(componentId);
    };
  }, [componentId, clearComponentCache]);
}
