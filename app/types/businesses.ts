
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
    items?: Review[];
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    hours?: string[];
    text?: string;
}
