// Section Templates - Pre-configured collections of primitive components
// These are not special components, but rather templates that insert multiple primitive components

export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  generateComponents: (props?: Record<string, unknown>) => Array<{
    id: string;
    type: string;
    props: Record<string, unknown>;
    children?: Array<{
      id: string;
      type: string;
      props: Record<string, unknown>;
      children?: unknown[];
    }>;
  }>;
}

let templateIdCounter = 0;

// Hero Section Template
export const heroTemplate: ComponentTemplate = {
  id: "hero-template",
  name: "Hero Section",
  description: "Full-width hero with background image and CTA buttons",
  category: "Headers",
  icon: "Layout",
  generateComponents: (props) => {
    const baseId = `template-${Date.now()}-${templateIdCounter++}`;
    return [{
      id: `${baseId}-hero-section`,
      type: "SectionBlock",
      props: {
        width: "full",
        verticalPadding: "none"
      },
      children: [{
        id: `${baseId}-hero-bg`,
        type: "DividerBlock",
        props: {
          height: "xlarge",
          backgroundImage: props?.backgroundImage || "",
          backgroundColor: "#000000",
          overlayOpacity: props?.overlayOpacity || 0.5
        },
        children: [{
          id: `${baseId}-hero-content`,
          type: "SectionBlock",
          props: {
            width: "container",
            verticalPadding: "xlarge"
          },
          children: [
            {
              id: `${baseId}-hero-title`,
              type: "TextBlock",
              props: {
                content: props?.title || "Welcome to Our Business",
                variant: "h1",
                align: "center",
                color: "#ffffff"
              }
            },
            {
              id: `${baseId}-hero-spacer-1`,
              type: "SpacerBlock",
              props: {
                size: "medium"
              }
            },
            {
              id: `${baseId}-hero-subtitle`,
              type: "TextBlock",
              props: {
                content: props?.subtitle || "Discover our amazing products and services",
                variant: "lead",
                align: "center",
                color: "#ffffff"
              }
            },
            {
              id: `${baseId}-hero-spacer-2`,
              type: "SpacerBlock",
              props: {
                size: "large"
              }
            },
            {
              id: `${baseId}-hero-buttons`,
              type: "ColumnsBlock",
              props: {
                columns: "2",
                gap: "small",
                stackOnMobile: "yes"
              },
              children: [
                {
                  id: `${baseId}-hero-btn-1`,
                  type: "ButtonBlock",
                  props: {
                    text: props?.primaryButtonText || "Get Started",
                    link: props?.primaryButtonLink || "#contact",
                    variant: "default",
                    size: "large",
                    align: "right"
                  }
                },
                {
                  id: `${baseId}-hero-btn-2`,
                  type: "ButtonBlock",
                  props: {
                    text: props?.secondaryButtonText || "Learn More",
                    link: props?.secondaryButtonLink || "#about",
                    variant: "outline",
                    size: "large",
                    align: "left"
                  }
                }
              ]
            }
          ]
        }]
      }]
    }];
  }
};

// About Section Template
export const aboutTemplate: ComponentTemplate = {
  id: "about-template",
  name: "About Section",
  description: "Text and image side by side",
  category: "Content",
  icon: "FileText",
  generateComponents: (props) => {
    const baseId = `template-${Date.now()}-${templateIdCounter++}`;
    return [{
      id: `${baseId}-about-section`,
      type: "SectionBlock",
      props: {
        width: "container",
        verticalPadding: "large"
      },
      children: [{
        id: `${baseId}-about-columns`,
        type: "ColumnsBlock",
        props: {
          columns: "2",
          gap: "large",
          stackOnMobile: "yes"
        },
        children: [
          {
            id: `${baseId}-about-content`,
            type: "SectionBlock",
            props: {
              width: "full",
              verticalPadding: "none"
            },
            children: [
              {
                id: `${baseId}-about-title`,
                type: "TextBlock",
                props: {
                  content: props?.title || "About Us",
                  variant: "h2",
                  align: "left"
                }
              },
              {
                id: `${baseId}-about-spacer`,
                type: "SpacerBlock",
                props: {
                  size: "medium"
                }
              },
              {
                id: `${baseId}-about-text`,
                type: "TextBlock",
                props: {
                  content: props?.content || "We are dedicated to providing exceptional service to our customers. Our commitment to quality and excellence sets us apart.",
                  variant: "paragraph",
                  align: "left"
                }
              }
            ]
          },
          {
            id: `${baseId}-about-image`,
            type: "ImageBlock",
            props: {
              src: props?.image || "",
              alt: "About us",
              aspectRatio: "auto",
              objectFit: "cover"
            }
          }
        ]
      }]
    }];
  }
};

