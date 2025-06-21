import { ComponentConfig } from "../types";
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
  Layout
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

// No longer needed - removed unused components and types

// Header Section Block - Navigation header with logo
export const HeaderBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => null,
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;
    
    return [
      {
        type: "SectionBlock",
        props: {
          width: "full",
          verticalPadding: "small",
          backgroundColor: "default",
          borderBottom: "yes"
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "medium",
              stackOnMobile: "no",
              verticalAlign: "middle"
            },
            children: [
              // First Column - Logo
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "LogoBlock",
                    props: {
                      size: "medium",
                      align: "left",
                      makeClickable: "yes"
                    }
                  }
                ]
              },
              // Second Column - Navigation/Contact
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "ColumnsBlock",
                    props: {
                      columns: "3",
                      gap: "small",
                      stackOnMobile: "yes"
                    },
                    children: [
                      {
                        type: "ColumnContentBlock",
                        props: {},
                        children: [
                          {
                            type: "ButtonBlock",
                            props: {
                              text: businessData?.phone || "Call Us",
                              link: `tel:${businessData?.phone || ""}`,
                              variant: "ghost",
                              size: "sm",
                              align: "right"
                            }
                          }
                        ]
                      },
                      {
                        type: "ColumnContentBlock",
                        props: {},
                        children: [
                          {
                            type: "ButtonBlock",
                            props: {
                              text: "Hours",
                              link: "#hours",
                              variant: "ghost",
                              size: "sm",
                              align: "center"
                            }
                          }
                        ]
                      },
                      {
                        type: "ColumnContentBlock",
                        props: {},
                        children: [
                          {
                            type: "ButtonBlock",
                            props: {
                              text: "Contact",
                              link: "#contact",
                              variant: "default",
                              size: "sm",
                              align: "right"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  },
  icon: Layout,
  category: "Section"
};

// Hero Section Block - Returns a group of basic blocks
export const HeroBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => {
    // This is a template that returns multiple blocks to be added
    // The visual editor should handle this specially
    return null;
  },
  // Special property to indicate this is a template
  isTemplate: true,
  // Define the blocks that should be added when this template is selected
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;
    // Get first image from business gallery if available
    const backgroundImage = businessData?.photos?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c";
    
    return [
      {
        type: "SectionBlock",
        props: {
          backgroundImage,
          backgroundImageStyle: "cover",
          overlayOpacity: 0.5,
          width: "full",
          verticalPadding: "xlarge"
        },
        children: [
          {
            type: "SpacerBlock",
            props: { height: 60 }
          },
          {
            type: "TextBlock",
            props: {
              content: businessData?.name || "Welcome to Our Business",
              variant: "h1",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 16 }
          },
          {
            type: "TextBlock",
            props: {
              content: businessData?.description || "Your trusted local business partner",
              variant: "lead",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 32 }
          },
          {
            type: "ButtonBlock",
            props: {
              text: "Get Started",
              link: "#contact",
              variant: "default",
              size: "lg",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 60 }
          }
        ]
      }
    ];
  },
  icon: Sparkles,
  category: "Section"
};

// About Section Block - Template
export const AboutBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => null,
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;
    
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "muted"
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "large",
              stackOnMobile: "yes"
            },
            children: [
              // First Column - Content
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "TextBlock",
                    props: {
                      content: "About Us",
                      variant: "h2",
                      align: "left"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: businessData?.description || "We are a local business dedicated to providing exceptional service to our community. With years of experience and a passion for what we do, we strive to exceed our customers' expectations every day.",
                      variant: "paragraph",
                      align: "left"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 }
                  },
                  {
                    type: "ListBlock",
                    props: {
                      items: [
                        "Experienced and professional team",
                        "Quality service guaranteed",
                        "Competitive pricing",
                        "Customer satisfaction is our priority"
                      ],
                      style: "check",
                      spacing: "normal"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 }
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Learn More",
                      link: "#contact",
                      variant: "default",
                      size: "default"
                    }
                  }
                ]
              },
              // Second Column - Image
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src: businessData?.photos?.[0] || "https://images.unsplash.com/photo-1556761175-4b46a572b786",
                      alt: "About our business",
                      rounded: "lg",
                      width: "full"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  },
  icon: Info,
  category: "Section"
};

