import { ComponentData } from '@/app/components/visual-editor/types';

export interface BusinessTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  sections: ComponentData[];
  themePreset?: string;
}

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Restaurant/Food Service Template
export const restaurantTemplate: BusinessTemplate = {
  id: 'restaurant',
  name: 'Restaurant & Food Service',
  description: 'Perfect for restaurants, cafes, bars, and food trucks',
  category: 'food',
  icon: 'utensils',
  themePreset: 'restaurant',
  sections: [
    {
      id: generateId(),
      type: 'SectionBlock',
      props: {
        backgroundColor: 'default',
        padding: 'none',
        fullWidth: 'yes'
      },
      children: [{
        id: generateId(),
        type: 'HeroSection',
        props: {
          title: 'Welcome to {businessName}',
          subtitle: 'Experience authentic flavors in a warm atmosphere',
          backgroundImage: '{businessPhoto}',
          height: 'large',
          overlay: 'dark',
          alignment: 'center'
        }
      }]
    },
    {
      id: generateId(),
      type: 'SectionBlock',
      props: {
        backgroundColor: 'default',
        padding: 'large'
      },
      children: [{
        id: generateId(),
        type: 'AboutSection',
        props: {
          title: 'Our Story',
          showImage: 'yes',
          imagePosition: 'right'
        }
      }]
    },
    {
      id: generateId(),
      type: 'MenuPriceListSection',
      props: {
        title: 'Our Menu',
        subtitle: 'Fresh ingredients, authentic recipes',
        layout: 'tabs',
        showDescriptions: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'SpecialOffersSection',
      props: {
        title: 'Special Offers',
        layout: 'banner'
      }
    },
    {
      id: generateId(),
      type: 'GoogleReviewsSection',
      props: {
        title: 'What Our Guests Say',
        showRating: 'yes',
        reviewSource: 'mixed',
        layout: 'grid',
        reviewsPerRow: '3',
        maxReviews: 6
      }
    },
    {
      id: generateId(),
      type: 'OperatingHoursSection',
      props: {
        title: 'Hours & Location',
        layout: 'split',
        showSpecialHours: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'CTABannerSection',
      props: {
        title: 'Ready to Dine With Us?',
        subtitle: 'Book your table now or order online',
        primaryButtonText: 'Make Reservation',
        secondaryButtonText: 'Order Online',
        layout: 'gradient',
        showPhone: 'yes'
      }
    }
  ]
};

// Healthcare/Medical Template
export const healthcareTemplate: BusinessTemplate = {
  id: 'healthcare',
  name: 'Healthcare & Medical',
  description: 'Ideal for clinics, dental offices, medical practices',
  category: 'medical',
  icon: 'heart',
  themePreset: 'healthcare',
  sections: [
    {
      id: generateId(),
      type: 'SectionBlock',
      props: {
        backgroundColor: 'default',
        padding: 'none',
        fullWidth: 'yes'
      },
      children: [{
        id: generateId(),
        type: 'HeroSection',
        props: {
          title: 'Your Health, Our Priority',
          subtitle: 'Comprehensive medical care with a personal touch',
          backgroundImage: '{businessPhoto}',
          height: 'medium',
          overlay: 'light',
          alignment: 'left'
        }
      }]
    },
    {
      id: generateId(),
      type: 'FeaturesSection',
      props: {
        title: 'Why Choose Our Practice',
        subtitle: 'Committed to your health and wellbeing',
        layout: 'grid',
        iconStyle: 'circle',
        columns: '3'
      }
    },
    {
      id: generateId(),
      type: 'ServicesDetailedSection',
      props: {
        title: 'Our Services',
        subtitle: 'Comprehensive care for all your health needs',
        layout: 'cards',
        showFeatures: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'TeamSection',
      props: {
        title: 'Meet Our Medical Team',
        subtitle: 'Experienced professionals dedicated to your care',
        layout: 'grid',
        teamSize: '3'
      }
    },
    {
      id: generateId(),
      type: 'ProcessTimelineSection',
      props: {
        title: 'Your First Visit',
        subtitle: 'What to expect when you visit our practice',
        layout: 'timeline',
        showConnectors: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'FAQSection',
      props: {
        title: 'Common Questions',
        layout: 'accordion'
      }
    },
    {
      id: generateId(),
      type: 'GoogleReviewsSection',
      props: {
        title: 'Patient Testimonials',
        showRating: 'yes',
        reviewSource: 'mixed',
        layout: 'featured',
        maxReviews: 5
      }
    },
    {
      id: generateId(),
      type: 'ContactSection',
      props: {
        title: 'Schedule Your Appointment',
        showForm: 'yes',
        showMap: 'yes'
      }
    }
  ]
};

// Professional Services Template
export const professionalServicesTemplate: BusinessTemplate = {
  id: 'professional',
  name: 'Professional Services',
  description: 'For consultants, lawyers, accountants, agencies',
  category: 'services',
  icon: 'briefcase',
  themePreset: 'professional',
  sections: [
    {
      id: generateId(),
      type: 'SectionBlock',
      props: {
        backgroundColor: 'default',
        padding: 'none',
        fullWidth: 'yes'
      },
      children: [{
        id: generateId(),
        type: 'HeroSection',
        props: {
          title: 'Professional Excellence',
          subtitle: 'Trusted expertise for your business success',
          backgroundImage: '{businessPhoto}',
          height: 'medium',
          overlay: 'gradient',
          alignment: 'center'
        }
      }]
    },
    {
      id: generateId(),
      type: 'StatsCounterSection',
      props: {
        title: 'Our Track Record',
        subtitle: 'Numbers that speak for themselves',
        layout: 'grid',
        backgroundColor: 'muted'
      }
    },
    {
      id: generateId(),
      type: 'ServicesDetailedSection',
      props: {
        title: 'Our Expertise',
        subtitle: 'Comprehensive solutions for your needs',
        layout: 'list',
        showFeatures: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'ProcessTimelineSection',
      props: {
        title: 'How We Work',
        subtitle: 'Our proven approach to success',
        layout: 'cards',
        showConnectors: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'TeamSection',
      props: {
        title: 'Our Leadership',
        subtitle: 'Meet the experts behind our success',
        layout: 'featured',
        showSocial: 'yes',
        teamSize: '4'
      }
    },
    {
      id: generateId(),
      type: 'GoogleReviewsSection',
      props: {
        title: 'Client Success Stories',
        showRating: 'yes',
        reviewSource: 'mixed',
        layout: 'grid',
        reviewsPerRow: '2',
        maxReviews: 4
      }
    },
    {
      id: generateId(),
      type: 'CTABannerSection',
      props: {
        title: 'Ready to Transform Your Business?',
        subtitle: 'Schedule a consultation today',
        primaryButtonText: 'Book Consultation',
        secondaryButtonText: 'Download Brochure',
        layout: 'split',
        urgencyText: 'Limited slots available this month'
      }
    }
  ]
};

// Home Services Template
export const homeServicesTemplate: BusinessTemplate = {
  id: 'home-services',
  name: 'Home Services',
  description: 'For contractors, plumbers, electricians, cleaners',
  category: 'home',
  icon: 'home',
  themePreset: 'services',
  sections: [
    {
      id: generateId(),
      type: 'SectionBlock',
      props: {
        backgroundColor: 'default',
        padding: 'none',
        fullWidth: 'yes'
      },
      children: [{
        id: generateId(),
        type: 'HeroSection',
        props: {
          title: 'Quality Home Services You Can Trust',
          subtitle: 'Professional, reliable, and affordable',
          backgroundImage: '{businessPhoto}',
          height: 'large',
          overlay: 'dark',
          alignment: 'left'
        }
      }]
    },
    {
      id: generateId(),
      type: 'FeaturesSection',
      props: {
        title: 'Why Homeowners Choose Us',
        subtitle: 'Your satisfaction is our priority',
        layout: 'alternating',
        iconStyle: 'square',
        columns: '2'
      }
    },
    {
      id: generateId(),
      type: 'ServicesDetailedSection',
      props: {
        title: 'Our Services',
        subtitle: 'Complete home solutions under one roof',
        layout: 'cards',
        showFeatures: 'yes',
        showPricing: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'BeforeAfterSection',
      props: {
        title: 'Our Recent Projects',
        subtitle: 'See the quality of our work',
        layout: 'side-by-side',
        showLabels: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'ProcessTimelineSection',
      props: {
        title: 'Our Service Process',
        subtitle: 'From call to completion',
        layout: 'vertical',
        showConnectors: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'SpecialOffersSection',
      props: {
        title: 'Current Promotions',
        layout: 'grid'
      }
    },
    {
      id: generateId(),
      type: 'GoogleReviewsSection',
      props: {
        title: 'Hear From Our Customers',
        showRating: 'yes',
        reviewSource: 'mixed',
        layout: 'grid',
        reviewsPerRow: '3',
        maxReviews: 9,
        showAuthorImage: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'CTABannerSection',
      props: {
        title: 'Need Our Services?',
        subtitle: 'Get a free quote today',
        primaryButtonText: 'Get Free Quote',
        secondaryButtonText: 'Call Now',
        layout: 'pattern',
        showPhone: 'yes',
        urgencyText: '24/7 Emergency Service Available'
      }
    }
  ]
};

// Beauty & Wellness Template
export const beautyWellnessTemplate: BusinessTemplate = {
  id: 'beauty-wellness',
  name: 'Beauty & Wellness',
  description: 'For salons, spas, fitness centers, wellness clinics',
  category: 'wellness',
  icon: 'sparkles',
  themePreset: 'beauty',
  sections: [
    {
      id: generateId(),
      type: 'SectionBlock',
      props: {
        backgroundColor: 'default',
        padding: 'none',
        fullWidth: 'yes'
      },
      children: [{
        id: generateId(),
        type: 'HeroSection',
        props: {
          title: 'Discover Your Best Self',
          subtitle: 'Where beauty meets wellness',
          backgroundImage: '{businessPhoto}',
          height: 'large',
          overlay: 'gradient',
          alignment: 'center'
        }
      }]
    },
    {
      id: generateId(),
      type: 'AboutSection',
      props: {
        title: 'Welcome to Our Sanctuary',
        showImage: 'yes',
        imagePosition: 'left'
      }
    },
    {
      id: generateId(),
      type: 'ServicesDetailedSection',
      props: {
        title: 'Our Treatments',
        subtitle: 'Indulge in our signature services',
        layout: 'cards',
        showFeatures: 'no',
        showPricing: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'TeamSection',
      props: {
        title: 'Meet Our Specialists',
        subtitle: 'Certified professionals passionate about your wellbeing',
        layout: 'grid',
        teamSize: '4'
      }
    },
    {
      id: generateId(),
      type: 'BeforeAfterSection',
      props: {
        title: 'Transformations',
        subtitle: 'Real results from real clients',
        layout: 'grid',
        showLabels: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'SpecialOffersSection',
      props: {
        title: 'Special Packages',
        layout: 'carousel'
      }
    },
    {
      id: generateId(),
      type: 'GoogleReviewsSection',
      props: {
        title: 'Client Love',
        showRating: 'yes',
        reviewSource: 'mixed',
        layout: 'masonry',
        maxReviews: 8,
        showDate: 'no'
      }
    },
    {
      id: generateId(),
      type: 'LocationDirectionsSection',
      props: {
        title: 'Visit Our Studio',
        showMap: 'yes',
        showDirections: 'yes',
        parkingInfo: 'Free parking available'
      }
    },
    {
      id: generateId(),
      type: 'CTABannerSection',
      props: {
        title: 'Ready to Pamper Yourself?',
        subtitle: 'Book your appointment today',
        primaryButtonText: 'Book Now',
        secondaryButtonText: 'Gift Cards',
        layout: 'gradient',
        urgencyText: 'New client special - 20% off first visit'
      }
    }
  ]
};

// Retail/E-commerce Template
export const retailTemplate: BusinessTemplate = {
  id: 'retail',
  name: 'Retail & Shopping',
  description: 'For stores, boutiques, and retail businesses',
  category: 'retail',
  icon: 'shopping-bag',
  themePreset: 'retail',
  sections: [
    {
      id: generateId(),
      type: 'SectionBlock',
      props: {
        backgroundColor: 'default',
        padding: 'none',
        fullWidth: 'yes'
      },
      children: [{
        id: generateId(),
        type: 'HeroSection',
        props: {
          title: 'Discover Something Special',
          subtitle: 'Unique finds for every style',
          backgroundImage: '{businessPhoto}',
          height: 'medium',
          overlay: 'light',
          alignment: 'center'
        }
      }]
    },
    {
      id: generateId(),
      type: 'FeaturesSection',
      props: {
        title: 'Why Shop With Us',
        subtitle: 'More than just a store',
        layout: 'grid',
        iconStyle: 'none',
        columns: '4'
      }
    },
    {
      id: generateId(),
      type: 'GallerySection',
      props: {
        title: 'Featured Products',
        columns: '4',
        showCaptions: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'SpecialOffersSection',
      props: {
        title: 'Current Promotions',
        layout: 'banner'
      }
    },
    {
      id: generateId(),
      type: 'StatsCounterSection',
      props: {
        title: '',
        layout: 'inline',
        backgroundColor: 'primary',
        showIcons: 'no'
      }
    },
    {
      id: generateId(),
      type: 'GoogleReviewsSection',
      props: {
        title: 'Happy Customers',
        showRating: 'yes',
        reviewSource: 'mixed',
        layout: 'carousel',
        maxReviews: 10
      }
    },
    {
      id: generateId(),
      type: 'OperatingHoursSection',
      props: {
        title: 'Store Hours',
        layout: 'simple',
        showSpecialHours: 'yes'
      }
    },
    {
      id: generateId(),
      type: 'CTABannerSection',
      props: {
        title: 'Visit Us Today!',
        subtitle: 'New arrivals every week',
        primaryButtonText: 'Get Directions',
        secondaryButtonText: 'Join Our Newsletter',
        layout: 'centered',
        urgencyText: 'Sale ends this weekend!'
      }
    }
  ]
};

// All templates collection
export const businessTemplates: BusinessTemplate[] = [
  restaurantTemplate,
  healthcareTemplate,
  professionalServicesTemplate,
  homeServicesTemplate,
  beautyWellnessTemplate,
  retailTemplate
];

// Helper function to get template by category
export function getTemplateByCategory(category: string): BusinessTemplate | undefined {
  return businessTemplates.find(template => 
    template.category === category || template.id === category
  );
}

// Helper function to apply template with business data
export function applyTemplateData(
  template: BusinessTemplate, 
  businessData: {
    name?: string;
    photos?: string[];
    address?: string;
    phone?: string;
  }
): ComponentData[] {
  // Deep clone the template sections
  const sections = JSON.parse(JSON.stringify(template.sections));
  
  // Replace placeholders with actual business data
  const replacePlaceholders = <T>(obj: T): T => {
    if (typeof obj === 'string') {
      return obj
        .replace('{businessName}', businessData.name || '')
        .replace('{businessPhoto}', businessData.photos?.[0] || '')
        .replace('{businessAddress}', businessData.address || '')
        .replace('{businessPhone}', businessData.phone || '') as T;
    }
    if (Array.isArray(obj)) {
      return obj.map(replacePlaceholders) as T;
    }
    if (typeof obj === 'object' && obj !== null) {
      const newObj = {} as T;
      for (const key in obj) {
        (newObj as Record<string, unknown>)[key] = replacePlaceholders(obj[key]);
      }
      return newObj;
    }
    return obj;
  };
  
  return replacePlaceholders(sections);
}