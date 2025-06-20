import React from "react";
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
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Lightbulb,
  Heart,
  Zap,
  Shield,
  Rocket,
  Globe,
  Award,
  TrendingUp,
  Package,
  Headphones,
  Lock,
  CheckCircle,
  Gift
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";

// Icon mapping for services/features
const iconMap = {
  lightbulb: Lightbulb,
  heart: Heart,
  zap: Zap,
  shield: Shield,
  rocket: Rocket,
  globe: Globe,
  award: Award,
  trending: TrendingUp,
  package: Package,
  headphones: Headphones,
  lock: Lock,
  check: CheckCircle,
  gift: Gift,
  briefcase: Briefcase,
  star: Star,
  users: Users,
  target: Target
};

// Types
interface ButtonConfig {
  text: string;
  link: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

interface ServiceConfig {
  icon: string;
  title: string;
  description: string;
  price?: string;
}

interface ImageConfig {
  url: string;
  caption?: string;
}

interface TestimonialConfig {
  name: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
}

interface TeamMemberConfig {
  name: string;
  role: string;
  bio?: string;
  image?: string;
}

interface FooterColumnConfig {
  title: string;
  links?: Array<{ text: string; url: string }>;
}

// Gallery Component with Lightbox
const GalleryComponent: React.FC<{
  title?: string;
  layout?: string;
  columns?: number;
  images?: ImageConfig[] | string[];
}> = ({ title, layout = "grid", columns = 3, images = [] }) => {
  // Convert string array to ImageConfig array if needed
  const imageConfigs: ImageConfig[] = images.map(img => {
    if (typeof img === "string") {
      return { url: img, caption: "" };
    }
    return img as ImageConfig;
  });
  
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState(0);
  
  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  const goToPrevious = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const goToNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  
  if (images.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No images in gallery</p>
        </div>
      </div>
    );
  }
  
  const gridColsClasses = {
    2: "grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
  };
  
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
        
