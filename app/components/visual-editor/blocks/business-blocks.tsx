import { ComponentConfig } from "@/app/types/visual-editor";
import {
  Sparkles,
  Info,
  Image as ImageIcon,
  Star,
  Phone,
  Users,
  Target,
  Columns3,
  Briefcase,
  Layout,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

// Header Section Block - Navigation header with logo
export const HeaderBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Header Section Template</p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a template - drag and drop to expand
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;

    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "small",
          mobileVerticalPadding: "small",
          backgroundColor: "default",
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "large",
              stackOnMobile: "yes",
              columnWidths: [30, 70],
            },
            children: [
              // Logo
              {
                type: "LogoBlock",
                props: {
                  size: "large",
                  align: "left",
                  link: "/",
                  logoText: businessData?.name || "Business Name",
                },
              },
              // Navigation column
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "NavigationBlock",
                    props: {
                      showSections: "auto",
                      style: "horizontal",
                      align: "right",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  },
};

// Complete Business Page Template - Full business website layout
export const BusinessPageTemplate: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border-2 border-dashed border-primary/30">
        <Layout className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">
          Complete Business Page Template
        </h2>
        <p className="text-muted-foreground mb-4">
          Full business website with all sections
        </p>
        <p className="text-sm text-muted-foreground">
          This template includes: Header, Hero, About, Services, Gallery,
          Testimonials, Contact, and Footer
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;

    return [
      // Header Section
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "small",
          mobileVerticalPadding: "small",
          backgroundColor: "default",
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "large",
              stackOnMobile: "yes",
              columnWidths: [30, 70],
            },
            children: [
              // Logo
              {
                type: "LogoBlock",
                props: {
                  text: businessData?.name || "Your Business",
                  size: "medium",
                  alignment: "left",
                },
                metadata: { columnIndex: 0 },
              },
              // Navigation
              {
                type: "NavigationBlock",
                props: {
                  items: [
                    { text: "Home", url: "#home" },
                    { text: "About", url: "#about" },
                    { text: "Services", url: "#services" },
                    { text: "Gallery", url: "#gallery" },
                    { text: "Contact", url: "#contact" },
                  ],
                  alignment: "right",
                  style: "horizontal",
                },
                metadata: { columnIndex: 1 },
              },
            ],
          },
        ],
      },

      // Hero Section
      {
        type: "SectionBlock",
        props: {
          width: "full",
          verticalPadding: "large",
          mobileVerticalPadding: "large",
          backgroundColor: "primary",
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "1",
              gap: "none",
              stackOnMobile: "no",
            },
            children: [
              {
                type: "TextBlock",
                props: {
                  content: `<h1 style="text-align: center; color: white; font-size: 3rem; font-weight: bold; margin-bottom: 1rem;">${businessData?.aiGeneratedContent?.hero?.title || businessData?.name || "Welcome to Our Business"}</h1>`,
                  alignment: "center",
                },
                metadata: { columnIndex: 0 },
              },
              {
                type: "TextBlock",
                props: {
                  content: `<p style="text-align: center; color: white; font-size: 1.25rem; opacity: 0.9; max-width: 600px; margin: 0 auto;">${businessData?.aiGeneratedContent?.hero?.subtitle || businessData?.description || "Providing exceptional service and quality results for our valued customers."}</p>`,
                  alignment: "center",
                },
                metadata: { columnIndex: 0 },
              },
              {
                type: "SpacerBlock",
                props: { height: "medium" },
                metadata: { columnIndex: 0 },
              },
              {
                type: "ButtonBlock",
                props: {
                  text: "Get Started",
                  url: "#contact",
                  style: "secondary",
                  size: "large",
                  alignment: "center",
                },
                metadata: { columnIndex: 0 },
              },
            ],
          },
        ],
      },

      // About Section
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          mobileVerticalPadding: "medium",
          backgroundColor: "default",
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "large",
              stackOnMobile: "yes",
            },
            children: [
              {
                type: "TextBlock",
                props: {
                  content: `<h2>About ${businessData?.name || "Our Business"}</h2><p>${businessData?.aiGeneratedContent?.about?.content || businessData?.description || "We are dedicated to providing exceptional service and quality results. Our experienced team is committed to exceeding your expectations and delivering outstanding value."}</p>`,
                  alignment: "left",
                },
                metadata: { columnIndex: 0 },
              },
              {
                type: "ImageBlock",
                props: {
                  src: businessData?.photos?.[0] || "",
                  alt: "About us",
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "medium",
                },
                metadata: { columnIndex: 1 },
              },
            ],
          },
        ],
      },

      // Services Section
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          mobileVerticalPadding: "medium",
          backgroundColor: "muted",
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: `<h2 style="text-align: center; margin-bottom: 3rem;">${businessData?.aiGeneratedContent?.services?.title || "Our Services"}</h2>`,
              alignment: "center",
            },
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "3",
              gap: "large",
              stackOnMobile: "yes",
            },
            children: businessData?.aiGeneratedContent?.services?.items
              ?.slice(0, 3)
              .map((service, index) => ({
                type: "CardBlock",
                props: {
                  title: service.title,
                  content: service.description,
                  icon: service.icon || "briefcase",
                  alignment: "center",
                  padding: "large",
                },
                metadata: { columnIndex: index },
              })) || [
              {
                type: "CardBlock",
                props: {
                  title: "Professional Service",
                  content:
                    "High-quality professional services tailored to your needs.",
                  icon: "briefcase",
                  alignment: "center",
                  padding: "large",
                },
                metadata: { columnIndex: 0 },
              },
              {
                type: "CardBlock",
                props: {
                  title: "Expert Support",
                  content:
                    "Dedicated support from our team of experienced professionals.",
                  icon: "users",
                  alignment: "center",
                  padding: "large",
                },
                metadata: { columnIndex: 1 },
              },
              {
                type: "CardBlock",
                props: {
                  title: "Quality Results",
                  content:
                    "Consistent, reliable results that exceed expectations.",
                  icon: "target",
                  alignment: "center",
                  padding: "large",
                },
                metadata: { columnIndex: 2 },
              },
            ],
          },
        ],
      },

      // Gallery Section
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          mobileVerticalPadding: "medium",
          backgroundColor: "default",
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content:
                '<h2 style="text-align: center; margin-bottom: 3rem;">Our Work</h2>',
              alignment: "center",
            },
          },
          {
            type: "GalleryGridBlock",
            props: {
              images: businessData?.photos?.slice(0, 6).map((photo) => ({
                src: photo,
                alt: "Gallery image",
              })) || [
                { src: "", alt: "Gallery image 1" },
                { src: "", alt: "Gallery image 2" },
                { src: "", alt: "Gallery image 3" },
                { src: "", alt: "Gallery image 4" },
              ],
              columns: 3,
              gap: "medium",
              aspectRatio: "square",
            },
          },
        ],
      },

      // Contact Section
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          mobileVerticalPadding: "medium",
          backgroundColor: "muted",
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content:
                '<h2 style="text-align: center; margin-bottom: 3rem;">Get In Touch</h2>',
              alignment: "center",
            },
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "large",
              stackOnMobile: "yes",
            },
            children: [
              {
                type: "ContactFormBlock",
                props: {
                  title: "Send us a message",
                  businessId: businessData?._id,
                },
                metadata: { columnIndex: 0 },
              },
              {
                type: "CardBlock",
                props: {
                  title: "Contact Information",
                  content: `
                    <div style="space-y: 1rem;">
                      ${businessData?.address ? `<p><strong>Address:</strong><br>${businessData.address}</p>` : ""}
                      ${businessData?.phone ? `<p><strong>Phone:</strong><br>${businessData.phone}</p>` : ""}
                      ${businessData?.email ? `<p><strong>Email:</strong><br>${businessData.email}</p>` : ""}
                      ${businessData?.hours?.length ? `<p><strong>Hours:</strong><br>${businessData.hours.join("<br>")}</p>` : ""}
                    </div>
                  `,
                  padding: "large",
                },
                metadata: { columnIndex: 1 },
              },
            ],
          },
        ],
      },

      // Footer Section
      {
        type: "SectionBlock",
        props: {
          width: "full",
          verticalPadding: "medium",
          mobileVerticalPadding: "medium",
          backgroundColor: "dark",
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "3",
              gap: "large",
              stackOnMobile: "yes",
            },
            children: [
              {
                type: "TextBlock",
                props: {
                  content: `<h3 style="color: white; margin-bottom: 1rem;">${businessData?.name || "Your Business"}</h3><p style="color: rgba(255,255,255,0.8);">${businessData?.description || "Providing exceptional service and quality results."}</p>`,
                  alignment: "left",
                },
                metadata: { columnIndex: 0 },
              },
              {
                type: "TextBlock",
                props: {
                  content: `<h4 style="color: white; margin-bottom: 1rem;">Quick Links</h4><ul style="color: rgba(255,255,255,0.8); list-style: none; padding: 0;"><li><a href="#home" style="color: rgba(255,255,255,0.8);">Home</a></li><li><a href="#about" style="color: rgba(255,255,255,0.8);">About</a></li><li><a href="#services" style="color: rgba(255,255,255,0.8);">Services</a></li><li><a href="#contact" style="color: rgba(255,255,255,0.8);">Contact</a></li></ul>`,
                  alignment: "left",
                },
                metadata: { columnIndex: 1 },
              },
              {
                type: "TextBlock",
                props: {
                  content: `<h4 style="color: white; margin-bottom: 1rem;">Contact</h4><div style="color: rgba(255,255,255,0.8);">${businessData?.address ? `<p>${businessData.address}</p>` : ""}${businessData?.phone ? `<p>${businessData.phone}</p>` : ""}${businessData?.email ? `<p>${businessData.email}</p>` : ""}</div>`,
                  alignment: "left",
                },
                metadata: { columnIndex: 2 },
              },
            ],
          },
          {
            type: "DividerBlock",
            props: {
              style: "solid",
              color: "rgba(255,255,255,0.2)",
              thickness: "thin",
              spacing: "medium",
            },
          },
          {
            type: "TextBlock",
            props: {
              content: `<p style="text-align: center; color: rgba(255,255,255,0.6); font-size: 0.875rem;">© ${new Date().getFullYear()} ${businessData?.name || "Your Business"}. All rights reserved.</p>`,
              alignment: "center",
            },
          },
        ],
      },
    ];
  },
};