// Services Grid Template
export const servicesTemplate: ComponentTemplate = {
  id: "services-template",
  name: "Services Grid",
  description: "Grid of service cards with icons",
  category: "Content",
  icon: "Grid",
  generateComponents: (props) => {
    const baseId = `template-${Date.now()}-${templateIdCounter++}`;
    const services = props?.services as Array<{ icon?: string; title?: string; description?: string }> || [
      { icon: "briefcase", title: "Service 1", description: "Description of service 1" },
      { icon: "shield", title: "Service 2", description: "Description of service 2" },
      { icon: "award", title: "Service 3", description: "Description of service 3" }
    ];

    return [{
      id: `${baseId}-services-section`,
      type: "SectionBlock",
      props: {
        width: "container",
        verticalPadding: "large"
      },
      children: [
        {
          id: `${baseId}-services-title`,
          type: "TextBlock",
          props: {
            content: props?.title || "Our Services",
            variant: "h2",
            align: "center"
          }
        },
        {
          id: `${baseId}-services-subtitle`,
          type: "TextBlock",
          props: {
            content: props?.subtitle || "What we offer",
            variant: "lead",
            align: "center"
          }
        },
        {
          id: `${baseId}-services-spacer`,
          type: "SpacerBlock",
          props: {
            size: "large"
          }
        },
        {
          id: `${baseId}-services-grid`,
          type: "ColumnsBlock",
          props: {
            columns: "3",
            gap: "medium",
            stackOnMobile: "yes"
          },
          children: services.map((service, index) => ({
            id: `${baseId}-service-${index}`,
            type: "CardBlock",
            props: {
              title: "",
              description: "",
              variant: "default",
              padding: "medium"
            },
            children: [
              {
                id: `${baseId}-service-${index}-icon`,
                type: "IconBlock",
                props: {
                  icon: service.icon || "briefcase",
                  size: "large",
                  color: "",
                  align: "center"
                }
              },
              {
                id: `${baseId}-service-${index}-spacer-1`,
                type: "SpacerBlock",
                props: {
                  size: "small"
                }
              },
              {
                id: `${baseId}-service-${index}-title`,
                type: "TextBlock",
                props: {
                  content: service.title || `Service ${index + 1}`,
                  variant: "h3",
                  align: "center"
                }
              },
              {
                id: `${baseId}-service-${index}-spacer-2`,
                type: "SpacerBlock",
                props: {
                  size: "small"
                }
              },
              {
                id: `${baseId}-service-${index}-desc`,
                type: "TextBlock",
                props: {
                  content: service.description || "Service description goes here",
                  variant: "paragraph",
                  align: "center"
                }
              }
            ]
          }))
        }
      ]
    }];
  }
};