        {layout === "carousel" ? (
          <div className="relative max-w-4xl mx-auto">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={imageConfigs[currentImage]?.url || ""}
                alt={imageConfigs[currentImage]?.caption || `Image ${currentImage + 1}`}
                fill
                className="object-cover cursor-pointer"
                onClick={() => openLightbox(currentImage)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            {imageConfigs[currentImage]?.caption && (
              <p className="text-center mt-4 text-muted-foreground">
                {imageConfigs[currentImage].caption}
              </p>
            )}
          </div>
        ) : (
          <div className={cn(
            "grid gap-4",
            gridColsClasses[columns as keyof typeof gridColsClasses] || gridColsClasses[3]
          )}>
            {imageConfigs.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity",
                  layout === "masonry" && index % 3 === 0 && "row-span-2"
                )}
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="max-w-4xl max-h-[90vh] relative">
              <Image
                src={imageConfigs[currentImage]?.url || ""}
                alt={imageConfigs[currentImage]?.caption || `Image ${currentImage + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
              {imageConfigs[currentImage]?.caption && (
                <p className="text-white text-center mt-4">
                  {imageConfigs[currentImage].caption}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Testimonials Carousel Component
const TestimonialsCarouselComponent: React.FC<{
  title?: string;
  layout?: string;
  testimonials?: TestimonialConfig[] | string[];
}> = ({ title, layout = "grid", testimonials = [] }) => {
  // Parse testimonials from string format: "name|role|content|rating|image"
  const testimonialConfigs: TestimonialConfig[] = testimonials.map(t => {
    if (typeof t === "string") {
      const parts = t.split("|");
      return {
        name: parts[0] || "Customer",
        role: parts[1] || "",
        content: parts[2] || "Great service!",
        rating: parseInt(parts[3] || "5"),
        image: parts[4] || ""
      };
    }
    return t as TestimonialConfig;
  });
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  
  if (testimonialConfigs.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No testimonials to display</p>
        </div>
      </div>
    );
  }
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-5 h-5",
              i < rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
    );
  };
  
  if (layout === "carousel") {
    return (
      <div className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
          <div className="max-w-3xl mx-auto">
            <Card className="relative">
              <CardContent className="pt-8 pb-12 px-8">
                <div className="text-center">
                  {testimonialConfigs[currentTestimonial].image && (
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <Image
                        src={testimonialConfigs[currentTestimonial].image}
                        alt={testimonialConfigs[currentTestimonial].name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div className="mb-4 flex justify-center">
                    {renderStars(testimonialConfigs[currentTestimonial].rating)}
                  </div>
                  <blockquote className="text-lg mb-6 italic">
                    &ldquo;{testimonialConfigs[currentTestimonial].content}&rdquo;
                  </blockquote>
                  <div>
                    <p className="font-semibold">{testimonialConfigs[currentTestimonial].name}</p>
                    {testimonialConfigs[currentTestimonial].role && (
                      <p className="text-sm text-muted-foreground">
                        {testimonialConfigs[currentTestimonial].role}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              {testimonialConfigs.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonialConfigs.length) % testimonialConfigs.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background hover:bg-muted"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonialConfigs.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background hover:bg-muted"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  if (layout === "featured") {
    const featured = testimonialConfigs[0];
    const others = testimonialConfigs.slice(1);
    
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {featured.image && (
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={featured.image}
                        alt={featured.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-3">
                      {renderStars(featured.rating)}
                    </div>
                    <blockquote className="text-lg mb-4 italic">
                      &ldquo;{featured.content}&rdquo;
                    </blockquote>
                    <div>
                      <p className="font-semibold">{featured.name}</p>
                      {featured.role && (
                        <p className="text-sm text-muted-foreground">{featured.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {others.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {others.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    <blockquote className="mb-4 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      {testimonial.image && (
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        {testimonial.role && (
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Grid layout (default)
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialConfigs.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {testimonial.image && (
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    {testimonial.role && (
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className="italic text-muted-foreground">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Hero Section Block
export const HeroBlock: ComponentConfig = {
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
      rows: 2
    },
    backgroundImage: {
      type: "image",
      label: "Background Image",
      accept: "image/*"
    },
    overlayOpacity: {
      type: "number",
      label: "Overlay Opacity",
      defaultValue: 0.5,
      min: 0,
      max: 1,
      step: 0.1,
      showSlider: true
    },
    height: {
      type: "select",
      label: "Section Height",
      defaultValue: "large",
      options: [
        { value: "small", label: "Small (300px)" },
        { value: "medium", label: "Medium (400px)" },
        { value: "large", label: "Large (500px)" },
        { value: "xlarge", label: "Extra Large (600px)" },
        { value: "screen", label: "Full Screen" }
      ]
    },
    buttons: {
      type: "array",
      label: "Call to Action Buttons",
      defaultValue: [
        { text: "Get Started", link: "#contact", variant: "default" }
      ],
      itemType: {
        type: "text",
        label: "Button",
        defaultValue: "Get Started|#contact|default"
      },
      maxItems: 3
    }
  },
  render: (props: Record<string, unknown>) => {
    const { title, subtitle, backgroundImage, overlayOpacity = 0.5, height = "large", buttons = [] } = props as {
      title?: string;
      subtitle?: string;
      backgroundImage?: string;
      overlayOpacity?: number;
      height?: string;
      buttons?: ButtonConfig[]
    };
    
    const heightClasses = {
      small: "h-[300px]",
      medium: "h-[400px]",
      large: "h-[500px]",
      xlarge: "h-[600px]",
      screen: "h-screen"
    };
    
    return (
      <div className={cn("relative flex items-center justify-center", heightClasses[height as keyof typeof heightClasses])}>
        {backgroundImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div 
              className="absolute inset-0 bg-background"
              style={{ opacity: overlayOpacity }}
            />
          </>
        )}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8">{subtitle}</p>
          )}
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || "default"}
                  size="lg"
                  asChild
                >
                  <a href={button.link || "#"}>{button.text}</a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
  icon: Sparkles,
  category: "Hero"
};

// About Section Block
export const AboutBlock: ComponentConfig = {
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
    },
    image: {
      type: "image",
      label: "Section Image",
      accept: "image/*"
    },
    imagePosition: {
      type: "select",
      label: "Image Position",
      defaultValue: "right",
      options: [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "top", label: "Top" },
        { value: "bottom", label: "Bottom" }
      ]
    },
    backgroundColor: {
      type: "select",
      label: "Background Color",
      defaultValue: "default",
      options: [
        { value: "default", label: "Default" },
        { value: "muted", label: "Muted" },
        { value: "card", label: "Card" },
        { value: "accent", label: "Accent" }
      ]
    }
  },
  render: (props: Record<string, unknown>) => {
    const { title, content, image, imagePosition = "right", backgroundColor = "default" } = props as {
      title?: string;
      content?: string;
      image?: string;
      imagePosition?: string;
      backgroundColor?: string;
    };
    
    const bgClasses = {
      default: "",
      muted: "bg-muted",
      card: "bg-card",
      accent: "bg-accent/10"
    };
    
    const layoutClasses = {
      left: "md:flex-row-reverse",
      right: "md:flex-row",
      top: "flex-col",
      bottom: "flex-col-reverse"
    };
    
    return (
      <div className={cn("py-16", bgClasses[backgroundColor as keyof typeof bgClasses])}>
        <div className="container mx-auto px-4">
          <div className={cn(
            "flex flex-col gap-8 items-center",
            layoutClasses[imagePosition as keyof typeof layoutClasses]
          )}>
            {image && (
              <div className="flex-1 max-w-lg relative aspect-[4/3]">
                <Image
                  src={image} 
                  alt={title || "About section"}
                  fill
                  className="rounded-lg shadow-lg object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="flex-1 max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  icon: Info,
  category: "Content"
};

// Services Section Block
export const ServicesBlock: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Our Services",
      required: true
    },
    subtitle: {
      type: "text",
      label: "Section Subtitle",
      defaultValue: "What we offer",
      placeholder: "Optional subtitle"
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "grid3",
      options: [
        { value: "grid2", label: "2 Column Grid" },
        { value: "grid3", label: "3 Column Grid" },
        { value: "grid4", label: "4 Column Grid" },
        { value: "list", label: "List View" }
      ]
    },
    services: {
      type: "array",
      label: "Services",
      defaultValue: [
        {
          icon: "lightbulb",
          title: "Service One",
          description: "Description of your first service",
          price: "$99"
        },
        {
          icon: "heart",
          title: "Service Two", 
          description: "Description of your second service",
          price: "$149"
        },
        {
          icon: "zap",
          title: "Service Three",
          description: "Description of your third service",
          price: "$199"
        }
      ],
      itemType: {
        type: "text",
        label: "Service",
        defaultValue: "lightbulb|Service Title|Description of this service|$99"
      },
      maxItems: 12
    }
  },
  render: (props: Record<string, unknown>) => {
    const { title, subtitle, layout = "grid3", services = [] } = props as {
      title?: string;
      subtitle?: string;
      layout?: string;
      services?: ServiceConfig[]
    };
    
    const layoutClasses = {
      grid2: "grid-cols-1 md:grid-cols-2",
      grid3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      grid4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      list: "grid-cols-1"
    };
    
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn("grid gap-6", layoutClasses[layout as keyof typeof layoutClasses])}>
            {services.map((service, index) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap] || Briefcase;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    {service.price && (
                      <p className="text-lg font-semibold text-primary">{service.price}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
  icon: Briefcase,
  category: "Content"
};

// Gallery Section Block with Lightbox
export const GalleryBlock: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Gallery Title",
      defaultValue: "Photo Gallery"
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "grid",
      options: [
        { value: "grid", label: "Grid" },
        { value: "masonry", label: "Masonry" },
        { value: "carousel", label: "Carousel" }
      ]
    },
    columns: {
      type: "number",
      label: "Columns (Grid/Masonry)",
      defaultValue: 3,
      min: 2,
      max: 6,
      step: 1,
      showSlider: true
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
      maxItems: 20
    }
  },
  render: (props: Record<string, unknown>) => {
    return <GalleryComponent {...props as { title?: string; layout?: string; columns?: number; images?: ImageConfig[] }} />;
  },
  icon: ImageIcon,
  category: "Media"
};

// Testimonials Section Block
export const TestimonialsBlock: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "What Our Customers Say"
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "grid",
      options: [
        { value: "grid", label: "Grid" },
        { value: "carousel", label: "Carousel" },
        { value: "featured", label: "Featured" }
      ]
    },
    testimonials: {
      type: "array",
      label: "Testimonials",
      defaultValue: [
        "John Doe|CEO, Company|Amazing service! Highly recommend to everyone.|5|",
        "Jane Smith|Marketing Manager|Professional and reliable. Exceeded our expectations.|5|"
      ],
      itemType: {
        type: "text",
        label: "Testimonial",
        defaultValue: "John Doe|CEO, Company|Amazing service!|5|",
        placeholder: "Name|Role|Content|Rating|ImageURL"
      },
      maxItems: 10
    }
  },
  render: (props: Record<string, unknown>) => {
    return <TestimonialsCarouselComponent {...props as { title?: string; layout?: string; testimonials?: TestimonialConfig[] }} />;
  },
  icon: Star,
  category: "Social"
};

// Contact Section Block
export const ContactBlock: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Get in Touch"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "We'd love to hear from you"
    },
    showPhone: {
      type: "select",
      label: "Show Phone",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showEmail: {
      type: "select",
      label: "Show Email",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showAddress: {
      type: "select",
      label: "Show Address",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showHours: {
      type: "select",
      label: "Show Business Hours",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showMap: {
      type: "select",
      label: "Show Map",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props: Record<string, unknown>, _editMode, business) => {
    const { title, subtitle, showPhone, showEmail, showAddress, showHours, showMap } = props as {
      title?: string;
      subtitle?: string;
      showPhone?: string;
      showEmail?: string;
      showAddress?: string;
      showHours?: string;
      showMap?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    const contactMethods = [];
    
    if (showPhone === "yes" && businessData?.phone) {
      contactMethods.push({
        icon: Phone,
        label: "Phone",
        value: businessData.phone,
        href: `tel:${businessData.phone}`
      });
    }
    
    if (showEmail === "yes" && businessData?.email) {
      contactMethods.push({
        icon: Mail,
        label: "Email",
        value: businessData.email,
        href: `mailto:${businessData.email}`
      });
    }
    
    if (showAddress === "yes" && businessData?.address) {
      contactMethods.push({
        icon: MapPin,
        label: "Address",
        value: businessData.address,
        href: `https://maps.google.com/?q=${encodeURIComponent(businessData.address)}`
      });
    }
    
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{method.label}</p>
                          {method.href ? (
                            <a href={method.href} className="text-primary hover:underline">
                              {method.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{method.value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {showHours === "yes" && businessData?.hours && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Business Hours</h3>
                  <div className="space-y-2">
                    {Object.entries(businessData.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-muted-foreground">{hours || "Closed"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {showMap === "yes" && businessData?.address && (
              <div className="mt-8">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(businessData.address)}`}
                  className="w-full h-96 rounded-lg border"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  icon: Phone,
  category: "Contact"
};

// Team Section Block
export const TeamBlock: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Meet Our Team"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "The people behind our success"
    },
    members: {
      type: "array",
      label: "Team Members",
      defaultValue: [
        {
          name: "John Doe",
          role: "CEO & Founder",
          bio: "Leading our company with vision and passion.",
          image: "",
          socials: {}
        }
      ],
      itemType: {
        type: "text",
        label: "Team Member",
        defaultValue: "John Doe|CEO & Founder|Leading our company with vision.|"
      },
      maxItems: 12
    }
  },
  render: (props: Record<string, unknown>) => {
    const { title, subtitle, members = [] } = props as {
      title?: string;
      subtitle?: string;
      members?: TeamMemberConfig[]
    };
    
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {member.image ? (
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                      <Users className="w-12 h-12 text-primary" />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  {member.bio && (
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  },
  icon: Users,
  category: "Team"
};

// CTA Section Block
export const CTABlock: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Title",
      defaultValue: "Ready to Get Started?",
      required: true
    },
    description: {
      type: "textarea",
      label: "Description",
      defaultValue: "Join thousands of satisfied customers and transform your business today.",
      rows: 2
    },
    backgroundType: {
      type: "select",
      label: "Background Type",
      defaultValue: "gradient",
      options: [
        { value: "gradient", label: "Gradient" },
        { value: "solid", label: "Solid Color" },
        { value: "pattern", label: "Pattern" }
      ]
    },
    buttons: {
      type: "array",
      label: "Call to Action Buttons",
      defaultValue: [
        { text: "Get Started", link: "#contact", variant: "secondary" },
        { text: "Learn More", link: "#about", variant: "outline" }
      ],
      itemType: {
        type: "text",
        label: "Button",
        defaultValue: "Get Started|#contact|secondary"
      },
      maxItems: 3
    }
  },
  render: (props: Record<string, unknown>) => {
    const { title, description, backgroundType = "gradient", buttons = [] } = props as {
      title?: string;
      description?: string;
      backgroundType?: string;
      buttons?: ButtonConfig[]
    };
    
    const backgroundClasses = {
      gradient: "bg-gradient-to-r from-primary/20 to-primary/10",
      solid: "bg-primary/10",
      pattern: "bg-muted"
    };
    
    return (
      <div className={cn("py-20", backgroundClasses[backgroundType as keyof typeof backgroundClasses])}>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
            {description && (
              <p className="text-lg text-muted-foreground mb-8">{description}</p>
            )}
            {buttons.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant || "secondary"}
                    size="lg"
                    asChild
                  >
                    <a href={button.link || "#"}>{button.text}</a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  icon: Target,
  category: "CTA"
};

// Footer Section Block
export const FooterBlock: ComponentConfig = {
  fields: {
    columns: {
      type: "array",
      label: "Footer Columns",
      defaultValue: [
        {
          title: "Company",
          links: [
            { text: "About Us", url: "#about" },
            { text: "Services", url: "#services" },
            { text: "Contact", url: "#contact" }
          ]
        },
        {
          title: "Support",
          links: [
            { text: "FAQ", url: "#faq" },
            { text: "Help Center", url: "#help" },
            { text: "Terms", url: "#terms" }
          ]
        }
      ],
      itemType: {
        type: "text",
        label: "Column",
        defaultValue: "Company|About Us#about,Services#services,Contact#contact"
      },
      maxItems: 4
    },
    copyright: {
      type: "text",
      label: "Copyright Text",
      defaultValue: "© 2024 Your Business. All rights reserved."
    },
    showSocial: {
      type: "select",
      label: "Show Social Links",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props: Record<string, unknown>, _editMode, business) => {
    const { columns = [], copyright, showSocial } = props as {
      columns?: FooterColumnConfig[];
      copyright?: string;
      showSocial?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    return (
      <footer className="py-12 bg-muted/50 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Business Info Column */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{businessData?.name || "Business Name"}</h3>
              {businessData?.address && (
                <p className="text-sm text-muted-foreground mb-2">{businessData.address}</p>
              )}
              {businessData?.phone && (
                <p className="text-sm text-muted-foreground mb-2">
                  <a href={`tel:${businessData.phone}`} className="hover:text-primary">
                    {businessData.phone}
                  </a>
                </p>
              )}
              {businessData?.email && (
                <p className="text-sm text-muted-foreground">
                  <a href={`mailto:${businessData.email}`} className="hover:text-primary">
                    {businessData.email}
                  </a>
                </p>
              )}
            </div>
            
            {/* Custom Columns */}
            {columns.map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links?.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link.url} className="text-sm text-muted-foreground hover:text-primary">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {copyright}
            </p>
            {showSocial === "yes" && (
              <div className="flex gap-4">
                {/* Add social media icons here if business has social links */}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  },
  icon: Columns3,
  category: "Layout"
};