// Hero Section Block
export const HeroBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-12 text-center bg-primary/10 rounded-lg">
        <h2 className="text-2xl font-bold">Hero Section Template</h2>
        <p className="text-muted-foreground mt-2">
          This is a template - drag and drop to expand into full hero section
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;
    const backgroundImage =
      businessData?.photos?.[0] ||
      "https://images.unsplash.com/photo-1497366216548-37526070297c";

    return [
      {
        type: "SectionBlock",
        props: {
          backgroundImage,
          backgroundImageStyle: "cover",
          overlayOpacity: 0.6,
          width: "full",
          verticalPadding: "xlarge",
          mobileVerticalPadding: "large",
        },
        children: [
          {
            type: "SpacerBlock",
            props: { height: 60 },
          },
          {
            type: "TextBlock",
            props: {
              content: businessData?.name || "Welcome to Our Business",
              variant: "h1",
              align: "center",
              color: "#FFFFFF",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 24 },
          },
          {
            type: "TextBlock",
            props: {
              content:
                businessData?.description ||
                "Providing exceptional service to our community for over 20 years",
              variant: "lead",
              align: "center",
              color: "#F3F4F6",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 48 },
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "medium",
              stackOnMobile: "yes",
            },
            children: [
              {
                type: "ButtonBlock",
                props: {
                  text: "Get Free Quote",
                  link: "#contact",
                  variant: "default",
                  size: "lg",
                  align: "right",
                  fullWidth: "mobile",
                },
              },
              {
                type: "ButtonBlock",
                props: {
                  text: "View Our Work",
                  link: "#gallery",
                  variant: "outline",
                  size: "lg",
                  align: "left",
                  fullWidth: "mobile",
                },
              },
            ],
          },
          {
            type: "SpacerBlock",
            props: { height: 60 },
          },
        ],
      },
    ];
  },
  icon: Sparkles,
  category: "Section",
};

