'use client';

import { useState, useEffect } from 'react';
import BusinessPageContent from './business-page-content';
import BusinessHeader from './header';
import BusinessFooter from './footer';
import { Section } from '@/app/types/businesses';
import { Doc } from '@/convex/_generated/dataModel';

interface BusinessPreviewProps {
  business: Doc<"businesses">
  pageContent: {
    title: string;
    sections: Section[];
  };
  viewport?: 'mobile' | 'tablet' | 'desktop';
}

export default function BusinessPreview({ business, pageContent, viewport = 'desktop' }: BusinessPreviewProps) {
  const [scale, setScale] = useState(1);

  // Calculate scale based on viewport
  useEffect(() => {
    const container = document.getElementById('preview-container');
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    let targetWidth, targetHeight;
    switch (viewport) {
      case 'mobile':
        targetWidth = 375;
        targetHeight = 667;
        break;
      case 'tablet':
        targetWidth = 768;
        targetHeight = 1024;
        break;
      default:
        targetWidth = containerWidth;
        targetHeight = containerHeight;
        break;
    }

    if (viewport !== 'desktop') {
      const scaleX = containerWidth / targetWidth;
      const scaleY = containerHeight / targetHeight;
      setScale(Math.min(scaleX, scaleY, 1));
    } else {
      setScale(1);
    }
  }, [viewport]);

  const previewStyle = viewport !== 'desktop' ? {
    width: viewport === 'mobile' ? 375 : 768,
    height: viewport === 'mobile' ? 667 : 1024,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  } : {};

  return (
    <div 
      id="preview-container" 
      className="w-full h-full overflow-auto bg-white"
      style={{ 
        fontFamily: business.theme?.fontFamily || 'var(--font-sans)',
      }}
    >
      <div style={previewStyle} className="min-h-full">
        <style jsx>{`
          :root {
            --primary-color: ${business.theme?.primaryColor || '#000000'};
            --secondary-color: ${business.theme?.secondaryColor || '#f8f8f8'};
            --accent-color: ${business.theme?.accentColor || '#0070f3'};
          }
        `}</style>
        
        {/* Apply theme colors to the preview */}
        <div 
          className="min-h-screen flex flex-col"
          style={{
            '--primary': business.theme?.primaryColor || '#000000',
            '--secondary': business.theme?.secondaryColor || '#f8f8f8',
            '--accent': business.theme?.accentColor || '#0070f3',
          } as React.CSSProperties}
        >
          <BusinessHeader
            domain={business.name}
            pages={pages}
            currentSlug="home"
            businessUserId={business.userId}
          />

          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200">
            <div className="container flex items-center justify-center mx-auto">
              <div className="text-center">
                <p className="text-sm font-medium text-amber-800">
                  🔍 Preview Mode - This is how your website will look when published
                </p>
              </div>
            </div>
          </div>

          <BusinessPageContent 
            initialBusiness={business}
            content={pageContent}
          />
          
          <BusinessFooter businessName={business.name} />
        </div>
      </div>
    </div>
  );
}