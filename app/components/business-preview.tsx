'use client';

import { BusinessData } from '@/convex/businesses';
import { Id } from '@/convex/_generated/dataModel';
import BusinessHeader from "@/app/components/business/header";
import BusinessFooter from "@/app/components/business/footer";
import BusinessHero from "@/app/components/business/hero";
import BusinessInfo from "@/app/components/business/info";
import BusinessAbout from "@/app/components/business/about";
import BusinessGallery from "@/app/components/business/gallery";
import BusinessReviews from "@/app/components/business/reviews";
import BusinessContact from "@/app/components/business/contact";
import BusinessMap from "@/app/components/business/map";
import { Button } from "@/app/components/ui/button";
import { useRouter } from 'next/navigation';

interface BusinessPreviewProps {
  businessData: BusinessData;
  onGetStarted?: () => void;
}

export default function BusinessPreview({ businessData, onGetStarted }: BusinessPreviewProps) {
  const router = useRouter();

  // Default page structure for preview
  const defaultSections = [
    {
      type: "hero",
      title: businessData.name,
      subtitle: businessData.description || `Welcome to ${businessData.name}`,
      image: businessData.photos?.[0]
    },
    {
      type: "info"
    },
    {
      type: "about",
      content: businessData.description || `Learn more about ${businessData.name}`
    },
    ...(businessData.photos && businessData.photos.length > 0 ? [{
      type: "gallery"
    }] : []),
    ...(businessData.reviews && businessData.reviews.length > 0 ? [{
      type: "reviews",
      items: businessData.reviews.map(review => ({
        author_name: review.reviewer,
        rating: review.rating,
        text: review.text
      }))
    }] : []),
    {
      type: "contact"
    },
    {
      type: "map"
    }
  ];

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      // Store business data in session storage for after signup
      sessionStorage.setItem('pendingBusiness', JSON.stringify(businessData));
      router.push('/sign-in');
    }
  };

  return (
    <div className="relative">
      {/* Preview Banner */}
      <div className="sticky top-0 z-50 bg-blue-600 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Preview Mode</span>
            <span className="text-blue-100 text-sm">See how your business website will look</span>
          </div>
          <Button 
            onClick={handleGetStarted}
            className="bg-background text-blue-600 hover:bg-muted font-semibold"
          >
            Publish Website
          </Button>
        </div>
      </div>

      {/* Business Website Preview */}
      <div className="flex flex-col min-h-screen">
      <BusinessHeader
        domain={businessData.name}
        pages={[
          {
            _id: 'home' as Id<"pages">,
            _creationTime: 0,
            domainId: '' as Id<"domains">,
            slug: 'home',
            content: ''
          }
        ]}
        currentSlug="home"
      />

        <main className="flex-grow">
          {defaultSections.map((section, index) => {
            switch (section.type) {
              case "hero":
                return (
                  <BusinessHero
                    key={index}
                    title={section.title}
                    subtitle={section.subtitle}
                    image={section.image}
                  />
                );
              case "info":
                return (
                  <BusinessInfo
                    key={index}
                    address={businessData.address}
                    phone={businessData.phone}
                    email=""
                    website={businessData.website}
                    hours={businessData.hours}
                  />
                );
              case "about":
                return <BusinessAbout key={index} content={section.content} />;
              case "gallery":
                return (
                  <BusinessGallery
                    key={index}
                    images={businessData.photos || []}
                  />
                );
              case "reviews":
                return <BusinessReviews key={index} reviews={section.items} />;
              case "contact":
                return (
                  <BusinessContact
                    key={index}
                    title="Contact Us"
                    subtitle="Get in touch with us"
                    phone={businessData.phone}
                    email=""
                    address={businessData.address}
                  />
                );
              case "map":
                return (
                  <BusinessMap
                    key={index}
                    address={businessData.address}
                  />
                );
              default:
                return null;
            }
          })}
        </main>
        
        <BusinessFooter businessName={businessData.name} />
      </div>
    </div>
  );
}