// About Section Block
export const AboutBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">About Section Template</p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a template - drag and drop to expand
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;

    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          mobileVerticalPadding: "medium",
          backgroundColor: "default",
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "large",
              stackOnMobile: "yes",
            },
            children: [
              // Content Column
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "BadgeBlock",
                    props: {
                      type: "custom",
                      text: "ABOUT US",
                      color: "primary",
                      size: "small",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Building Trust Through Excellence",
                      variant: "h2",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        businessData?.description ||
                        "We are a premier local business with over 20 years of experience serving our community. Our commitment to quality, integrity, and customer satisfaction has made us the trusted choice for thousands of families and businesses.",
                      variant: "paragraph",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 32 },
                  },
                  {
                    type: "ListBlock",
                    props: {
                      items: [
                        "Licensed & Certified Professionals",
                        "24/7 Emergency Service Available",
                        "100% Satisfaction Guarantee",
                        "Competitive & Transparent Pricing",
                      ],
                      style: "check",
                      spacing: "normal",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 32 },
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Learn More",
                      link: "#services",
                      variant: "default",
                      size: "default",
                    },
                  },
                ],
              },
              // Image Column
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src:
                        businessData?.photos?.[1] ||
                        "https://images.unsplash.com/photo-1556761175-4b46a572b786",
                      alt: "About our business",
                      rounded: "lg",
                      width: "full",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  },
  icon: Info,
  category: "Section",
};

