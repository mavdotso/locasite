import React from "react";
import { ComponentConfig } from "../types";
import { 
  Image as ImageIcon, 
  MapPin,
  Clock,
  Phone,
  Star,
  Info
} from "lucide-react";
import Hero from "@/app/components/business/hero";
import Gallery from "@/app/components/business/gallery";
import BusinessInfo from "@/app/components/business/info";
import Reviews from "@/app/components/business/reviews";
import Contact from "@/app/components/business/contact";
import About from "@/app/components/business/about";
import Hours from "@/app/components/business/hours";
import Map from "@/app/components/business/map";

export const componentConfigs: Record<string, ComponentConfig> = {
  HeroBlock: {
    fields: {
      title: {
        type: "text",
        label: "Title",
        defaultValue: "Welcome to Our Business",
        placeholder: "Enter hero title",
        required: true
      },
      subtitle: {
        type: "textarea",
        label: "Subtitle",
        defaultValue: "Discover what makes us special",
        placeholder: "Enter hero subtitle",
        rows: 3
      },
      backgroundImage: {
        type: "image",
        label: "Background Image",
        accept: "image/*"
      },
      showButton: {
        type: "select",
        label: "Show Button",
        defaultValue: "true",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]
      },
      buttonText: {
        type: "text",
        label: "Button Text",
        defaultValue: "Get Started",
        placeholder: "Enter button text"
      },
      buttonLink: {
        type: "text",
        label: "Button Link",
        defaultValue: "#contact",
        placeholder: "#contact or URL"
      }
    },
    render: ({ title, subtitle, backgroundImage, showButton, buttonText, buttonLink }) => (
      <Hero 
        title={title}
        subtitle={subtitle}
        image={backgroundImage}
        buttonText={showButton === "true" ? buttonText : undefined}
        buttonLink={showButton === "true" ? buttonLink : undefined}
      />
    ),
    icon: ImageIcon,
    category: "Content"
  },

  AboutBlock: {
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        defaultValue: "About Us",
        required: true
      },
      content: {
        type: "textarea",
        label: "Content",
        defaultValue: "Tell your story here. Share what makes your business unique and why customers choose you.",
        rows: 6,
        required: true
      }
    },
    render: ({ title, content }) => (
      <About content={content} customTitle={title} />
    ),
    icon: Info,
    category: "Content"
  },

  GalleryBlock: {
    fields: {
      title: {
        type: "text",
        label: "Gallery Title",
        defaultValue: "Photo Gallery"
      },
      images: {
        type: "array",
        label: "Images",
        defaultValue: [],
        itemType: {
          type: "image",
          label: "Image",
          accept: "image/*"
        },
        maxItems: 12
      }
    },
    render: ({ title, images }) => (
      <div className="py-16">
        {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
        <Gallery images={images} />
      </div>
    ),
    icon: ImageIcon,
    category: "Media"
  },

  ContactBlock: {
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        defaultValue: "Get in Touch"
      },
      subtitle: {
        type: "textarea",
        label: "Subtitle",
        defaultValue: "We'd love to hear from you",
        rows: 2
      },
      showForm: {
        type: "select",
        label: "Show Contact Form",
        defaultValue: "true",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]
      }
    },
    render: ({ title, subtitle, showForm }, editMode, business) => (
      <Contact 
        business={business}
        showForm={showForm === "true"}
        title={title}
        subtitle={subtitle}
      />
    ),
    icon: Phone,
    category: "Contact"
  },

  InfoBlock: {
    fields: {
      showPhone: {
        type: "select",
        label: "Show Phone",
        defaultValue: "true",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]
      },
      showEmail: {
        type: "select",
        label: "Show Email",
        defaultValue: "true",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]
      },
      showAddress: {
        type: "select",
        label: "Show Address",
        defaultValue: "true",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]
      },
      showHours: {
        type: "select",
        label: "Show Hours",
        defaultValue: "true",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]
      }
    },
    render: (props, editMode, business) => (
      <BusinessInfo 
        business={business}
        {...props}
      />
    ),
    icon: Info,
    category: "Contact"
  },

  ReviewsBlock: {
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        defaultValue: "What Our Customers Say"
      },
      showRating: {
        type: "select",
        label: "Show Average Rating",
        defaultValue: "true",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]
      },
      limit: {
        type: "number",
        label: "Number of Reviews",
        defaultValue: 6,
        min: 1,
        max: 20,
        step: 1
      }
    },
    render: ({ title, showRating, limit }, editMode, business) => (
      <div className="py-16">
        {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
        <Reviews 
          reviews={business?.reviews || []}
          limit={limit}
          showRating={showRating === "true"}
        />
      </div>
    ),
    icon: Star,
    category: "Social"
  },

  MapBlock: {
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        defaultValue: "Find Us"
      },
      height: {
        type: "number",
        label: "Map Height (px)",
        defaultValue: 400,
        min: 200,
        max: 800,
        step: 50,
        showSlider: true
      }
    },
    render: ({ title, height }, editMode, business) => (
      <div className="py-16">
        {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
        <div style={{ height: `${height}px` }}>
          <Map 
            address={business?.address || ""}
            googleMapsUrl={business?.googleMapsUrl}
          />
        </div>
      </div>
    ),
    icon: MapPin,
    category: "Location"
  },

  HoursBlock: {
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        defaultValue: "Business Hours"
      },
      showClosedDays: {
        type: "select",
        label: "Show Closed Days",
        defaultValue: "false",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]
      }
    },
    render: ({ title, showClosedDays }, editMode, business) => (
      <div className="py-16">
        {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
        <Hours 
          hours={business?.hours}
          showClosedDays={showClosedDays === "true"}
        />
      </div>
    ),
    icon: Clock,
    category: "Contact"
  }
};