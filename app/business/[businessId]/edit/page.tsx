"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { VisualEditor, PageData } from "@/app/components/visual-editor";
import AuthGuard from "@/app/components/auth/auth-guard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

export default function BusinessEditPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const resolvedParams = use(params);
  const businessId = resolvedParams.businessId as Id<"businesses">;

  console.log("BusinessEditPage - businessId:", businessId);

  // Fetch business and pages
  const business = useQuery(api.businesses.getById, { id: businessId });
  
  console.log("Business query result:", business);
  
  const domain = useQuery(api.domains.getByBusinessId, 
    business ? { businessId: business._id } : "skip"
  );
  const pages = useQuery(api.pages.listByDomain, 
    domain ? { domainId: domain._id } : "skip"
  );
  const updatePage = useMutation(api.pages.updatePage);
  const createDefaultPages = useMutation(api.pages.createDefaultPages);

  // Loading state while fetching business
  if (business === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Business not found
  if (business === null) {
    console.error("Business not found for ID:", businessId);
    return notFound();
  }

  // Get the home page or create initial data
  const homePage = pages?.find(p => p.slug === "home");
  
  let initialData: PageData = {
    title: business?.name || "Welcome",
    components: []
  };

  if (homePage?.content) {
    try {
      const parsed = JSON.parse(homePage.content);
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
      if (homePage) {
        await updatePage({
          pageId: homePage._id,
          content: JSON.stringify(data)
        });
      } else if (domain) {
        // Create default pages first if no home page exists
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

  if (!domain || !pages) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <VisualEditor
        businessId={businessId}
        business={business}
        pageId={homePage?._id || ("temp-id" as Id<"pages">)}
        initialData={initialData}
        onSave={handleSave}
      />
    </AuthGuard>
  );
}

// Helper functions to map between old section format and new component format
function mapSectionTypeToComponent(sectionType: string): string {
  const typeMap: Record<string, string> = {
    hero: "HeroSectionBlock",
    about: "AboutSectionBlock",
    gallery: "GallerySectionBlock",
    reviews: "TestimonialsSectionBlock",
    contact: "ContactSectionBlock",
    contactForm: "ContactSectionBlock",
    info: "ContactSectionBlock",
    map: "ContactSectionBlock",
    hours: "ContactSectionBlock",
    services: "ServicesSectionBlock",
    whyChooseUs: "ServicesSectionBlock"
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