// Services Section Block
export const ServicesBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Services Section Template</p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a template - drag and drop to expand
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (_business?: unknown) => {
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "muted",
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "Our Services",
              variant: "h2",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 16 },
          },
          {
            type: "TextBlock",
            props: {
              content: "Choose the perfect solution for your needs",
              variant: "lead",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 48 },
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "3",
              gap: "medium",
              stackOnMobile: "yes",
            },
            children: [
              // Service 1
              {
                type: "CardBlock",
                props: {
                  title: "Professional Service",
                  variant: "default",
                },
                children: [
                  {
                    type: "IconBlock",
                    props: {
                      icon: "briefcase",
                      size: "large",
                      color: "#3B82F6",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Starting at",
                      variant: "small",
                      align: "center",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "$99",
                      variant: "h2",
                      align: "center",
                      color: "#3B82F6",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "ListBlock",
                    props: {
                      items: [
                        "Professional consultation",
                        "Quality materials",
                        "Expert installation",
                        "30-day warranty",
                      ],
                      style: "check",
                      spacing: "compact",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Get Started",
                      link: "#contact",
                      variant: "outline",
                      size: "default",
                      fullWidth: "full",
                    },
                  },
                ],
              },
              // Service 2
              {
                type: "CardBlock",
                props: {
                  title: "Premium Service",
                  variant: "default",
                },
                children: [
                  {
                    type: "BadgeBlock",
                    props: {
                      type: "custom",
                      text: "MOST POPULAR",
                      color: "warning",
                      size: "small",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "IconBlock",
                    props: {
                      icon: "star",
                      size: "large",
                      color: "#EAB308",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Starting at",
                      variant: "small",
                      align: "center",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "$149",
                      variant: "h2",
                      align: "center",
                      color: "#EAB308",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "ListBlock",
                    props: {
                      items: [
                        "Everything in Professional",
                        "Priority scheduling",
                        "Premium materials",
                        "1-year warranty",
                      ],
                      style: "check",
                      spacing: "compact",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Get Started",
                      link: "#contact",
                      variant: "default",
                      size: "default",
                      fullWidth: "full",
                    },
                  },
                ],
              },
              // Service 3
              {
                type: "CardBlock",
                props: {
                  title: "Complete Care",
                  variant: "default",
                },
                children: [
                  {
                    type: "IconBlock",
                    props: {
                      icon: "shield",
                      size: "large",
                      color: "#10B981",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Starting at",
                      variant: "small",
                      align: "center",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "$199",
                      variant: "h2",
                      align: "center",
                      color: "#10B981",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "ListBlock",
                    props: {
                      items: [
                        "Everything in Premium",
                        "Annual maintenance",
                        "Emergency service",
                        "Lifetime warranty",
                      ],
                      style: "check",
                      spacing: "compact",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Get Started",
                      link: "#contact",
                      variant: "outline",
                      size: "default",
                      fullWidth: "full",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  },
  icon: Briefcase,
  category: "Section",
};

// Gallery Section Block
export const GalleryBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Gallery Section Template</p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a template - drag and drop to expand
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;
    const galleryImages = businessData?.photos || [
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7",
      "https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3",
      "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa",
    ];

    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "default",
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "Our Work",
              variant: "h2",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 16 },
          },
          {
            type: "TextBlock",
            props: {
              content: "Browse through our portfolio of completed projects",
              variant: "lead",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 48 },
          },
          {
            type: "GalleryGridBlock",
            props: {
              images: galleryImages,
              columns: "3",
              gap: "medium",
              aspectRatio: "square",
            },
          },
        ],
      },
    ];
  },
  icon: ImageIcon,
  category: "Section",
};

