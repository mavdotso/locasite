import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Loading component shown while the editor loads
const EditorLoadingState = () => (
  <div className="h-screen flex items-center justify-center bg-muted/30">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-sm text-muted-foreground">Loading visual editor...</p>
    </div>
  </div>
);

// Dynamically import the visual editor with code splitting
export const LazyVisualEditor = dynamic(
  () => import("./editor").then((mod) => mod.default),
  {
    loading: () => <EditorLoadingState />,
    ssr: false, // Disable SSR for the editor as it uses browser-only features
  },
);