// Services Section Block - Template
export const ServicesBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => null,
  isTemplate: true,
  template: (_business?: unknown) => {
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "default"
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "Our Services",
              variant: "h2",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 16 }
          },
          {
            type: "TextBlock",
            props: {
              content: "What we offer",
              variant: "lead",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 48 }
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "3",
              gap: "medium",
              stackOnMobile: "yes"
            },
            children: [
              // Service 1
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "IconBlock",
                    props: {
                      icon: "briefcase",
                      size: "large",
                      color: "#3B82F6",
                      align: "center"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Professional Service",
                      variant: "h4",
                      align: "center"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 8 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "$99",
                      variant: "h3",
                      align: "center",
                      color: "#3B82F6"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Our core service offering with professional expertise and quality results guaranteed.",
                      variant: "muted",
                      align: "center"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 }
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Book Now",
                      link: "#contact",
                      variant: "outline",
                      size: "sm",
                      fullWidth: "full"
                    }
                  }
                ]
              },
              // Service 2
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "IconBlock",
                    props: {
                      icon: "star",
                      size: "large",
                      color: "#EAB308",
                      align: "center"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Premium Service",
                      variant: "h4",
                      align: "center"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 8 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "$149",
                      variant: "h3",
                      align: "center",
                      color: "#EAB308"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Enhanced service package with additional features and priority support included.",
                      variant: "muted",
                      align: "center"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 }
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Book Now",
                      link: "#contact",
                      variant: "default",
                      size: "sm",
                      fullWidth: "full"
                    }
                  }
                ]
              },
              // Service 3
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "IconBlock",
                    props: {
                      icon: "shield",
                      size: "large",
                      color: "#10B981",
                      align: "center"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Complete Care",
                      variant: "h4",
                      align: "center"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 8 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "$199",
                      variant: "h3",
                      align: "center",
                      color: "#10B981"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Comprehensive service solution with ongoing support and maintenance included.",
                      variant: "muted",
                      align: "center"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 }
                  },
                  {
                    type: "ButtonBlock",
                    props: {
                      text: "Book Now",
                      link: "#contact",
                      variant: "outline",
                      size: "sm",
                      fullWidth: "full"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  },
  icon: Briefcase,
  category: "Section"
};

// Gallery Section Block - Template
export const GalleryBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => null,
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;
    const galleryImages = businessData?.photos || [];
    
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "default"
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "Photo Gallery",
              variant: "h2",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 48 }
          },
          {
            type: "GalleryGridBlock",
            props: {
              images: galleryImages.length > 0 ? galleryImages : [
                "https://images.unsplash.com/photo-1497366216548-37526070297c",
                "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
                "https://images.unsplash.com/photo-1497366412874-3415097a27e7",
                "https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3",
                "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa"
              ],
              columns: "3",
              gap: "medium",
              aspectRatio: "square"
            }
          }
        ]
      }
    ];
  },
  icon: ImageIcon,
  category: "Section"
};

