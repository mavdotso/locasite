import React from "react";
import { ComponentConfig } from "../types";
import { 
  Image as ImageIcon, 
  MapPin,
  Clock,
  Phone,
  Star,
  Info,
  Mail
} from "lucide-react";
import Hero from "@/app/components/business/hero";
import Gallery from "@/app/components/business/gallery";
import BusinessInfo from "@/app/components/business/info";
import Hours from "@/app/components/business/hours";
import Map from "@/app/components/business/map";
import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

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
      // Extract just the content without the section wrapper
      return (
        <div className="py-16">
          <div className="mx-auto px-4 container">
            <div className="mx-auto max-w-3xl">
              <Card className="shadow-md border-none">
                <CardHeader>
                  <CardTitle className="font-bold text-3xl text-center">{title || "About Us"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mx-auto prose prose-lg prose-slate">
                    {content ? (
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                      <p className="text-muted-foreground text-center italic">No information available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
      // Extract just the content without the section wrapper
      return (
        <div className="py-12">
          <div className="mx-auto px-4 container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 font-bold text-3xl">{title || "Contact Us"}</h2>
              {subtitle && <p className="mb-8 text-muted-foreground text-lg">{subtitle}</p>}
              <Card>
                <CardHeader>
                  <CardTitle className="font-medium text-lg text-center">
                    Have questions or want to get in touch? Use the contact information below.
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex md:flex-row flex-col md:justify-center gap-8">
                    <div className="text-center">
                      <div className="flex justify-center items-center bg-primary/10 mx-auto mb-3 rounded-full w-12 h-12">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-medium">Phone</h3>
                      {businessData?.phone ? (
                        <a href={`tel:${businessData.phone}`} className="text-primary hover:underline">
                          {businessData.phone}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">Not available</p>
                      )}
                    </div>
                    {businessData?.email && (
                      <div className="text-center">
                        <div className="flex justify-center items-center bg-primary/10 mx-auto mb-3 rounded-full w-12 h-12">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Email</h3>
                        <a href={`mailto:${businessData.email}`} className="text-primary hover:underline">
                          {businessData.email}
                        </a>
                      </div>
                    )}
                    {businessData?.address && (
                      <div className="text-center">
                        <div className="flex justify-center items-center bg-primary/10 mx-auto mb-3 rounded-full w-12 h-12">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-muted-foreground">{businessData.address}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
      const reviews = businessData?.reviews?.slice(0, limit)?.map(r => ({
        author_name: r.reviewer,
        rating: r.rating,
        text: r.text
      })) || [];
      
      // Extract just the content without the section wrapper
      return (
        <div className="py-12">
          <div className="mx-auto px-4 container">
            <h2 className="mb-8 font-bold text-3xl text-center">{title || "Customer Reviews"}</h2>
            {reviews.length > 0 ? (
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review, id) => (
                  <Card key={id || `review-${review.author_name}-${review.rating}`} className="bg-card/5 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Number(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="font-semibold">{review.author_name}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{review.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No reviews available</p>
            )}
          </div>
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