// Contact Section Block
export const ContactBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Contact Section Template</p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a template - drag and drop to expand
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;

    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "muted",
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "Get in Touch",
              variant: "h2",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 16 },
          },
          {
            type: "TextBlock",
            props: {
              content:
                "We're here to help and answer any question you might have",
              variant: "lead",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 48 },
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "3",
              gap: "large",
              stackOnMobile: "yes",
            },
            children: [
              // Address Card
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "IconBlock",
                    props: {
                      icon: "mapPin",
                      size: "large",
                      color: "#3B82F6",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Visit Us",
                      variant: "h4",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 8 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        businessData?.address ||
                        "123 Main Street, Your City, ST 12345",
                      variant: "paragraph",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Get Directions",
                      link: businessData?.address
                        ? `https://maps.google.com/?q=${encodeURIComponent(businessData.address)}`
                        : "#",
                      variant: "outline",
                      size: "sm",
                      align: "center",
                    },
                  },
                ],
              },
              // Phone Card
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "IconBlock",
                    props: {
                      icon: "phone",
                      size: "large",
                      color: "#10B981",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Call Us",
                      variant: "h4",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 8 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: businessData?.phone || "(555) 123-4567",
                      variant: "h3",
                      align: "center",
                      color: "#10B981",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Call Now",
                      link: `tel:${businessData?.phone || "5551234567"}`,
                      variant: "default",
                      size: "sm",
                      align: "center",
                    },
                  },
                ],
              },
              // Hours Card
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "IconBlock",
                    props: {
                      icon: "clock",
                      size: "large",
                      color: "#8B5CF6",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Business Hours",
                      variant: "h4",
                      align: "center",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "BusinessHoursBlock",
                    props: {
                      layout: "compact",
                      showToday: "yes",
                      showStatus: "yes",
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "SpacerBlock",
            props: { height: 48 },
          },
          {
            type: "ContactFormBlock",
            props: {
              submitText: "Send Message",
              showPhone: "yes",
            },
          },
        ],
      },
    ];
  },
  icon: Phone,
  category: "Section",
};

// Team Section Block
export const TeamBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Team Section Template</p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a template - drag and drop to expand
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (_business?: unknown) => {
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "default",
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "Meet Our Team",
              variant: "h2",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 16 },
          },
          {
            type: "TextBlock",
            props: {
              content:
                "Dedicated professionals committed to delivering excellence",
              variant: "lead",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 48 },
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "4",
              gap: "medium",
              stackOnMobile: "yes",
            },
            children: [
              // Team Member 1
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                      alt: "John Smith",
                      rounded: "full",
                      width: "narrow",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "John Smith",
                      variant: "h4",
                      align: "center",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "CEO & Founder",
                      variant: "small",
                      align: "center",
                      color: "#3B82F6",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 12 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        "20+ years of industry experience leading teams to deliver exceptional results.",
                      variant: "small",
                      align: "center",
                    },
                  },
                ],
              },
              // Team Member 2
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                      alt: "Sarah Johnson",
                      rounded: "full",
                      width: "narrow",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Sarah Johnson",
                      variant: "h4",
                      align: "center",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Operations Manager",
                      variant: "small",
                      align: "center",
                      color: "#3B82F6",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 12 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        "Streamlining operations and ensuring every customer receives exceptional service.",
                      variant: "small",
                      align: "center",
                    },
                  },
                ],
              },
              // Team Member 3
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                      alt: "Michael Chen",
                      rounded: "full",
                      width: "narrow",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Michael Chen",
                      variant: "h4",
                      align: "center",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Lead Technician",
                      variant: "small",
                      align: "center",
                      color: "#3B82F6",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 12 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        "Expert technician with 10+ years experience solving complex challenges.",
                      variant: "small",
                      align: "center",
                    },
                  },
                ],
              },
              // Team Member 4
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                      alt: "Emily Davis",
                      rounded: "full",
                      width: "narrow",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Emily Davis",
                      variant: "h4",
                      align: "center",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Customer Success",
                      variant: "small",
                      align: "center",
                      color: "#3B82F6",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 12 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        "Passionate about building lasting relationships and exceeding expectations.",
                      variant: "small",
                      align: "center",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  },
  icon: Users,
  category: "Section",
};

