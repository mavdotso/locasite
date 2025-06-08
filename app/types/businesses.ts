
export interface Review {
    author_name: string;
    rating: string;
    text: string;
}

export interface Section {
    type: string;
    title?: string;
    subtitle?: string;
    content?: string;
    image?: string;
    images?: string[];
    items?: Review[] | ServiceItem[];
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    hours?: string[];
    text?: string;
    hidden?: boolean;
    // For services section
    // For whyChooseUs section
    points?: string[];
    // For contact section with CTAs
    primaryCTA?: string;
    secondaryCTA?: string;
}

export interface ServiceItem {
    title: string;
    description: string;
}