// Testimonials Section Block - Template
export const TestimonialsBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => null,
  isTemplate: true,
  template: (_business?: unknown) => {
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "muted"
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "What Our Customers Say",
              variant: "h2",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 48 }
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "3",
              gap: "medium",
              stackOnMobile: "yes"
            },
            children: [
              // Testimonial 1
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "ReviewStarsBlock",
                    props: {
                      rating: 5,
                      size: "medium",
                      showNumber: "no"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "\"Amazing service! The team was professional, punctual, and exceeded all our expectations. Highly recommend to anyone looking for quality work.\"",
                      variant: "paragraph",
                      align: "left"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 }
                  },
                  {
                    type: "DividerBlock",
                    props: {
                      style: "solid",
                      width: "full",
                      opacity: 20
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "John Smith",
                      variant: "h4",
                      align: "left"
                    }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Local Business Owner",
                      variant: "small",
                      align: "left",
                      color: "#6B7280"
                    }
                  }
                ]
              },
              // Testimonial 2
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "ReviewStarsBlock",
                    props: {
                      rating: 5,
                      size: "medium",
                      showNumber: "no"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "\"Outstanding experience from start to finish. They really care about their customers and it shows in their work. Will definitely use again!\"",
                      variant: "paragraph",
                      align: "left"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 }
                  },
                  {
                    type: "DividerBlock",
                    props: {
                      style: "solid",
                      width: "full",
                      opacity: 20
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Sarah Johnson",
                      variant: "h4",
                      align: "left"
                    }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Happy Customer",
                      variant: "small",
                      align: "left",
                      color: "#6B7280"
                    }
                  }
                ]
              },
              // Testimonial 3
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "ReviewStarsBlock",
                    props: {
                      rating: 5,
                      size: "medium",
                      showNumber: "no"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "\"Professional, reliable, and affordable. They went above and beyond to ensure we were satisfied. Can't ask for better service!\"",
                      variant: "paragraph",
                      align: "left"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 24 }
                  },
                  {
                    type: "DividerBlock",
                    props: {
                      style: "solid",
                      width: "full",
                      opacity: 20
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Michael Davis",
                      variant: "h4",
                      align: "left"
                    }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Satisfied Client",
                      variant: "small",
                      align: "left",
                      color: "#6B7280"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  },
  icon: Star,
  category: "Section"
};

// Contact Section Block - Template
export const ContactBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => null,
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;
    
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "default"
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "Get in Touch",
              variant: "h2",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 16 }
          },
          {
            type: "TextBlock",
            props: {
              content: "We'd love to hear from you",
              variant: "lead",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 48 }
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "large",
              stackOnMobile: "yes"
            },
            children: [
              // Contact Information Column
              {
                type: "TextBlock",
                props: {
                  content: "Contact Information",
                  variant: "h3",
                  align: "left"
                }
              },
              {
                type: "SpacerBlock",
                props: { height: 24 }
              },
              // Phone
              ...(businessData?.phone ? [
                {
                  type: "ColumnsBlock",
                  props: {
                    columns: "2",
                    gap: "small",
                    stackOnMobile: "no"
                  },
                  children: [
                    {
                      type: "IconBlock",
                      props: {
                        icon: "phone",
                        size: "medium",
                        color: "#3B82F6"
                      }
                    },
                    {
                      type: "TextBlock",
                      props: {
                        content: businessData.phone,
                        variant: "paragraph",
                        align: "left"
                      }
                    }
                  ]
                },
                {
                  type: "SpacerBlock",
                  props: { height: 16 }
                }
              ] : []),
              // Email
              ...(businessData?.email ? [
                {
                  type: "ColumnsBlock",
                  props: {
                    columns: "2",
                    gap: "small",
                    stackOnMobile: "no"
                  },
                  children: [
                    {
                      type: "IconBlock",
                      props: {
                        icon: "mail",
                        size: "medium",
                        color: "#3B82F6"
                      }
                    },
                    {
                      type: "TextBlock",
                      props: {
                        content: businessData.email,
                        variant: "paragraph",
                        align: "left"
                      }
                    }
                  ]
                },
                {
                  type: "SpacerBlock",
                  props: { height: 16 }
                }
              ] : []),
              // Address
              ...(businessData?.address ? [
                {
                  type: "ColumnsBlock",
                  props: {
                    columns: "2",
                    gap: "small",
                    stackOnMobile: "no"
                  },
                  children: [
                    {
                      type: "IconBlock",
                      props: {
                        icon: "mapPin",
                        size: "medium",
                        color: "#3B82F6"
                      }
                    },
                    {
                      type: "TextBlock",
                      props: {
                        content: businessData.address,
                        variant: "paragraph",
                        align: "left"
                      }
                    }
                  ]
                },
                {
                  type: "SpacerBlock",
                  props: { height: 32 }
                }
              ] : []),
              {
                type: "ButtonBlock",
                props: {
                  text: "Get Directions",
                  link: businessData?.address ? `https://maps.google.com/?q=${encodeURIComponent(businessData.address)}` : "#",
                  variant: "outline",
                  size: "default"
                }
              }
            ]
          },
          // Business Hours Column
          {
            type: "CardBlock",
            props: {
              title: "Business Hours",
              variant: "default"
            },
            children: [
              {
                type: "BusinessHoursBlock",
                props: {
                  layout: "list",
                  showToday: "yes",
                  showStatus: "yes"
                }
              }
            ]
          }
        ]
      },
      {
        type: "SpacerBlock",
        props: { height: 48 }
      },
      // CTA Button
      {
        type: "ButtonBlock",
        props: {
          text: "Book Appointment",
          link: "#booking",
          variant: "default",
          size: "lg",
          align: "center"
        }
      }
    ]
  },
  icon: Phone,
  category: "Section"
};

