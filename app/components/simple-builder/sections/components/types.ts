// Shared types for section components

export interface BaseContentUpdate {
  title: string;
  [key: string]: unknown;
}

export interface HeroContentUpdate extends BaseContentUpdate {
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  image?: string;
  imageAlt?: string;
}

export interface HeaderContentUpdate {
  logo: string;
  logoAlt: string;
  menuItems: Array<{ label: string; link: string; enabled?: boolean }>;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  [key: string]: unknown;
}

export interface AboutContentUpdate extends BaseContentUpdate {
  content?: string;
  image?: string;
  imagePosition?: "left" | "right";
  column1?: string;
  column2?: string;
  timeline?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
}

export interface Service {
  title: string;
  description: string;
  icon?: string;
  features?: string[];
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
}

export interface ServicesContentUpdate extends BaseContentUpdate {
  services?: Service[];
  pricingTiers?: PricingTier[];
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface Comparison {
  before: GalleryImage;
  after: GalleryImage;
  title: string;
}

export interface GalleryContentUpdate {
  title?: string;
  images?: GalleryImage[];
  columns?: number;
  comparisons?: Comparison[];
  [key: string]: unknown;
}

export interface ContactCard {
  icon: string;
  title: string;
  info: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ContactContentUpdate extends BaseContentUpdate {
  subtitle?: string;
  showForm?: boolean;
  showMap?: boolean;
  showInfo?: boolean;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  cards?: ContactCard[];
  socialLinks?: SocialLink[];
}
