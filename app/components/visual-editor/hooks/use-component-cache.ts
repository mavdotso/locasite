import { useRef, useCallback } from "react";
import { ComponentData } from "../types";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface ComponentCache {
  renderedComponents: Map<string, CacheEntry<React.ReactNode>>;
  componentProps: Map<string, CacheEntry<Record<string, unknown>>>;
  fieldValues: Map<string, CacheEntry<unknown>>;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useComponentCache() {
  const cacheRef = useRef<ComponentCache>({
    renderedComponents: new Map(),
    componentProps: new Map(),
    fieldValues: new Map(),
  });

  // Check if cache entry is still valid
  const isValidCache = useCallback((entry: CacheEntry<unknown>) => {
    return Date.now() - entry.timestamp < CACHE_TTL;
  }, []);

  // Get cached rendered component
  const getCachedComponent = useCallback(
    (componentId: string): React.ReactNode | null => {
      const entry = cacheRef.current.renderedComponents.get(componentId);
      if (entry && isValidCache(entry)) {
        return entry.data;
      }
      return null;
    },
    [isValidCache],
  );

  // Set cached rendered component
  const setCachedComponent = useCallback(
    (componentId: string, component: React.ReactNode) => {
      cacheRef.current.renderedComponents.set(componentId, {
        data: component,
        timestamp: Date.now(),
      });
    },
    [],
  );

  // Get cached component props
  const getCachedProps = useCallback(
    (componentId: string): Record<string, unknown> | null => {
      const entry = cacheRef.current.componentProps.get(componentId);
      if (entry && isValidCache(entry)) {
        return entry.data;
      }
      return null;
    },
    [isValidCache],
  );

  // Set cached component props
  const setCachedProps = useCallback(
    (componentId: string, props: Record<string, unknown>) => {
      cacheRef.current.componentProps.set(componentId, {
        data: props,
        timestamp: Date.now(),
      });
    },
    [],
  );

  // Get cached field value
  const getCachedFieldValue = useCallback(
    (fieldKey: string): unknown => {
      const entry = cacheRef.current.fieldValues.get(fieldKey);
      if (entry && isValidCache(entry)) {
        return entry.data;
      }
      return null;
    },
    [isValidCache],
  );

  // Set cached field value
  const setCachedFieldValue = useCallback(
    (fieldKey: string, value: unknown) => {
      cacheRef.current.fieldValues.set(fieldKey, {
        data: value,
        timestamp: Date.now(),
      });
    },
    [],
  );

  // Clear cache for a specific component
  const clearComponentCache = useCallback((componentId: string) => {
    cacheRef.current.renderedComponents.delete(componentId);
    cacheRef.current.componentProps.delete(componentId);

    // Clear field values for this component
    const keysToDelete: string[] = [];
    cacheRef.current.fieldValues.forEach((_, key) => {
      if (key.startsWith(componentId)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => cacheRef.current.fieldValues.delete(key));
  }, []);

  // Clear all expired cache entries
  const clearExpiredCache = useCallback(() => {
    const now = Date.now();

    // Clear expired rendered components
    cacheRef.current.renderedComponents.forEach((entry, key) => {
      if (now - entry.timestamp >= CACHE_TTL) {
        cacheRef.current.renderedComponents.delete(key);
      }
    });

    // Clear expired component props
    cacheRef.current.componentProps.forEach((entry, key) => {
      if (now - entry.timestamp >= CACHE_TTL) {
        cacheRef.current.componentProps.delete(key);
      }
    });

    // Clear expired field values
    cacheRef.current.fieldValues.forEach((entry, key) => {
      if (now - entry.timestamp >= CACHE_TTL) {
        cacheRef.current.fieldValues.delete(key);
      }
    });
  }, []);

  // Get cache stats
  const getCacheStats = useCallback(() => {
    return {
      renderedComponents: cacheRef.current.renderedComponents.size,
      componentProps: cacheRef.current.componentProps.size,
      fieldValues: cacheRef.current.fieldValues.size,
      totalSize:
        cacheRef.current.renderedComponents.size +
        cacheRef.current.componentProps.size +
        cacheRef.current.fieldValues.size,
    };
  }, []);

  // Create a memoization key for component
  const getComponentCacheKey = useCallback(
    (component: ComponentData, additionalKeys?: string[]): string => {
      const keys = [
        component.id,
        component.type,
        JSON.stringify(component.props),
        ...(additionalKeys || []),
      ];
      return keys.join(":");
    },
    [],
  );

  return {
    getCachedComponent,
    setCachedComponent,
    getCachedProps,
    setCachedProps,
    getCachedFieldValue,
    setCachedFieldValue,
    clearComponentCache,
    clearExpiredCache,
    getCacheStats,
    getComponentCacheKey,
  };
}
