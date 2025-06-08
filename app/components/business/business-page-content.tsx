'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Doc } from '@/convex/_generated/dataModel';
import { Review } from '@/app/types/businesses';
import BusinessHero from "@/app/components/business/hero";
import BusinessInfo from "@/app/components/business/info";
import BusinessAbout from "@/app/components/business/about";
import BusinessGallery from "@/app/components/business/gallery";
import BusinessReviews from "@/app/components/business/reviews";
import BusinessContact from "@/app/components/business/contact";
import BusinessMap from "@/app/components/business/map";
import BusinessContactForm from "@/app/components/business/contact-form";
import { Section } from "@/app/types/businesses";

interface BusinessPageContentProps {
  initialBusiness: Doc<'businesses'>;
  content: { sections?: Section[] };
  isVisualEditor?: boolean;
}

export default function BusinessPageContent({ 
  initialBusiness, 
  content,
  isVisualEditor = false 
}: BusinessPageContentProps) {
  const [business, setBusiness] = useState(initialBusiness);
  const [isEditMode, setIsEditMode] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we're in edit mode
    const urlEditMode = searchParams.get('edit') === 'true';
    setIsEditMode(urlEditMode || isVisualEditor);

    // Listen for messages from the live editor
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, data, field, value } = event.data as {
        type: string;
        data?: Doc<'businesses'>;
        field?: string;
        value?: unknown;
      };

      switch (type) {
        case 'INIT_EDITOR':
          if (data) {
            setBusiness(data);
          }
          break;
        case 'LIVE_UPDATE':
          if (field && value !== undefined) {
            setBusiness((prev) => ({
              ...prev,
              [field]: value
            }));
          }
          break;
        case 'THEME_UPDATE':
          if (data) {
            setBusiness(data);
            // Apply theme changes to the document
            applyThemeToDocument(data.theme);
          }
          break;
        case 'BUSINESS_UPDATE':
          if (data) {
            setBusiness(data);
          }
          break;
      }
    };

    if (isEditMode) {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [searchParams, isEditMode, isVisualEditor]);

  const applyThemeToDocument = (theme: { primaryColor?: string; secondaryColor?: string; fontFamily?: string } | undefined) => {
    if (!theme) return;

    const root = document.documentElement;
    
    if (theme.primaryColor) {
      root.style.setProperty('--live-primary-color', theme.primaryColor);
    }
    
    if (theme.secondaryColor) {
      root.style.setProperty('--live-secondary-color', theme.secondaryColor);
    }
    
    if (theme.fontFamily) {
      root.style.setProperty('--live-font-family', theme.fontFamily);
    }
  };

  return (
    <>
      {isEditMode && (
        <style jsx global>{`
          :root {
            --live-primary-color: ${business.theme?.primaryColor || '#3B82F6'};
            --live-secondary-color: ${business.theme?.secondaryColor || '#6B7280'};
            --live-font-family: ${business.theme?.fontFamily || 'Inter'};
          }
          
          body {
            font-family: var(--live-font-family), sans-serif !important;
          }
          
          .live-theme-primary {
            color: var(--live-primary-color) !important;
          }
          
          .live-theme-primary-bg {
            background-color: var(--live-primary-color) !important;
          }
          
          .live-theme-secondary {
            color: var(--live-secondary-color) !important;
          }
          
          .live-theme-secondary-bg {
            background-color: var(--live-secondary-color) !important;
          }
        `}</style>
      )}
      
      <main className="flex-grow">
        {content.sections?.map((section: Section, index: number) => {
          switch (section.type) {
            case "hero":
              return (
                <div key={index} className={section.hidden ? 'hidden' : ''}>
                  <BusinessHero
                    title={section.title}
                    subtitle={section.subtitle}
                    image={section.image}
                    data-editable={`sections[${index}].title`}
                    data-editable-subtitle={`sections[${index}].subtitle`}
                  />
                </div>
              );
            case "info":
              return (
                <div key={index} className={section.hidden ? 'hidden' : ''}>
                  <BusinessInfo
                    address={section.address || business.address}
                    phone={section.phone || business.phone}
                    email={section.email || business.email}
                    website={section.website || business.website}
                    hours={section.hours || business.hours}
                  />
                </div>
              );
            case "about":
              return (
                <div key={index} className={section.hidden ? 'hidden' : ''}>
                  <BusinessAbout 
                    content={section.content} 
                    data-editable={`sections[${index}].content`}
                  />
                </div>
              );
            case "gallery":
              return (
                <div key={index} className={section.hidden ? 'hidden' : ''}>
                  <BusinessGallery
                    images={section.images || business.photos || []}
                  />
                </div>
              );
            case "reviews":
              return (
                <div key={index} className={section.hidden ? 'hidden' : ''}>
                  <BusinessReviews reviews={section.items as Review[] | undefined} />
                </div>
              );
            case "contact":
              return (
                <div key={index} className={section.hidden ? 'hidden' : ''}>
                  <BusinessContact
                    title={section.title}
                    subtitle={section.subtitle}
                    phone={business.phone}
                    email={business.email}
                    address={business.address}
                  />
                </div>
              );
            case "map":
              return (
                <div key={index} className={section.hidden ? 'hidden' : ''}>
                  <BusinessMap
                    address={section.address || business.address}
                  />
                </div>
              );
            case "contactForm":
              return (
                <div key={index} className={section.hidden ? 'hidden' : ''}>
                  <BusinessContactForm businessId={business._id} title={section.title} />
                </div>
              );
            case "header":
              return (
                <div key={index} className="container px-4 py-12 mx-auto">
                  <h1 className="text-3xl font-bold text-center md:text-4xl">
                    {section.title}
                  </h1>
                </div>
              );
            case "content":
              return (
                <div key={index} className="container px-4 py-8 mx-auto">
                  <div className="mx-auto prose max-w-none">{section.text}</div>
                </div>
              );
            case "contactInfo":
              return (
                <div key={index} className="container px-4 py-8 mx-auto">
                  <div className="max-w-lg p-6 mx-auto bg-card rounded-lg shadow">
                    <h3 className="mb-4 text-xl font-semibold">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <p>
                        <strong>Address:</strong> {section.address}
                      </p>
                      {section.phone && (
                        <p>
                          <strong>Phone:</strong> {section.phone}
                        </p>
                      )}
                      <div>
                        <strong>Hours:</strong>
                        <ul className="pl-0 mt-1 list-none">
                          {section.hours?.map((hour, i) => (
                            <li
                              key={i}
                              className="py-1 text-sm border-b border-border"
                            >
                              {hour}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </main>
    </>
  );
}