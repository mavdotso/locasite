import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Lazy load the visual editor for better performance
export const LazyVisualEditor = dynamic(
  () => import('./editor'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading visual editor...</p>
        </div>
      </div>
    ),
    ssr: false // Disable SSR for editor since it uses client-side features
  }
);