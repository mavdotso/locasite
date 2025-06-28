import { PageData } from "../types";

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Restaurant Template
export const restaurantTemplate: PageData = {
  title: "Restaurant Template",
  components: [
    {
      id: generateId(),
      type: "HeaderSection",
      props: {
        logoText: "Your Restaurant",
        menuItems: [
          "Home|#",
          "Menu|#menu",
          "About|#about",
          "Gallery|#gallery",
          "Contact|#contact"
        ],
        showCtaButton: "yes",
        ctaButtonLabel: "Reserve Table",
        ctaButtonHref: "tel:"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "HeroSection",
      props: {
        headline: "Welcome to Your Restaurant",
        subheadline: "Experience authentic cuisine in a warm, inviting atmosphere",
        backgroundImage: "",
        overlayOpacity: 60,
        primaryButtonText: "View Menu",
        primaryButtonLink: "#menu",
        secondaryButtonText: "Reserve Table",
        secondaryButtonLink: "#contact",
        showSecondaryButton: "yes",
        alignment: "center",
        height: "large"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "AboutSection",
      props: {
        title: "Our Story",
        content: "Founded in 2020, we've been serving delicious, authentic cuisine made with fresh, locally-sourced ingredients. Our passion for food and commitment to excellence has made us a favorite dining destination.",
        image: "",
        imagePosition: "right",
        features: [
          "Fresh, Local Ingredients",
          "Authentic Recipes",
          "Warm Atmosphere",
          "Excellent Service"
        ]
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "MenuPriceListSection",
      props: {
        title: "Our Menu",
        subtitle: "Discover our delicious offerings",
        categories: [
          "Appetizers|Starters to share",
          "Main Courses|Signature dishes",
          "Desserts|Sweet endings",
          "Beverages|Drinks & cocktails"
        ],
        items: [
          "Appetizers|Spring Rolls|Fresh vegetables wrapped in rice paper|$8.99",
          "Appetizers|Soup of the Day|Chef's daily creation|$6.99",
          "Main Courses|Grilled Salmon|With seasonal vegetables|$24.99",
          "Main Courses|Pasta Primavera|Fresh pasta with garden vegetables|$18.99",
          "Desserts|Chocolate Lava Cake|Warm chocolate cake with vanilla ice cream|$8.99",
          "Beverages|House Wine|Red or White|$7.99"
        ],
        layout: "grid",
        showPrices: "yes",
        showDescriptions: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "GallerySection",
      props: {
        title: "Gallery",
        subtitle: "A glimpse into our restaurant",
        images: [],
        layout: "grid",
        columns: "3"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "OperatingHoursSection",
      props: {
        title: "Hours of Operation",
        subtitle: "We're here to serve you",
        mondayHours: "11:00 AM - 10:00 PM",
        tuesdayHours: "11:00 AM - 10:00 PM",
        wednesdayHours: "11:00 AM - 10:00 PM",
        thursdayHours: "11:00 AM - 10:00 PM",
        fridayHours: "11:00 AM - 11:00 PM",
        saturdayHours: "11:00 AM - 11:00 PM",
        sundayHours: "12:00 PM - 9:00 PM",
        showSpecialHours: "no",
        layout: "centered"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ContactSection",
      props: {
        title: "Contact Us",
        subtitle: "Reserve your table today",
        showForm: "yes",
        showMap: "yes",
        layout: "split"
      },
      layout: {}
    }
  ]
};

// Salon/Spa Template
export const salonTemplate: PageData = {
  title: "Salon & Spa Template",
  components: [
    {
      id: generateId(),
      type: "HeaderSection",
      props: {
        logoText: "Your Salon & Spa",
        menuItems: [
          "Home|#",
          "Services|#services",
          "About|#about",
          "Gallery|#gallery",
          "Contact|#contact"
        ],
        showCtaButton: "yes",
        ctaButtonLabel: "Book Now",
        ctaButtonHref: "tel:"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "HeroSection",
      props: {
        headline: "Relax, Refresh, Rejuvenate",
        subheadline: "Your premier destination for beauty and wellness",
        backgroundImage: "",
        overlayOpacity: 50,
        primaryButtonText: "Book Appointment",
        primaryButtonLink: "#contact",
        secondaryButtonText: "View Services",
        secondaryButtonLink: "#services",
        showSecondaryButton: "yes",
        alignment: "center",
        height: "large"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ServicesDetailedSection",
      props: {
        title: "Our Services",
        subtitle: "Treatments designed for your well-being",
        services: [
          "Hair Services|Cuts, color, styling, and treatments|From $50|60 min",
          "Facial Treatments|Customized facials for all skin types|From $80|75 min",
          "Massage Therapy|Swedish, deep tissue, hot stone|From $90|60 min",
          "Nail Services|Manicures, pedicures, nail art|From $35|45 min",
          "Body Treatments|Wraps, scrubs, and detox treatments|From $120|90 min",
          "Makeup Services|Special occasion and bridal makeup|From $75|60 min"
        ],
        layout: "cards",
        showPrices: "yes",
        showDuration: "yes",
        showBookingButton: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "TeamSection",
      props: {
        title: "Meet Our Team",
        subtitle: "Experienced professionals dedicated to your beauty",
        teamMembers: [
          "Jane Smith|Master Stylist|15 years of experience in hair design|",
          "Maria Garcia|Esthetician|Skincare specialist with holistic approach|",
          "Sarah Johnson|Massage Therapist|Certified in multiple massage techniques|",
          "Emily Chen|Nail Artist|Creative nail designs and treatments|"
        ],
        layout: "grid",
        showSocial: "no"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "SpecialOffersSection",
      props: {
        title: "Special Offers",
        subtitle: "Save on our premium services",
        offers: [
          "New Client Special|20% off your first visit|Valid for all services|WELCOME20",
          "Package Deal|Buy 5 treatments, get 1 free|For any service|PACKAGE6",
          "Refer a Friend|Both get $20 off|When they book their first service|REFER20"
        ],
        layout: "cards",
        showCodes: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "BeforeAfterSection",
      props: {
        title: "Transformations",
        subtitle: "See the amazing results",
        comparisons: [],
        layout: "grid"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ContactSection",
      props: {
        title: "Book Your Appointment",
        subtitle: "Start your journey to beauty and wellness",
        showForm: "yes",
        showMap: "yes",
        layout: "split"
      },
      layout: {}
    }
  ]
};

// Medical/Dental Clinic Template
export const clinicTemplate: PageData = {
  title: "Medical Clinic Template",
  components: [
    {
      id: generateId(),
      type: "HeaderSection",
      props: {
        logoText: "Your Medical Clinic",
        menuItems: [
          "Home|#",
          "Services|#services",
          "About|#about",
          "Our Team|#team",
          "Contact|#contact"
        ],
        showCtaButton: "yes",
        ctaButtonLabel: "Emergency: Call Now",
        ctaButtonHref: "tel:"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "HeroSection",
      props: {
        headline: "Your Health, Our Priority",
        subheadline: "Comprehensive medical care for you and your family",
        backgroundImage: "",
        overlayOpacity: 40,
        primaryButtonText: "Book Appointment",
        primaryButtonLink: "#contact",
        secondaryButtonText: "Our Services",
        secondaryButtonLink: "#services",
        showSecondaryButton: "yes",
        alignment: "left",
        height: "medium"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "FeaturesSection",
      props: {
        title: "Why Choose Us",
        subtitle: "Quality healthcare you can trust",
        features: [
          "Experienced Doctors|Board-certified physicians with years of experience",
          "Modern Facilities|State-of-the-art medical equipment and technology",
          "Comprehensive Care|From preventive care to specialized treatments",
          "Insurance Accepted|We work with most major insurance providers",
          "Same-Day Appointments|Urgent care available when you need it",
          "Patient-Centered|Your health and comfort are our top priorities"
        ],
        layout: "grid",
        showIcons: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ServicesDetailedSection",
      props: {
        title: "Our Services",
        subtitle: "Complete medical care under one roof",
        services: [
          "General Medicine|Routine check-ups and preventive care|Covered by insurance|30 min",
          "Pediatrics|Specialized care for infants and children|Covered by insurance|30 min",
          "Women's Health|Gynecology and reproductive health|Varies|45 min",
          "Cardiology|Heart health screening and treatment|Varies|60 min",
          "Dermatology|Skin conditions and cosmetic treatments|From $150|45 min",
          "Laboratory Services|Blood work and diagnostic testing|Varies|15 min"
        ],
        layout: "list",
        showPrices: "yes",
        showDuration: "yes",
        showBookingButton: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "TeamSection",
      props: {
        title: "Our Medical Team",
        subtitle: "Dedicated healthcare professionals",
        teamMembers: [
          "Dr. John Smith|Chief Medical Officer|Internal Medicine, 20 years experience|",
          "Dr. Sarah Johnson|Pediatrician|Specialized in child healthcare|",
          "Dr. Michael Chen|Cardiologist|Heart health specialist|",
          "Dr. Emily Davis|Dermatologist|Skin care and treatment expert|"
        ],
        layout: "grid",
        showSocial: "no"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "FAQSection",
      props: {
        title: "Frequently Asked Questions",
        subtitle: "Get answers to common questions",
        faqs: [
          "What insurance do you accept?|We accept most major insurance plans including Medicare and Medicaid. Please contact us to verify your specific plan.",
          "Do you offer same-day appointments?|Yes, we reserve slots for urgent care and same-day appointments. Call us for availability.",
          "What should I bring to my first visit?|Please bring your ID, insurance card, list of current medications, and any relevant medical records.",
          "Do you offer telemedicine?|Yes, we offer virtual consultations for appropriate conditions. Ask about our telehealth options.",
          "What are your payment options?|We accept insurance, credit cards, and offer payment plans for qualifying patients."
        ]
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ContactSection",
      props: {
        title: "Schedule Your Visit",
        subtitle: "We're here to help you stay healthy",
        showForm: "yes",
        showMap: "yes",
        layout: "split"
      },
      layout: {}
    }
  ]
};

// Auto Repair Shop Template
export const autoRepairTemplate: PageData = {
  title: "Auto Repair Shop Template",
  components: [
    {
      id: generateId(),
      type: "HeaderSection",
      props: {
        logoText: "Your Auto Repair",
        menuItems: [
          "Home|#",
          "Services|#services",
          "About|#about",
          "Reviews|#reviews",
          "Contact|#contact"
        ],
        showCtaButton: "yes",
        ctaButtonLabel: "Get Quote",
        ctaButtonHref: "tel:"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "HeroSection",
      props: {
        headline: "Expert Auto Repair Services",
        subheadline: "Trusted mechanics keeping you on the road since 2010",
        backgroundImage: "",
        overlayOpacity: 70,
        primaryButtonText: "Schedule Service",
        primaryButtonLink: "#contact",
        secondaryButtonText: "Get Free Quote",
        secondaryButtonLink: "#contact",
        showSecondaryButton: "yes",
        alignment: "center",
        height: "large"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "StatsCounterSection",
      props: {
        title: "",
        stats: [
          "15+|Years Experience|Serving our community",
          "10,000+|Happy Customers|And counting",
          "100%|Satisfaction|Guaranteed work",
          "24/7|Emergency Service|Always available"
        ],
        backgroundColor: "primary"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ServicesDetailedSection",
      props: {
        title: "Our Services",
        subtitle: "Complete auto care under one roof",
        services: [
          "Oil Change|Regular maintenance to keep your engine running smooth|From $39.99|30 min",
          "Brake Service|Complete brake inspection and repair|From $149.99|2 hours",
          "Engine Diagnostics|Computer diagnostics to identify issues|$89.99|1 hour",
          "Tire Services|Rotation, balancing, and replacement|From $25|45 min",
          "AC Service|Keep cool with our AC repair and recharge|From $129.99|1.5 hours",
          "Transmission Service|Fluid change and transmission repair|From $179.99|3 hours"
        ],
        layout: "cards",
        showPrices: "yes",
        showDuration: "yes",
        showBookingButton: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ProcessTimelineSection",
      props: {
        title: "Our Process",
        subtitle: "Simple, transparent, and efficient",
        processSteps: [
          "1|Schedule Appointment|Call or book online for a convenient time",
          "2|Free Inspection|We diagnose the issue and provide a detailed quote",
          "3|Approval & Repair|With your approval, our certified mechanics get to work",
          "4|Quality Check|We test everything to ensure it's working perfectly",
          "5|Pick Up|Your car is ready, cleaned and running great!"
        ],
        layout: "horizontal",
        showConnectors: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "GoogleReviewsSection",
      props: {
        title: "What Our Customers Say",
        subtitle: "Real reviews from real customers",
        reviews: [
          "John D.|5|Best auto shop in town! Honest, fair pricing, and excellent work. They fixed my car's AC in no time.|2024-01-15",
          "Sarah M.|5|I've been coming here for years. They always take great care of my car and never try to upsell unnecessary services.|2024-01-20",
          "Mike R.|5|Emergency brake repair on a Sunday - these guys saved the day! Professional and reasonably priced.|2024-01-25",
          "Lisa K.|5|Finally found a mechanic I can trust. They explain everything clearly and their prices are very fair.|2024-02-01"
        ],
        layout: "carousel",
        showDate: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "CTABannerSection",
      props: {
        title: "Get 10% Off Your First Service",
        subtitle: "New customers save on any service over $100",
        primaryButtonText: "Claim Offer",
        primaryButtonLink: "#contact",
        secondaryButtonText: "Call Now",
        secondaryButtonLink: "tel:",
        showSecondaryButton: "yes",
        backgroundType: "gradient"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ContactSection",
      props: {
        title: "Get Your Free Quote",
        subtitle: "Drop by or schedule your service today",
        showForm: "yes",
        showMap: "yes",
        layout: "split"
      },
      layout: {}
    }
  ]
};

// Real Estate Agency Template
export const realEstateTemplate: PageData = {
  title: "Real Estate Agency Template",
  components: [
    {
      id: generateId(),
      type: "HeaderSection",
      props: {
        logoText: "Your Realty",
        menuItems: [
          "Home|#",
          "Properties|#properties",
          "About|#about",
          "Agents|#agents",
          "Contact|#contact"
        ],
        showCtaButton: "yes",
        ctaButtonLabel: "List Your Property",
        ctaButtonHref: "#contact"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "HeroSection",
      props: {
        headline: "Find Your Dream Home",
        subheadline: "Expert real estate services for buyers and sellers",
        backgroundImage: "",
        overlayOpacity: 40,
        primaryButtonText: "Browse Properties",
        primaryButtonLink: "#properties",
        secondaryButtonText: "Get Free Valuation",
        secondaryButtonLink: "#contact",
        showSecondaryButton: "yes",
        alignment: "center",
        height: "large"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "FeaturesSection",
      props: {
        title: "Why Choose Us",
        subtitle: "Your trusted partner in real estate",
        features: [
          "Local Expertise|Deep knowledge of the local market and neighborhoods",
          "Proven Results|Over $50M in sales last year alone",
          "Full Service|From listing to closing, we handle everything",
          "Marketing Power|Professional photos, virtual tours, and targeted advertising",
          "Negotiation Skills|Get the best deal whether buying or selling",
          "24/7 Support|Always available when you need us"
        ],
        layout: "grid",
        showIcons: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "StatsCounterSection",
      props: {
        title: "Our Track Record",
        stats: [
          "500+|Properties Sold|In the last 5 years",
          "98%|Client Satisfaction|Based on reviews",
          "14|Average Days|To sell a property",
          "$2M+|Saved for Clients|Through expert negotiation"
        ],
        backgroundColor: "default"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "TeamSection",
      props: {
        title: "Meet Our Agents",
        subtitle: "Experienced professionals ready to help",
        teamMembers: [
          "Jane Smith|Principal Broker|15 years experience, specializing in luxury homes|",
          "John Davis|Senior Agent|First-time buyer specialist with 10 years experience|",
          "Maria Garcia|Listing Specialist|Expert in home staging and marketing|",
          "David Chen|Commercial Agent|Commercial and investment properties expert|"
        ],
        layout: "grid",
        showSocial: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ProcessTimelineSection",
      props: {
        title: "Our Selling Process",
        subtitle: "Simple steps to sell your home",
        processSteps: [
          "1|Free Consultation|We assess your property and discuss your goals",
          "2|Market Analysis|Determine the optimal listing price",
          "3|Prepare & Stage|Get your home ready to attract buyers",
          "4|Marketing Campaign|Professional photos, listings, and showings",
          "5|Negotiate & Close|We handle all negotiations and paperwork"
        ],
        layout: "vertical",
        showConnectors: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "GoogleReviewsSection",
      props: {
        title: "Client Success Stories",
        subtitle: "See what our clients have to say",
        reviews: [
          "Sarah M.|5|Jane helped us find our dream home in just 2 weeks! Her knowledge of the area was invaluable.|2024-01-10",
          "Robert K.|5|Sold our house for 10% over asking price. The marketing strategy was brilliant!|2024-01-15",
          "Emily L.|5|First-time buyer here - John made the process so easy and stress-free. Highly recommend!|2024-01-20",
          "Michael P.|5|Professional, responsive, and got us an amazing deal. Couldn't be happier!|2024-01-25"
        ],
        layout: "grid",
        showDate: "yes"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "CTABannerSection",
      props: {
        title: "Ready to Make Your Move?",
        subtitle: "Get a free property valuation today",
        primaryButtonText: "Get Started",
        primaryButtonLink: "#contact",
        secondaryButtonText: "Browse Listings",
        secondaryButtonLink: "#properties",
        showSecondaryButton: "yes",
        backgroundType: "image"
      },
      layout: {}
    },
    {
      id: generateId(),
      type: "ContactSection",
      props: {
        title: "Let's Talk Real Estate",
        subtitle: "Contact us for a free consultation",
        showForm: "yes",
        showMap: "yes",
        layout: "split"
      },
      layout: {}
    }
  ]
};

// Template registry
export const pageTemplates = {
  restaurant: restaurantTemplate,
  salon: salonTemplate,
  clinic: clinicTemplate,
  autoRepair: autoRepairTemplate,
  realEstate: realEstateTemplate
};

// Template metadata for UI
export const templateMetadata = [
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Perfect for restaurants, cafes, and food establishments",
    icon: "🍽️",
    category: "Food & Dining"
  },
  {
    id: "salon",
    name: "Salon & Spa",
    description: "Ideal for beauty salons, spas, and wellness centers",
    icon: "💆‍♀️",
    category: "Beauty & Wellness"
  },
  {
    id: "clinic",
    name: "Medical Clinic",
    description: "Designed for medical clinics, dental offices, and healthcare",
    icon: "🏥",
    category: "Healthcare"
  },
  {
    id: "autoRepair",
    name: "Auto Repair",
    description: "Built for auto repair shops and car service centers",
    icon: "🚗",
    category: "Automotive"
  },
  {
    id: "realEstate",
    name: "Real Estate",
    description: "Tailored for real estate agencies and property management",
    icon: "🏠",
    category: "Real Estate"
  }
];