"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Loading component for individual components
const ComponentLoading = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  </div>
);

// Lazy load heavy editor components
export const LazyFieldEditor = dynamic(
  () => import("./field-editor").then((mod) => mod.default),
  {
    loading: () => <ComponentLoading />,
    ssr: false,
  },
);

export const LazyPreviewPanel = dynamic(
  () => import("./preview-panel").then((mod) => mod.default),
  {
    loading: () => <ComponentLoading />,
    ssr: false,
  },
);

export const LazyLeftSidebar = dynamic(
  () => import("./left-sidebar").then((mod) => mod.default),
  {
    loading: () => <ComponentLoading />,
    ssr: false,
  },
);

// Lazy load field components
export const LazyImageField = dynamic(
  () => import("./fields/image-field").then((mod) => mod.default),
  {
    loading: () => <ComponentLoading />,
    ssr: false,
  },
);

export const LazyTextareaField = dynamic(
  () => import("./fields/textarea-field").then((mod) => mod.default),
  {
    loading: () => <ComponentLoading />,
    ssr: false,
  },
);

export const LazyColorField = dynamic(
  () => import("./fields/color-field").then((mod) => mod.default),
  {
    loading: () => <ComponentLoading />,
    ssr: false,
  },
);

export const LazySelectField = dynamic(
  () => import("./fields/select-field").then((mod) => mod.default),
  {
    loading: () => <ComponentLoading />,
    ssr: false,
  },
);

// Create a registry for lazy-loaded field components
// Using React.ComponentType to allow any props
export const lazyFieldComponents: Record<string, React.ComponentType> = {
  image: LazyImageField as React.ComponentType,
  textarea: LazyTextareaField as React.ComponentType,
  color: LazyColorField as React.ComponentType,
  select: LazySelectField as React.ComponentType,
};

// Helper to get lazy field component
export function getLazyFieldComponent(
  type: string,
): React.ComponentType | null {
  return lazyFieldComponents[type] || null;
}