// CTA Section Block
export const CTABlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-primary/10 rounded-lg">
        <p className="text-muted-foreground">CTA Section Template</p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a template - drag and drop to expand
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (_business?: unknown) => {
    return [
      {
        type: "SectionBlock",
        props: {
          width: "full",
          verticalPadding: "large",
          backgroundColor: "primary",
          backgroundImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c",
          backgroundImageStyle: "cover",
          overlayOpacity: 0.8,
        },
        children: [
          {
            type: "BadgeBlock",
            props: {
              type: "custom",
              text: "LIMITED TIME OFFER",
              color: "warning",
              size: "medium",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 24 },
          },
          {
            type: "TextBlock",
            props: {
              content: "Ready to Transform Your Space?",
              variant: "h1",
              align: "center",
              color: "#FFFFFF",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 24 },
          },
          {
            type: "TextBlock",
            props: {
              content:
                "Join thousands of satisfied customers. Get a free consultation and 20% off your first service.",
              variant: "lead",
              align: "center",
              color: "#E5E7EB",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 48 },
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "medium",
              stackOnMobile: "yes",
            },
            children: [
              {
                type: "ButtonBlock",
                props: {
                  text: "Get Free Quote",
                  link: "#contact",
                  variant: "secondary",
                  size: "lg",
                  align: "right",
                  fullWidth: "mobile",
                },
              },
              {
                type: "ButtonBlock",
                props: {
                  text: "Call Now",
                  link: "tel:5551234567",
                  variant: "outline",
                  size: "lg",
                  align: "left",
                  fullWidth: "mobile",
                },
              },
            ],
          },
        ],
      },
    ];
  },
  icon: Target,
  category: "Section",
};

// Footer Section Block
export const FooterBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Footer Section Template</p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a template - drag and drop to expand
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;

    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "muted",
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "4",
              gap: "large",
              stackOnMobile: "yes",
            },
            children: [
              // Business Info Column
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "LogoBlock",
                    props: {
                      size: "medium",
                      align: "left",
                      logoText: businessData?.name || "Your Business",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        "Your trusted local partner for quality service.",
                      variant: "small",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "SocialLinksBlock",
                    props: {
                      platforms: [
                        { platform: "facebook", url: "https://facebook.com" },
                        { platform: "instagram", url: "https://instagram.com" },
                        { platform: "twitter", url: "https://twitter.com" },
                      ],
                      style: "icons",
                      size: "small",
                      gap: "small",
                    },
                  },
                ],
              },
              // Quick Links Column
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "TextBlock",
                    props: {
                      content: "Quick Links",
                      variant: "h4",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "ListBlock",
                    props: {
                      items: ["About Us", "Services", "Gallery", "Contact"],
                      style: "none",
                      spacing: "normal",
                    },
                  },
                ],
              },
              // Services Column
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "TextBlock",
                    props: {
                      content: "Our Services",
                      variant: "h4",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "ListBlock",
                    props: {
                      items: [
                        "Professional Service",
                        "Premium Service",
                        "Complete Care",
                        "Consultation",
                      ],
                      style: "none",
                      spacing: "normal",
                    },
                  },
                ],
              },
              // Contact Column
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "TextBlock",
                    props: {
                      content: "Get in Touch",
                      variant: "h4",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  ...(businessData?.phone
                    ? [
                        {
                          type: "TextBlock",
                          props: {
                            content: businessData.phone,
                            variant: "small",
                            align: "left",
                          },
                        },
                        {
                          type: "SpacerBlock",
                          props: { height: 8 },
                        },
                      ]
                    : []),
                  ...(businessData?.email
                    ? [
                        {
                          type: "TextBlock",
                          props: {
                            content: businessData.email,
                            variant: "small",
                            align: "left",
                          },
                        },
                        {
                          type: "SpacerBlock",
                          props: { height: 8 },
                        },
                      ]
                    : []),
                  ...(businessData?.address
                    ? [
                        {
                          type: "TextBlock",
                          props: {
                            content: businessData.address,
                            variant: "small",
                            align: "left",
                          },
                        },
                      ]
                    : []),
                ],
              },
            ],
          },
          {
            type: "SpacerBlock",
            props: { height: 48 },
          },
          {
            type: "DividerBlock",
            props: {
              style: "solid",
              width: "full",
              opacity: 20,
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 24 },
          },
          {
            type: "TextBlock",
            props: {
              content: `© ${new Date().getFullYear()} ${businessData?.name || "Your Business"}. All rights reserved.`,
              variant: "small",
              align: "center",
            },
          },
        ],
      },
    ];
  },
  icon: Columns3,
  category: "Section",
};

