import { useEffect, useRef } from "react";
import { ComponentConfig } from "../types";
import { Doc } from "@/convex/_generated/dataModel";

// Common components that should be preloaded
const PRELOAD_COMPONENTS = [
  "TextBlock",
  "ImageBlock",
  "ButtonBlock",
  "HeadingBlock",
  "ColumnsBlock",
];

// Field components that should be preloaded
const PRELOAD_FIELDS = [
  "./fields/text-field",
  "./fields/textarea-field",
  "./fields/image-field",
  "./fields/select-field",
  "./fields/color-field",
];

interface PreloadStatus {
  components: Set<string>;
  fields: Set<string>;
}

export function useComponentPreloader(
  componentConfigs: Record<string, ComponentConfig>,
) {
  const preloadedRef = useRef<PreloadStatus>({
    components: new Set(),
    fields: new Set(),
  });

  useEffect(() => {
    // Preload common components after initial render
    const preloadTimer = setTimeout(() => {
      // Preload component modules
      PRELOAD_COMPONENTS.forEach((componentType) => {
        if (
          componentConfigs[componentType] &&
          !preloadedRef.current.components.has(componentType)
        ) {
          // Trigger component render function to ensure it's loaded
          const config = componentConfigs[componentType];
          if (config.render) {
            // Create a dummy render to preload the component
            try {
              config.render({}, false, {} as Doc<"businesses">, null, () => {});
              preloadedRef.current.components.add(componentType);
            } catch {
              // Ignore errors during preload
            }
          }
        }
      });

      // Preload field components
      PRELOAD_FIELDS.forEach((fieldPath) => {
        if (!preloadedRef.current.fields.has(fieldPath)) {
          import(fieldPath)
            .then(() => {
              preloadedRef.current.fields.add(fieldPath);
            })
            .catch(() => {
              // Ignore errors during preload
            });
        }
      });
    }, 1000); // Delay preload to not interfere with initial render

    return () => clearTimeout(preloadTimer);
  }, [componentConfigs]);

  // Preload specific component on hover
  const preloadComponent = (componentType: string) => {
    if (
      componentConfigs[componentType] &&
      !preloadedRef.current.components.has(componentType)
    ) {
      const config = componentConfigs[componentType];
      if (config.render) {
        try {
          config.render({}, false, {} as Doc<"businesses">, null, () => {});
          preloadedRef.current.components.add(componentType);
        } catch {
          // Ignore errors during preload
        }
      }
    }
  };

  return { preloadComponent };
}