// Team Section Block - Template
export const TeamBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => null,
  isTemplate: true,
  template: (_business?: unknown) => {
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "muted"
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "Meet Our Team",
              variant: "h2",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 16 }
          },
          {
            type: "TextBlock",
            props: {
              content: "The people behind our success",
              variant: "lead",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 48 }
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "4",
              gap: "medium",
              stackOnMobile: "yes"
            },
            children: [
              // Team Member 1
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                      alt: "Team member",
                      rounded: "full",
                      width: "narrow"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "John Smith",
                      variant: "h4",
                      align: "center"
                    }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "CEO & Founder",
                      variant: "small",
                      align: "center",
                      color: "#3B82F6"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 12 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Leading our company with vision and dedication to excellence.",
                      variant: "small",
                      align: "center"
                    }
                  }
                ]
              },
              // Team Member 2
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                      alt: "Team member",
                      rounded: "full",
                      width: "narrow"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Sarah Johnson",
                      variant: "h4",
                      align: "center"
                    }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Operations Manager",
                      variant: "small",
                      align: "center",
                      color: "#3B82F6"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 12 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Ensuring smooth operations and exceptional customer service.",
                      variant: "small",
                      align: "center"
                    }
                  }
                ]
              },
              // Team Member 3
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                      alt: "Team member",
                      rounded: "full",
                      width: "narrow"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Michael Chen",
                      variant: "h4",
                      align: "center"
                    }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Lead Technician",
                      variant: "small",
                      align: "center",
                      color: "#3B82F6"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 12 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Expert technician with over 10 years of experience.",
                      variant: "small",
                      align: "center"
                    }
                  }
                ]
              },
              // Team Member 4
              {
                type: "CardBlock",
                props: {
                  variant: "default"
                },
                children: [
                  {
                    type: "ImageBlock",
                    props: {
                      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                      alt: "Team member",
                      rounded: "full",
                      width: "narrow"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 16 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Emily Davis",
                      variant: "h4",
                      align: "center"
                    }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Customer Success",
                      variant: "small",
                      align: "center",
                      color: "#3B82F6"
                    }
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 12 }
                  },
                  {
                    type: "TextBlock",
                    props: {
                      content: "Dedicated to ensuring customer satisfaction and success.",
                      variant: "small",
                      align: "center"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  },
  icon: Users,
  category: "Section"
};

// CTA Section Block - Template
export const CTABlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => null,
  isTemplate: true,
  template: (_business?: unknown) => {
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "xlarge",
          backgroundColor: "primary",
          backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c",
          backgroundImageStyle: "cover",
          overlayOpacity: 0.8
        },
        children: [
          {
            type: "TextBlock",
            props: {
              content: "Ready to Get Started?",
              variant: "h1",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 24 }
          },
          {
            type: "TextBlock",
            props: {
              content: "Join hundreds of satisfied customers who trust us with their needs. Let us help you achieve your goals.",
              variant: "lead",
              align: "center"
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 40 }
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "small",
              stackOnMobile: "yes"
            },
            children: [
              {
                type: "ButtonBlock",
                props: {
                  text: "Get Started",
                  link: "#contact",
                  variant: "secondary",
                  size: "lg",
                  align: "right"
                }
              },
              {
                type: "ButtonBlock",
                props: {
                  text: "Learn More",
                  link: "#about",
                  variant: "outline",
                  size: "lg",
                  align: "left"
                }
              }
            ]
          }
        ]
      }
    ];
  },
  icon: Target,
  category: "Section"
};