// Contact Section Template
export const contactTemplate: ComponentTemplate = {
  id: "contact-template",
  name: "Contact Section",
  description: "Contact information with icons",
  category: "Contact",
  icon: "Phone",
  generateComponents: (props) => {
    const baseId = `template-${Date.now()}-${templateIdCounter++}`;
    const business = props?.business as {
      phone?: string;
      email?: string;
      address?: string;
    } | undefined;
    
    const contactMethods = [];
    if (business?.phone) {
      contactMethods.push({
        icon: "phone",
        label: "Phone",
        value: business.phone,
        link: `tel:${business.phone}`
      });
    }
    if (business?.email) {
      contactMethods.push({
        icon: "mail",
        label: "Email",
        value: business.email,
        link: `mailto:${business.email}`
      });
    }
    if (business?.address) {
      contactMethods.push({
        icon: "mapPin",
        label: "Address",
        value: business.address,
        link: `https://maps.google.com/?q=${encodeURIComponent(business.address)}`
      });
    }
    
    // Default contact methods if no business data
    if (contactMethods.length === 0) {
      contactMethods.push(
        { icon: "phone", label: "Phone", value: "(555) 123-4567", link: "tel:5551234567" },
        { icon: "mail", label: "Email", value: "info@example.com", link: "mailto:info@example.com" },
        { icon: "mapPin", label: "Address", value: "123 Main St, City, State", link: "#" }
      );
    }

    return [{
      id: `${baseId}-contact-section`,
      type: "SectionBlock",
      props: {
        width: "container",
        verticalPadding: "large"
      },
      children: [
        {
          id: `${baseId}-contact-title`,
          type: "TextBlock",
          props: {
            content: props?.title || "Get in Touch",
            variant: "h2",
            align: "center"
          }
        },
        {
          id: `${baseId}-contact-subtitle`,
          type: "TextBlock",
          props: {
            content: props?.subtitle || "We'd love to hear from you",
            variant: "lead",
            align: "center"
          }
        },
        {
          id: `${baseId}-contact-spacer`,
          type: "SpacerBlock",
          props: {
            size: "large"
          }
        },
        {
          id: `${baseId}-contact-grid`,
          type: "ColumnsBlock",
          props: {
            columns: contactMethods.length > 2 ? "3" : "2",
            gap: "medium",
            stackOnMobile: "yes"
          },
          children: contactMethods.map((method, index) => ({
            id: `${baseId}-contact-${index}`,
            type: "CardBlock",
            props: {
              title: "",
              description: "",
              variant: "default",
              padding: "medium"
            },
            children: [
              {
                id: `${baseId}-contact-${index}-icon`,
                type: "IconBlock",
                props: {
                  icon: method.icon,
                  size: "large",
                  color: "",
                  align: "center"
                }
              },
              {
                id: `${baseId}-contact-${index}-spacer-1`,
                type: "SpacerBlock",
                props: {
                  size: "small"
                }
              },
              {
                id: `${baseId}-contact-${index}-label`,
                type: "TextBlock",
                props: {
                  content: method.label,
                  variant: "h4",
                  align: "center"
                }
              },
              {
                id: `${baseId}-contact-${index}-spacer-2`,
                type: "SpacerBlock",
                props: {
                  size: "small"
                }
              },
              {
                id: `${baseId}-contact-${index}-value`,
                type: "ButtonBlock",
                props: {
                  text: method.value,
                  link: method.link,
                  variant: "ghost",
                  size: "medium",
                  align: "center"
                }
              }
            ]
          }))
        }
      ]
    }];
  }
};

// Testimonials Template
export const testimonialsTemplate: ComponentTemplate = {
  id: "testimonials-template",
  name: "Testimonials",
  description: "Customer testimonials in cards",
  category: "Social",
  icon: "Star",
  generateComponents: (props) => {
    const baseId = `template-${Date.now()}-${templateIdCounter++}`;
    const testimonials = props?.testimonials as Array<{ name?: string; role?: string; content?: string; rating?: number }> || [
      { name: "John Doe", role: "CEO, Company", content: "Amazing service! Highly recommend.", rating: 5 },
      { name: "Jane Smith", role: "Manager", content: "Professional and reliable.", rating: 5 }
    ];

    return [{
      id: `${baseId}-testimonials-section`,
      type: "SectionBlock",
      props: {
        width: "container",
        verticalPadding: "large"
      },
      children: [
        {
          id: `${baseId}-testimonials-title`,
          type: "TextBlock",
          props: {
            content: props?.title || "What Our Customers Say",
            variant: "h2",
            align: "center"
          }
        },
        {
          id: `${baseId}-testimonials-spacer`,
          type: "SpacerBlock",
          props: {
            size: "large"
          }
        },
        {
          id: `${baseId}-testimonials-grid`,
          type: "ColumnsBlock",
          props: {
            columns: testimonials.length > 2 ? "3" : "2",
            gap: "medium",
            stackOnMobile: "yes"
          },
          children: testimonials.map((testimonial, index) => ({
            id: `${baseId}-testimonial-${index}`,
            type: "CardBlock",
            props: {
              title: testimonial.name || "Customer",
              description: testimonial.role || "",
              variant: "default",
              padding: "medium"
            },
            children: [
              {
                id: `${baseId}-testimonial-${index}-content`,
                type: "TextBlock",
                props: {
                  content: `"${testimonial.content || 'Great service!'}"`,
                  variant: "paragraph",
                  align: "left"
                }
              },
              testimonial.rating && {
                id: `${baseId}-testimonial-${index}-spacer`,
                type: "SpacerBlock",
                props: {
                  size: "small"
                }
              },
              testimonial.rating && {
                id: `${baseId}-testimonial-${index}-rating`,
                type: "TextBlock",
                props: {
                  content: "★".repeat(testimonial.rating) + "☆".repeat(5 - testimonial.rating),
                  variant: "small",
                  align: "left",
                  color: "#fbbf24"
                }
              }
            ].filter(Boolean)
          }))
        }
      ]
    }];
  }
};