// Testimonials Section Block
export const TestimonialsBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    return (
      <div className="p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Testimonials Section Template</p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a template - drag and drop to expand
        </p>
      </div>
    );
  },
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;

    // const hasAITestimonials = businessData?.aiGeneratedContent?.testimonials?.items &&
    //                          businessData.aiGeneratedContent.testimonials.items.length > 0;

    // Use AI testimonials if available, otherwise fall back to default
    const testimonialTitle =
      businessData?.aiGeneratedContent?.testimonials?.title ||
      "What Our Customers Say";
    // const testimonialItems = businessData?.aiGeneratedContent?.testimonials?.items || [
    //   {
    //     name: "John Smith",
    //     text: "Amazing service! The team was professional, punctual, and exceeded all our expectations. Highly recommend to anyone looking for quality work.",
    //     rating: 5,
    //     role: "Local Business Owner"
    //   },
    //   {
    //     name: "Sarah Johnson",
    //     text: "Outstanding experience from start to finish. They really care about their customers and it shows in their work. Will definitely use again!",
    //     rating: 5,
    //     role: "Happy Customer"
    //   },
    //   {
    //     name: "Michael Davis",
    //     text: "Professional, reliable, and affordable. They went above and beyond to ensure we were satisfied. Can't ask for better service!",
    //     rating: 5,
    //     role: "Satisfied Client"
    //   }
    // ];
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "muted",
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: testimonialTitle,
              variant: "h2",
              align: "center",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 48 },
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "3",
              gap: "medium",
              stackOnMobile: "yes",
            },
            children: [
              // Testimonial 1
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "ReviewStarsBlock",
                    props: {
                      rating: 5,
                      size: "medium",
                      showNumber: "no",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        '"Amazing service! The team was professional, punctual, and exceeded all our expectations. Highly recommend to anyone looking for quality work."',
                      variant: "paragraph",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "DividerBlock",
                    props: {
                      style: "solid",
                      width: "full",
                      opacity: 20,
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "John Smith",
                      variant: "h4",
                      align: "left",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Local Business Owner",
                      variant: "small",
                      align: "left",
                    },
                  },
                ],
              },
              // Testimonial 2
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "ReviewStarsBlock",
                    props: {
                      rating: 5,
                      size: "medium",
                      showNumber: "no",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        '"Outstanding experience from start to finish. They really care about their customers and it shows in their work. Will definitely use again!"',
                      variant: "paragraph",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "DividerBlock",
                    props: {
                      style: "solid",
                      width: "full",
                      opacity: 20,
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Sarah Johnson",
                      variant: "h4",
                      align: "left",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Happy Customer",
                      variant: "small",
                      align: "left",
                    },
                  },
                ],
              },
              // Testimonial 3
              {
                type: "CardBlock",
                props: {
                  variant: "default",
                },
                children: [
                  {
                    type: "ReviewStarsBlock",
                    props: {
                      rating: 5,
                      size: "medium",
                      showNumber: "no",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content:
                        '"Professional, reliable, and affordable. They went above and beyond to ensure we were satisfied. Can\'t ask for better service!"',
                      variant: "paragraph",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 },
                  },
                  {
                    type: "DividerBlock",
                    props: {
                      style: "solid",
                      width: "full",
                      opacity: 20,
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Michael Davis",
                      variant: "h4",
                      align: "left",
                    },
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Satisfied Client",
                      variant: "small",
                      align: "left",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  },
  icon: Star,
  category: "Section",
};
