import { useState, useEffect, useCallback } from "react";
import { useComponentCache } from "./use-component-cache";
import { useDebouncedCallback } from "./use-debounced-callback";

interface UseCachedFieldValueOptions {
  componentId: string;
  fieldName: string;
  initialValue: unknown;
  onChange: (value: unknown) => void;
  debounceMs?: number;
}

export function useCachedFieldValue({
  componentId,
  fieldName,
  initialValue,
  onChange,
  debounceMs = 300,
}: UseCachedFieldValueOptions) {
  const { getCachedFieldValue, setCachedFieldValue } = useComponentCache();

  // Create cache key
  const cacheKey = `${componentId}:${fieldName}`;

  // Initialize value from cache or initial value
  const [value, setValue] = useState(() => {
    const cached = getCachedFieldValue(cacheKey);
    return cached !== null ? cached : initialValue;
  });

  // Debounced onChange to reduce updates
  const debouncedOnChange = useDebouncedCallback(
    useCallback(
      (newValue: unknown) => {
        onChange(newValue);
        setCachedFieldValue(cacheKey, newValue);
      },
      [onChange, setCachedFieldValue, cacheKey],
    ),
    debounceMs,
  );

  // Handle value changes
  const handleChange = useCallback(
    (newValue: unknown) => {
      setValue(newValue);
      debouncedOnChange(newValue);
    },
    [debouncedOnChange],
  );

  // Sync with external changes
  useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue);
      setCachedFieldValue(cacheKey, initialValue);
    }
  }, [initialValue, cacheKey, setCachedFieldValue, value]);

  return {
    value,
    onChange: handleChange,
    isCached: getCachedFieldValue(cacheKey) !== null,
  };
}