// Gallery Template
export const galleryTemplate: ComponentTemplate = {
  id: "gallery-template",
  name: "Photo Gallery",
  description: "Grid of images",
  category: "Media",
  icon: "Image",
  generateComponents: (props) => {
    const baseId = `template-${Date.now()}-${templateIdCounter++}`;
    const images = props?.images as string[] || [];

    return [{
      id: `${baseId}-gallery-section`,
      type: "SectionBlock",
      props: {
        width: "container",
        verticalPadding: "large"
      },
      children: [
        {
          id: `${baseId}-gallery-title`,
          type: "TextBlock",
          props: {
            content: props?.title || "Photo Gallery",
            variant: "h2",
            align: "center"
          }
        },
        {
          id: `${baseId}-gallery-spacer`,
          type: "SpacerBlock",
          props: {
            size: "large"
          }
        },
        {
          id: `${baseId}-gallery-grid`,
          type: "ColumnsBlock",
          props: {
            columns: props?.columns || "3",
            gap: "small",
            stackOnMobile: "yes"
          },
          children: images.map((image, index) => ({
            id: `${baseId}-gallery-image-${index}`,
            type: "ImageBlock",
            props: {
              src: image,
              alt: `Gallery image ${index + 1}`,
              aspectRatio: "square",
              objectFit: "cover"
            }
          }))
        }
      ]
    }];
  }
};

// CTA Template
export const ctaTemplate: ComponentTemplate = {
  id: "cta-template",
  name: "Call to Action",
  description: "Eye-catching CTA section",
  category: "Marketing",
  icon: "Megaphone",
  generateComponents: (props) => {
    const baseId = `template-${Date.now()}-${templateIdCounter++}`;
    
    return [{
      id: `${baseId}-cta-section`,
      type: "SectionBlock",
      props: {
        width: "full",
        verticalPadding: "large"
      },
      children: [{
        id: `${baseId}-cta-bg`,
        type: "DividerBlock",
        props: {
          height: "medium",
          backgroundColor: props?.backgroundColor || "#f3f4f6"
        },
        children: [{
          id: `${baseId}-cta-content`,
          type: "SectionBlock",
          props: {
            width: "container",
            verticalPadding: "medium"
          },
          children: [
            {
              id: `${baseId}-cta-title`,
              type: "TextBlock",
              props: {
                content: props?.title || "Ready to Get Started?",
                variant: "h2",
                align: "center"
              }
            },
            {
              id: `${baseId}-cta-spacer-1`,
              type: "SpacerBlock",
              props: {
                size: "small"
              }
            },
            {
              id: `${baseId}-cta-description`,
              type: "TextBlock",
              props: {
                content: props?.description || "Contact us today to learn more about our services",
                variant: "paragraph",
                align: "center"
              }
            },
            {
              id: `${baseId}-cta-spacer-2`,
              type: "SpacerBlock",
              props: {
                size: "medium"
              }
            },
            {
              id: `${baseId}-cta-button`,
              type: "ButtonBlock",
              props: {
                text: props?.buttonText || "Contact Us",
                link: props?.buttonLink || "#contact",
                variant: "default",
                size: "large",
                align: "center"
              }
            }
          ]
        }]
      }]
    }];
  }
};

// Export all templates
export const sectionTemplates: ComponentTemplate[] = [
  heroTemplate,
  aboutTemplate,
  servicesTemplate,
  contactTemplate,
  testimonialsTemplate,
  galleryTemplate,
  ctaTemplate
];