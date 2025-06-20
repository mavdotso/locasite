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
import { Doc } from "@/convex/_generated/dataModel";

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
    },
    render: (props) => {
      const { title, subtitle, backgroundImage } = props as {
        title?: string;
        subtitle?: string;
        backgroundImage?: string;
      };
      return (
        <Hero 
          title={title}
          subtitle={subtitle}
          image={backgroundImage}
        />
      );
    },
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
    render: (props) => {
      const { title, content } = props as { title?: string; content?: string };
      return (
        <About title={title} content={content} />
      );
    },
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
    render: (props) => {
      const { title, images } = props as { title?: string; images?: string[] };
      return (
        <div className="py-16">
          {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
          <Gallery images={images || []} />
        </div>
      );
    },
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
      }
    },
    render: (props, _editMode, business) => {
      const { title, subtitle } = props as { title?: string; subtitle?: string };
      const businessData = business as Doc<"businesses"> | undefined;
      return (
        <Contact 
          title={title}
          subtitle={subtitle}
          phone={businessData?.phone}
          email={businessData?.email}
          address={businessData?.address}
        />
      );
    },
    icon: Phone,
    category: "Contact"
  },

  InfoBlock: {
    fields: {},
    render: (props, _editMode, business) => {
      const businessData = business as Doc<"businesses"> | undefined;
      return (
        <BusinessInfo 
          address={businessData?.address}
          phone={businessData?.phone}
          email={businessData?.email}
          website={businessData?.website}
          hours={businessData?.hours}
        />
      );
    },
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
      limit: {
        type: "number",
        label: "Number of Reviews",
        defaultValue: 6,
        min: 1,
        max: 20,
        step: 1
      }
    },
    render: (props, _editMode, business) => {
      const { title, limit } = props as { title?: string; limit?: number };
      const businessData = business as Doc<"businesses"> | undefined;
      return (
        <div className="py-16">
          {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
          <Reviews 
            reviews={businessData?.reviews?.slice(0, limit)?.map(r => ({
              author_name: r.reviewer,
              rating: r.rating,
              text: r.text
            })) || []}
          />
        </div>
      );
    },
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
    render: (props, _editMode, business) => {
      const { title, height } = props as { title?: string; height?: number };
      const businessData = business as Doc<"businesses"> | undefined;
      return (
        <div className="py-16">
          {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
          <div style={{ height: `${height}px` }}>
            <Map 
              address={businessData?.address || ""}
            />
          </div>
        </div>
      );
    },
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
    },
    render: (props, _editMode, business) => {
      const { title } = props as { title?: string };
      const businessData = business as Doc<"businesses"> | undefined;
      return (
        <div className="py-16">
          {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
          <Hours 
            hours={businessData?.hours}
          />
        </div>
      );
    },
    icon: Clock,
    category: "Contact"
  }
};