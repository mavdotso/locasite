"use client";

import { notFound, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LazyVisualEditor as VisualEditor } from "@/app/components/visual-editor/lazy-editor";
import type { PageData } from "@/app/components/visual-editor/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

interface Section {
  type: string;
  hidden?: boolean;
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  images?: string[];
  buttonText?: string;
  buttonLink?: string;
  [key: string]: unknown;
}

export default function BusinessEditClient({
  businessId,
}: {
  businessId: Id<"businesses">;
}) {
  const router = useRouter();
  
  // All hooks must be called before any conditional returns
  const user = useQuery(api.auth.currentUser);
  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, 
    business ? { businessId: business._id } : "skip"
  );
  const pages = useQuery(api.pages.listByDomain, 
    domain ? { domainId: domain._id } : "skip"
  );
  const updatePage = useMutation(api.pages.updatePage);
  const createDefaultPages = useMutation(api.pages.createDefaultPages);
  
  // Handle authentication
  useEffect(() => {
    if (user === null) {
      // User is not authenticated, redirect to sign-in with redirect back to this page
      router.push(`/sign-in?redirect=/business/${businessId}/edit`);
    }
  }, [user, businessId, router]);
  
  // Loading state while fetching user or business
  if (user === undefined || business === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // User not authenticated (null)
  if (user === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Business not found
  if (business === null) {
    return notFound();
  }
  
  // Check ownership - only allow owner to edit
  if (business.userId && business.userId !== user._id) {
    router.push(`/dashboard/sites`);
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Get the single page or create initial data
  const page = pages?.[0];
  
  let initialData: PageData = {
    title: business?.name || "Welcome",
    components: []
  };

  if (page?.content) {
    try {
      const parsed = JSON.parse(page.content);
      
      // Convert from section-based format to component-based format
      if (parsed.sections) {
        initialData = {
          title: parsed.title || business?.name || "Welcome",
          components: parsed.sections.map((section: Section, index: number) => ({
            id: `component-${index}`,
            type: mapSectionTypeToComponent(section.type),
            props: mapSectionPropsToComponentProps(section)
          }))
        };
      } else if (parsed.components) {
        initialData = parsed;
      }
    } catch (e) {
      console.error("Failed to parse page content", e);
    }
  }

  const handleSave = async (data: PageData) => {
    try {
      if (page) {
        await updatePage({
          pageId: page._id,
          content: JSON.stringify(data)
        });
      } else if (domain) {
        // Create default page first if no page exists
        await createDefaultPages({
          domainId: domain._id,
          businessId: businessId
        });
        // Note: After creating default pages, user needs to refresh to see them
        toast.info("Default pages created. Please refresh to continue editing.");
      }
      // Remove the toast here as the editor already shows a toast
      // Remove the redirect - stay on the edit page
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Failed to save page");
    }
  };

  // Debug logging
  console.log('Business Edit Client Debug:', {
    businessId,
    business: business?.name,
    domain: domain?.subdomain,
    pagesCount: pages?.length || 0,
    pages: pages?.map(p => ({ id: p._id, content: p.content ? 'has content' : 'no content' }))
  });

  if (!domain || !pages) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your website...</p>
          {business && <p className="text-sm text-muted-foreground mt-2">{business.name}</p>}
        </div>
      </div>
    );
  }


  return (
    <VisualEditor
      businessId={businessId}
      business={business}
      pageId={page?._id || ("temp-id" as Id<"pages">)}
      initialData={initialData}
      onSave={handleSave}
    />
  );
}

// Helper functions to map between old section format and new component format
function mapSectionTypeToComponent(sectionType: string): string {
  const typeMap: Record<string, string> = {
    hero: "HeroBlock",
    about: "AboutBlock",
    gallery: "GalleryBlock",
    reviews: "TestimonialsBlock",
    contact: "ContactBlock",
    contactForm: "ContactBlock",
    info: "ContactBlock",
    map: "ContactBlock",
    hours: "ContactBlock",
    services: "ServicesBlock",
    whyChooseUs: "ServicesBlock"
  };
  return typeMap[sectionType] || sectionType;
}

function mapSectionPropsToComponentProps(section: Section): Record<string, unknown> {
  const { type, ...props } = section;
  
  // Map specific section properties to component props
  switch (type) {
    case "hero":
      return {
        title: props.title || "",
        subtitle: props.subtitle || "",
        backgroundImage: props.image || "",
        overlayOpacity: 0.5,
        height: "large",
        buttons: props.buttonText ? [
          {
            text: props.buttonText || "Get Started",
            link: props.buttonLink || "#contact",
            variant: "default"
          }
        ] : []
      };
    
    case "about":
      return {
        title: "About Us",
        content: props.content || "",
        image: "",
        imagePosition: "right",
        backgroundColor: "default"
      };
    
    case "gallery":
      return {
        title: "Photo Gallery",
        layout: "grid",
        columns: 3,
        images: (props.images || []).map((img: string) => ({
          url: img,
          caption: ""
        }))
      };
    
    case "reviews":
      return {
        title: "What Our Customers Say",
        layout: "grid",
        testimonials: ((props as { items?: Array<{ reviewer: string; text: string; rating: number }> }).items || []).map((review) => ({
          name: review.reviewer || "Customer",
          role: "",
          content: review.text || "",
          rating: review.rating || 5,
          image: ""
        }))
      };
    
    case "contact":
    case "contactForm":
    case "info":
    case "map":
    case "hours":
      return {
        title: props.title || "Get in Touch",
        subtitle: props.subtitle || "We'd love to hear from you",
        showPhone: "yes",
        showEmail: "yes",
        showAddress: "yes",
        showHours: type === "hours" ? "yes" : "no",
        showMap: type === "map" ? "yes" : "no"
      };
    
    case "services":
      return {
        title: props.title || "Our Services",
        subtitle: "What we offer",
        layout: "grid3",
        services: ((props as { items?: Array<{ name?: string; title?: string; description?: string; price?: string }> }).items || []).map((service) => ({
          icon: "briefcase",
          title: service.name || service.title || "Service",
          description: service.description || "",
          price: service.price || ""
        }))
      };
    
    case "whyChooseUs":
      return {
        title: props.title || "Why Choose Us",
        subtitle: "",
        layout: "grid2",
        services: ((props as { points?: string[] }).points || []).map((point: string) => ({
          icon: "check",
          title: point,
          description: "",
          price: ""
        }))
      };
    
    default:
      return props;
  }
}