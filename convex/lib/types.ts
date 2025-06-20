// Common AI content generation interfaces
export interface AIContentResult {
    hero?: {
        title: string;
        subtitle: string;
    };
    about?: {
        content: string;
    };
    services?: {
        title: string;
        items: Array<{
            title: string;
            description: string;
        }>;
    };
    whyChooseUs?: {
        title: string;
        points: string[];
    };
    callToAction?: {
        primary: string;
        secondary: string;
        urgency: string;
    };
    seo?: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
    testimonials?: {
        title: string;
        items: Array<{
            name: string;
            text: string;
            rating: number;
        }>;
    };
}

// Page section types - using discriminated unions for better type safety
export type PageSection =
    | {
        type: "hero";
        title: string;
        subtitle?: string;
        backgroundImage?: string;
        ctaText?: string;
        ctaLink?: string;
    }
    | {
        type: "about";
        title: string;
        content: string;
    }
    | {
        type: "services";
        title: string;
        items: Array<{
            name: string;
            description: string;
            icon?: string;
        }>;
    }
    | {
        type: "gallery";
        title: string;
        images: string[];
    }
    | {
        type: "contact";
        title: string;
        showForm: boolean;
        phone?: string;
        email?: string;
        address?: string;
    }
    | {
        type: "testimonials";
        title: string;
        items: Array<{
            name: string;
            text: string;
            rating: number;
        }>;
    };

// Business data interface for consistency across files
export interface StandardBusinessData {
    name: string;
    placeId: string;
    address: string;
    phone?: string;
    website?: string;
    hours: string[];
    rating?: number;
    reviews: Array<{
        reviewer: string;
        rating: number;
        text: string;
    }>;
    description?: string;
    images?: string[];
}

// Partial business data interface for AI functions where not all fields are required
export interface PartialBusinessData {
    name: string;
    address?: string;
    description?: string;
    phone?: string;
    website?: string;
    rating?: number;
}