// Footer Section Block - Template
export const FooterBlock: ComponentConfig = {
  fields: {},
  render: (_props, _editMode, _business) => null,
  isTemplate: true,
  template: (business?: unknown) => {
    const businessData = business as Doc<"businesses"> | undefined;
    
    return [
      {
        type: "SectionBlock",
        props: {
          width: "container",
          verticalPadding: "large",
          backgroundColor: "muted"
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "4",
              gap: "large",
              stackOnMobile: "yes"
            },
            children: [
              // Business Info Column
              {
                type: "TextBlock",
                props: {
                  content: businessData?.name || "Your Business",
                  variant: "h3",
                  align: "left"
                }
              },
              {
                type: "SpacerBlock",
                props: { height: 16 }
              },
              ...(businessData?.address ? [
                {
                  type: "TextBlock",
                  props: {
                    content: businessData.address,
                    variant: "small",
                    align: "left"
                  }
                },
                {
                  type: "SpacerBlock",
                  props: { height: 8 }
                }
              ] : []),
              ...(businessData?.phone ? [
                {
                  type: "TextBlock",
                  props: {
                    content: businessData.phone,
                    variant: "small",
                    align: "left"
                  }
                },
                {
                  type: "SpacerBlock",
                  props: { height: 8 }
                }
              ] : []),
              ...(businessData?.email ? [
                {
                  type: "TextBlock",
                  props: {
                    content: businessData.email,
                    variant: "small",
                    align: "left"
                  }
                }
              ] : []),
              // Quick Links Column
              {
                type: "TextBlock",
                props: {
                  content: "Quick Links",
                  variant: "h4",
                  align: "left"
                }
              },
              {
                type: "SpacerBlock",
                props: { height: 16 }
              },
              {
                type: "ListBlock",
                props: {
                  items: [
                    "About Us",
                    "Services",
                    "Gallery",
                    "Contact"
                  ],
                  style: "bullet",
                  spacing: "compact"
                }
              },
              // Services Column
              {
                type: "TextBlock",
                props: {
                  content: "Services",
                  variant: "h4",
                  align: "left"
                }
              },
              {
                type: "SpacerBlock",
                props: { height: 16 }
              },
              {
                type: "ListBlock",
                props: {
                  items: [
                    "Professional Service",
                    "Premium Service",
                    "Complete Care",
                    "Consultation"
                  ],
                  style: "bullet",
                  spacing: "compact"
                }
              },
              // Connect Column
              {
                type: "TextBlock",
                props: {
                  content: "Connect With Us",
                  variant: "h4",
                  align: "left"
                }
              },
              {
                type: "SpacerBlock",
                props: { height: 16 }
              },
              {
                type: "SocialLinksBlock",
                props: {
                  platforms: [
                    { platform: "facebook", url: "https://facebook.com" },
                    { platform: "instagram", url: "https://instagram.com" },
                    { platform: "twitter", url: "https://twitter.com" },
                    { platform: "linkedin", url: "https://linkedin.com" }
                  ],
                  style: "icons",
                  size: "small",
                  gap: "small"
                }
              },
              {
                type: "SpacerBlock",
                props: { height: 24 }
              },
              {
                type: "BadgeBlock",
                props: {
                  type: "verified",
                  text: "Licensed & Insured",
                  icon: "shield",
                  size: "small",
                  color: "success"
                }
              }
            ]
          },
          {
            type: "SpacerBlock",
            props: { height: 48 }
          },
          {
            type: "DividerBlock",
            props: {
              style: "solid",
              width: "full",
              opacity: 20
            }
          },
          {
            type: "SpacerBlock",
            props: { height: 24 }
          },
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "medium",
              stackOnMobile: "yes"
            },
            children: [
              {
                type: "TextBlock",
                props: {
                  content: `© ${new Date().getFullYear()} ${businessData?.name || "Your Business"}. All rights reserved.`,
                  variant: "small",
                  align: "left"
                }
              },
              {
                type: "PaymentMethodsBlock",
                props: {
                  methods: ["visa", "mastercard", "amex", "paypal"],
                  size: "small",
                  showLabel: "no"
                }
              }
            ]
          }
        ]
      }
    ];
  },
  icon: Columns3,
  category: "Section"
};