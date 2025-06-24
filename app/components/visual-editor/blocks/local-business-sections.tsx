import React from "react";
import { ComponentConfig } from "../types";
import { 
  Clock,
  MapPin,
  Calendar,
  Tag,
  HelpCircle,
  Map,
  Menu,
  Car,
  Star,
  MessageSquare
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import Image from "next/image";

// Type definitions for parsed data
interface ReviewData {
  author: string;
  rating: number;
  text: string;
  date: string;
}

// Header Section - Professional navigation header
export const HeaderSection: ComponentConfig = {
  fields: {
    logoText: {
      type: "text",
      label: "Business Name",
      defaultValue: "Your Business"
    },
    logoUrl: {
      type: "image",
      label: "Logo Image (optional)",
      defaultValue: ""
    },
    menuItems: {
      type: "array",
      label: "Menu Items",
      defaultValue: [
        "Home|#",
        "About|#about",
        "Services|#services", 
        "Gallery|#gallery",
        "Reviews|#reviews",
        "Contact|#contact"
      ],
      itemType: {
        type: "text",
        label: "Menu Item (Label|Link)",
        defaultValue: "Home|#"
      }
    },
    showCtaButton: {
      type: "select",
      label: "Show CTA Button",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    ctaButtonLabel: {
      type: "text",
      label: "CTA Button Text",
      defaultValue: "Call Now"
    },
    ctaButtonHref: {
      type: "text",
      label: "CTA Button Link",
      defaultValue: "tel:"
    }
  },
  render: (props: Record<string, unknown>, _editMode, _business) => {
    const logoText = (props.logoText as string) || "Your Business";
    const logoUrl = props.logoUrl as string;
    const menuItemsRaw = (props.menuItems as string[]) || [];
    const showCtaButton = props.showCtaButton === "yes";
    const ctaButtonLabel = (props.ctaButtonLabel as string) || "Call Now";
    const ctaButtonHref = (props.ctaButtonHref as string) || "tel:";
    
    // Parse menu items from "Label|Link" format
    const menuItems = menuItemsRaw.map(item => {
      const [label, href] = item.split('|');
      return { label: label || 'Menu Item', href: href || '#' };
    });

    // Simple static header without state for now
    return (
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              {logoUrl ? (
                <Image 
                  src={logoUrl} 
                  alt={logoText} 
                  width={32} 
                  height={32} 
                  className="h-8 w-auto" 
                />
              ) : (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-bold text-sm mr-2">
                    {logoText.charAt(0)}
                  </div>
                  <span className="font-bold text-lg text-foreground">{logoText}</span>
                </div>
              )}
            </div>

            {/* Desktop Menu */}
            <nav className="hidden @md:flex items-center gap-6">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
              {showCtaButton && (
                <Button size="sm" className="ml-4" asChild>
                  <a href={ctaButtonHref}>
                    {ctaButtonLabel}
                  </a>
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button - simplified for now */}
            <div className="@md:hidden">
              {showCtaButton && (
                <Button size="sm" asChild>
                  <a href={ctaButtonHref}>
                    {ctaButtonLabel}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  },
  category: "sections"
};

// Operating Hours Section - Full schedule with holidays
export const OperatingHoursSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Business Hours"
    },
    showSpecialHours: {
      type: "select",
      label: "Show Special Hours",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    specialHours: {
      type: "array",
      label: "Special Hours",
      defaultValue: [
        { date: "December 25", hours: "Closed - Christmas" },
        { date: "January 1", hours: "10:00 AM - 4:00 PM" }
      ],
      itemType: {
        type: "text",
        label: "Special Day",
        defaultValue: "December 25|Closed - Christmas"
      },
      maxItems: 10
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "card",
      options: [
        { value: "card", label: "Card" },
        { value: "simple", label: "Simple" },
        { value: "split", label: "Split View" }
      ]
    }
  },
  render: (props, _editMode, business) => {
    const { title, showSpecialHours, specialHours = [], layout } = props as {
      title?: string;
      showSpecialHours?: string;
      specialHours?: Array<{ date: string; hours: string } | string>;
      layout?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    
    // Parse special hours
    const specialHoursData = specialHours.map(sh => {
      if (typeof sh === 'string') {
        const [date, hours] = sh.split('|');
        return { date, hours };
      }
      return sh;
    });
    
    // Parse hours from array format to object format
    const parseHoursArray = (hoursArray?: string[]) => {
      if (!hoursArray || !Array.isArray(hoursArray)) return {};
      const hoursObj: Record<string, string> = {};
      hoursArray.forEach(hourStr => {
        const dayMatch = hourStr.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*(.+)$/i);
        if (dayMatch) {
          const day = dayMatch[1].toLowerCase();
          const hours = dayMatch[2];
          hoursObj[day] = hours;
        }
      });
      return hoursObj;
    };
    
    const hoursObj = parseHoursArray(businessData?.hours);
    
    const isOpen = () => {
      const currentHours = hoursObj[today];
      return currentHours && currentHours.toLowerCase() !== 'closed';
    };
    
    if (layout === 'simple') {
      return (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">{title || "Business Hours"}</h2>
            <div className="max-w-2xl">
              <div className="space-y-3">
                {days.map(day => (
                  <div 
                    key={day}
                    className={cn(
                      "flex justify-between py-3 border-b",
                      day === today && "font-medium text-primary"
                    )}
                  >
                    <span className="capitalize">{day}</span>
                    <span>{hoursObj[day] || 'Closed'}</span>
                  </div>
                ))}
              </div>
              
              {showSpecialHours === 'yes' && specialHoursData.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Special Hours</h3>
                  <div className="space-y-2">
                    {specialHoursData.map((sh, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{sh.date}</span>
                        <span className="font-medium">{sh.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    if (layout === 'split') {
      return (
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">{title || "Business Hours"}</h2>
            <div className="grid @md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Regular Hours
                </h3>
                <div className="space-y-2">
                  {days.map(day => (
                    <div 
                      key={day}
                      className={cn(
                        "flex justify-between py-2",
                        day === today && "bg-primary/10 px-3 rounded font-medium"
                      )}
                    >
                      <span className="capitalize">{day}</span>
                      <span>{hoursObj[day] || 'Closed'}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium",
                    isOpen() 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isOpen() ? "bg-green-600" : "bg-red-600"
                    )} />
                    {isOpen() ? 'Open Now' : 'Closed'}
                  </div>
                </div>
                
                {showSpecialHours === 'yes' && specialHoursData.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Special Hours
                    </h3>
                    <div className="space-y-2">
                      {specialHoursData.map((sh, index) => (
                        <div key={index} className="bg-background p-3 rounded-lg">
                          <div className="font-medium">{sh.date}</div>
                          <div className="text-sm text-muted-foreground">{sh.hours}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Card layout (default)
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{title || "Business Hours"}</span>
                  <div className={cn(
                    "text-sm px-3 py-1 rounded-full font-medium",
                    isOpen() 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  )}>
                    {isOpen() ? 'Open Now' : 'Closed'}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid @md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Regular Hours</h4>
                    <div className="space-y-2">
                      {days.map(day => (
                        <div 
                          key={day}
                          className={cn(
                            "flex justify-between py-1",
                            day === today && "font-medium text-primary"
                          )}
                        >
                          <span className="capitalize">{day}</span>
                          <span>{hoursObj[day] || 'Closed'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {showSpecialHours === 'yes' && specialHoursData.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-4">Special Hours</h4>
                      <div className="space-y-3">
                        {specialHoursData.map((sh, index) => (
                          <div key={index} className="bg-muted p-3 rounded">
                            <div className="font-medium text-sm">{sh.date}</div>
                            <div className="text-sm text-muted-foreground">{sh.hours}</div>
                          </div>
                        ))}
                      </div>
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
  icon: Clock,
  category: "Section"
};

// Location/Directions Section
export const LocationDirectionsSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Find Us"
    },
    showMap: {
      type: "select",
      label: "Show Map",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showDirections: {
      type: "select",
      label: "Show Get Directions Button",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    parkingInfo: {
      type: "textarea",
      label: "Parking Information",
      defaultValue: "Free parking available in lot behind building",
      rows: 2
    },
    landmarks: {
      type: "array",
      label: "Nearby Landmarks",
      defaultValue: [
        "Next to Starbucks",
        "Across from City Hall"
      ],
      itemType: {
        type: "text",
        label: "Landmark"
      },
      maxItems: 5
    }
  },
  render: (props, editMode, business) => {
    const { title, showMap, showDirections, parkingInfo, landmarks = [] } = props as {
      title?: string;
      showMap?: string;
      showDirections?: string;
      parkingInfo?: string;
      landmarks?: string[];
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title || "Find Us"}</h2>
          
          <div className="grid @lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {showMap === "yes" && businessData?.address && (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(businessData.address)}`}
                  className="w-full h-96"
                  allowFullScreen
                />
              </div>
            )}
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Address</h3>
                        <p className="text-muted-foreground">
                          {businessData?.address || "Address not available"}
                        </p>
                        {showDirections === "yes" && businessData?.address && (
                          <Button 
                            size="sm" 
                            className="mt-2" 
                            asChild={!editMode}
                            onClick={editMode ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
                          >
                            {!editMode ? (
                              <a 
                                href={`https://maps.google.com/?q=${encodeURIComponent(businessData.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Get Directions
                              </a>
                            ) : (
                              <span>Get Directions</span>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {parkingInfo && (
                      <div className="flex items-start gap-3">
                        <Car className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1">Parking</h3>
                          <p className="text-muted-foreground">{parkingInfo}</p>
                        </div>
                      </div>
                    )}
                    
                    {landmarks.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Map className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1">Nearby Landmarks</h3>
                          <ul className="text-muted-foreground space-y-1">
                            {landmarks.map((landmark, index) => (
                              <li key={index}>• {landmark}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  },
  icon: MapPin,
  category: "Section"
};

// Menu/Price List Section
export const MenuPriceListSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Our Menu"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: ""
    },
    categories: {
      type: "array",
      label: "Categories",
      defaultValue: [
        {
          name: "Main Dishes",
          items: [
            { name: "Grilled Salmon", description: "Fresh Atlantic salmon", price: "$24.99" },
            { name: "Chicken Parmesan", description: "Classic Italian dish", price: "$18.99" }
          ]
        }
      ],
      itemType: {
        type: "text",
        label: "Category"
      },
      maxItems: 10
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "columns",
      options: [
        { value: "columns", label: "Columns" },
        { value: "tabs", label: "Tabs" },
        { value: "accordion", label: "Accordion" }
      ]
    },
    showDescriptions: {
      type: "select",
      label: "Show Descriptions",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props) => {
    const { title, subtitle, categories = [], layout, showDescriptions } = props as {
      title?: string;
      subtitle?: string;
      categories?: Array<string | Record<string, unknown>>;
      layout?: string;
      showDescriptions?: string;
    };
    
    // Parse categories - handle both structured and string formats
    interface MenuItem {
      name: string;
      description?: string;
      price: string;
    }
    
    interface Category {
      name: string;
      items?: MenuItem[];
    }
    
    const categoryData: Category[] = categories.map(cat => {
      if (typeof cat === 'string') {
        // Format: "Category Name|Item1:Desc1:$10,Item2:Desc2:$15"
        const [name, ...itemStrings] = cat.split('|');
        const items = itemStrings.join('|').split(',').map(itemStr => {
          const [itemName, description, price] = itemStr.split(':');
          return { name: itemName, description, price };
        });
        return { name, items };
      }
      return cat as unknown as Category;
    });
    
    if (layout === 'tabs') {
      return (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
            </div>
            
            {/* Tabs would go here - simplified for this example */}
            <div className="max-w-4xl mx-auto">
              {categoryData.map((category, catIndex) => (
                <div key={catIndex} className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4">{category.name}</h3>
                  <div className="space-y-4">
                    {category.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          {showDescriptions === 'yes' && item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <span className="font-semibold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (layout === 'accordion') {
      return (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {categoryData.map((category, catIndex) => (
                  <AccordionItem key={catIndex} value={`category-${catIndex}`}>
                    <AccordionTrigger className="text-lg">{category.name}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        {category.items?.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              {showDescriptions === 'yes' && item.description && (
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                            <span className="font-semibold text-primary">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      );
    }
    
    // Columns layout (default)
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
          
          <div className="grid @md:grid-cols-2 @lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categoryData.map((category, catIndex) => (
              <Card key={catIndex}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium">{item.name}</h4>
                          <span className="font-semibold text-primary whitespace-nowrap">{item.price}</span>
                        </div>
                        {showDescriptions === 'yes' && item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  },
  icon: Menu,
  category: "Section"
};

// Special Offers Section
export const SpecialOffersSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Special Offers"
    },
    offers: {
      type: "array",
      label: "Offers",
      defaultValue: [
        {
          title: "Happy Hour",
          description: "50% off all appetizers",
          validUntil: "Every day 3-6 PM",
          code: ""
        }
      ],
      itemType: {
        type: "text",
        label: "Offer",
        defaultValue: "Happy Hour|50% off appetizers|Every day 3-6 PM|"
      },
      maxItems: 6
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "grid",
      options: [
        { value: "grid", label: "Grid" },
        { value: "banner", label: "Banner" },
        { value: "carousel", label: "Carousel" }
      ]
    }
  },
  render: (props) => {
    const { title, offers = [], layout } = props as {
      title?: string;
      offers?: Array<string | Record<string, unknown>>;
      layout?: string;
    };
    
    // Parse offers
    interface Offer {
      title: string;
      description: string;
      validUntil: string;
      code?: string;
    }
    
    const offerData: Offer[] = offers.map(offer => {
      if (typeof offer === 'string') {
        const [offerTitle, description, validUntil, code] = offer.split('|');
        return { title: offerTitle, description, validUntil, code };
      }
      return offer as unknown as Offer;
    });
    
    if (layout === 'banner') {
      return (
        <div className="py-16 bg-primary/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {offerData.map((offer, index) => (
                <div key={index} className="bg-background rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                      <p className="text-muted-foreground mb-2">{offer.description}</p>
                      <p className="text-sm font-medium">{offer.validUntil}</p>
                    </div>
                    {offer.code && (
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-mono font-semibold">
                        {offer.code}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Grid layout (default)
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          <div className="grid @md:grid-cols-2 @lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {offerData.map((offer, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Special
                </div>
                <CardHeader>
                  <CardTitle>{offer.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{offer.validUntil}</p>
                    {offer.code && (
                      <div className="bg-muted text-center py-2 px-3 rounded font-mono font-semibold">
                        {offer.code}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  },
  icon: Tag,
  category: "Section"
};

// FAQ Section
export const FAQSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Frequently Asked Questions"
    },
    faqs: {
      type: "array",
      label: "FAQs",
      defaultValue: [
        {
          question: "What are your payment options?",
          answer: "We accept cash, all major credit cards, and mobile payments."
        },
        {
          question: "Do you offer delivery?",
          answer: "Yes, we offer delivery within a 5-mile radius through our partners."
        }
      ],
      itemType: {
        type: "text",
        label: "FAQ",
        defaultValue: "Question here?|Answer here."
      },
      maxItems: 20
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "accordion",
      options: [
        { value: "accordion", label: "Accordion" },
        { value: "cards", label: "Cards" },
        { value: "simple", label: "Simple List" }
      ]
    }
  },
  render: (props) => {
    const { title, faqs = [], layout } = props as {
      title?: string;
      faqs?: Array<string | Record<string, unknown>>;
      layout?: string;
    };
    
    // Parse FAQs
    interface FAQ {
      question: string;
      answer: string;
    }
    
    const faqData: FAQ[] = faqs.map(faq => {
      if (typeof faq === 'string') {
        const [question, answer] = faq.split('|');
        return { question, answer };
      }
      return faq as unknown as FAQ;
    });
    
    if (layout === 'cards') {
      return (
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
            <div className="grid @md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqData.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-2">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (layout === 'simple') {
      return (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="border-b pb-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Accordion layout (default)
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    );
  },
  icon: HelpCircle,
  category: "Section"
};

// Google Reviews Section
export const GoogleReviewsSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "What Our Customers Say"
    },
    showRating: {
      type: "select",
      label: "Show Overall Rating",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    reviewSource: {
      type: "select",
      label: "Review Source",
      defaultValue: "mixed",
      options: [
        { value: "google", label: "Google Reviews Only" },
        { value: "ai", label: "AI Generated Only" },
        { value: "mixed", label: "Mixed (Google + AI)" },
        { value: "custom", label: "Custom Reviews" }
      ]
    },
    layout: {
      type: "select",
      label: "Layout Style",
      defaultValue: "grid",
      options: [
        { value: "grid", label: "Grid" },
        { value: "carousel", label: "Carousel" },
        { value: "featured", label: "Featured + List" },
        { value: "masonry", label: "Masonry" }
      ]
    },
    reviewsPerRow: {
      type: "select",
      label: "Reviews Per Row",
      defaultValue: "3",
      options: [
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" }
      ]
    },
    maxReviews: {
      type: "number",
      label: "Maximum Reviews to Show",
      defaultValue: 6,
      min: 1,
      max: 20
    },
    rating: {
      type: "number",
      label: "Average Rating Override",
      defaultValue: 4.8,
      min: 0,
      max: 5,
      step: 0.1,
      showSlider: true
    },
    totalReviews: {
      type: "number",
      label: "Total Reviews Override",
      defaultValue: 127,
      min: 0,
      max: 9999
    },
    reviews: {
      type: "array",
      label: "Custom Reviews",
      defaultValue: [
        {
          author: "John D.",
          rating: 5,
          text: "Excellent service! Highly recommend to everyone.",
          date: "2 weeks ago"
        },
        {
          author: "Sarah M.",
          rating: 5,
          text: "Professional and friendly staff. Will definitely come back!",
          date: "1 month ago"
        },
        {
          author: "Mike R.",
          rating: 4,
          text: "Great experience overall. Very satisfied with the results.",
          date: "1 month ago"
        }
      ],
      itemType: {
        type: "text",
        label: "Review",
        defaultValue: "John D.|5|Great service!|2 weeks ago"
      },
      maxItems: 20
    },
    googleBusinessUrl: {
      type: "text",
      label: "Google Business Profile URL",
      defaultValue: "",
      placeholder: "https://g.page/your-business"
    },
    showDate: {
      type: "select",
      label: "Show Review Dates",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showAuthorImage: {
      type: "select",
      label: "Show Author Images",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props, editMode, business) => {
    const { 
      title, 
      showRating, 
      reviewSource,
      layout = "grid",
      reviewsPerRow = "3",
      maxReviews = 6,
      rating, 
      totalReviews, 
      reviews = [], 
      googleBusinessUrl,
      showDate = "yes",
      showAuthorImage = "no"
    } = props as {
      title?: string;
      showRating?: string;
      reviewSource?: string;
      layout?: string;
      reviewsPerRow?: string;
      maxReviews?: number;
      rating?: number;
      totalReviews?: number;
      reviews?: Array<string | Record<string, unknown>>;
      googleBusinessUrl?: string;
      showDate?: string;
      showAuthorImage?: string;
    };
    
    const businessData = business as Doc<"businesses"> | undefined;
    
    // Gather reviews based on source
    let displayReviews: ReviewData[] = [];
    let actualRating = rating || 4.8;
    let actualTotalReviews = totalReviews || 0;
    
    // Get Google reviews from business data
    const googleReviews: ReviewData[] = businessData?.reviews?.map(r => {
      const rAsRecord = r as Record<string, unknown>;
      
      // Use the actual review text field based on the data structure
      // Try multiple possible field names for the review text
      const reviewText = rAsRecord.textValue || 
                        rAsRecord.review_text || 
                        rAsRecord.content || 
                        rAsRecord.description || 
                        r.text || 
                        'No review text found';
      
      return {
        author: String(r.reviewer || 'Anonymous'),
        rating: parseInt(String(r.rating)) || 5,
        text: String(reviewText),
        date: "Google Review"
      };
    }) || [];
    
    // Get AI generated testimonials
    const aiTestimonials: ReviewData[] = businessData?.aiGeneratedContent?.testimonials?.items?.map(t => ({
      author: t.name,
      rating: t.rating,
      text: t.text,
      date: t.date || t.location || "Verified Customer"
    })) || [];
    
    // Parse custom reviews
    const customReviews: ReviewData[] = reviews.map(review => {
      if (typeof review === 'string') {
        const [author, reviewRating, text, date] = review.split('|');
        return { 
          author: author || '', 
          rating: parseInt(reviewRating || '5'), 
          text: text || '', 
          date: date || '' 
        };
      }
      
      const obj = review as Record<string, unknown>;
      
      // Try multiple possible field names for custom review text, similar to Google reviews
      const reviewText = obj.textValue || 
                        obj.text || 
                        obj.content || 
                        obj.description || 
                        obj.review_text || 
                        'No custom review text found';
      
      return {
        author: String(obj.author || obj.reviewer || ''),
        rating: Number(obj.rating || 5),
        text: String(reviewText),
        date: String(obj.date || '')
      };
    });
    
    // Select reviews based on source
    switch (reviewSource) {
      case "google":
        displayReviews = googleReviews;
        actualRating = businessData?.rating || rating || 4.8;
        actualTotalReviews = googleReviews.length || totalReviews || 0;
        break;
      case "ai":
        displayReviews = aiTestimonials;
        break;
      case "mixed":
        // Interleave Google and AI reviews
        // const maxEach = Math.ceil(maxReviews / 2);
        displayReviews = [];
        for (let i = 0; i < Math.max(googleReviews.length, aiTestimonials.length); i++) {
          if (i < googleReviews.length && displayReviews.length < maxReviews) {
            displayReviews.push(googleReviews[i]);
          }
          if (i < aiTestimonials.length && displayReviews.length < maxReviews) {
            displayReviews.push(aiTestimonials[i]);
          }
        }
        actualRating = businessData?.rating || rating || 4.8;
        actualTotalReviews = (googleReviews.length + aiTestimonials.length) || totalReviews || 0;
        break;
      case "custom":
      default:
        displayReviews = customReviews;
        break;
    }
    
    // Limit to maxReviews
    displayReviews = displayReviews.slice(0, maxReviews);
    
    const renderStars = (starRating: number) => {
      return (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < starRating 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
      );
    };
    
    // Render based on layout
    const gridColsClass = reviewsPerRow === "2" ? "@md:grid-cols-2" : 
                         reviewsPerRow === "4" ? "@md:grid-cols-2 @lg:grid-cols-4" : 
                         "@md:grid-cols-2 @lg:grid-cols-3";
    
    if (layout === "featured" && displayReviews.length > 0) {
      const featuredReview = displayReviews[0];
      const otherReviews = displayReviews.slice(1);
      
      return (
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {showRating === 'yes' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-8 h-8",
                            i < Math.floor(actualRating) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-3xl font-bold">{actualRating.toFixed(1)}</span>
                  </div>
                  <p className="text-muted-foreground">
                    Based on {actualTotalReviews} Reviews
                  </p>
                </div>
              )}
            </div>
            
            {/* Featured Review */}
            <div className="max-w-4xl mx-auto mb-12">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {showAuthorImage === "yes" && (
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-semibold text-primary">
                            {featuredReview.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-lg">{featuredReview.author}</p>
                        {showDate === "yes" && (
                          <p className="text-sm text-muted-foreground">{featuredReview.date}</p>
                        )}
                      </div>
                    </div>
                    {renderStars(featuredReview.rating)}
                  </div>
                  <p className="text-lg leading-relaxed">
                    {typeof featuredReview.text === 'string' ? featuredReview.text : String(featuredReview.text || 'No review text')}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Other Reviews */}
            {otherReviews.length > 0 && (
              <div className={cn("grid gap-6 max-w-6xl mx-auto", gridColsClass)}>
                {otherReviews.map((review, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold">{review.author}</p>
                          {showDate === "yes" && (
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          )}
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-muted-foreground line-clamp-3">
                        {typeof review.text === 'string' ? review.text : String(review.text || 'No review text')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Default grid layout
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            
            {showRating === 'yes' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-8 h-8",
                          i < Math.floor(actualRating) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-3xl font-bold">{actualRating.toFixed(1)}</span>
                </div>
                <p className="text-muted-foreground">
                  Based on {actualTotalReviews} Reviews
                </p>
                {reviewSource === "google" && (
                  <div className="flex items-center gap-2 text-sm">
                    <Image
                      src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_74x24dp.png"
                      alt="Google"
                      width={74}
                      height={24}
                    />
                    <span className="font-medium">Reviews</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={cn("grid gap-6 max-w-6xl mx-auto", gridColsClass)}>
            {displayReviews.map((review, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {showAuthorImage === "yes" && (
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                            <span className="text-sm font-semibold text-primary">
                              {review.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          {showDate === "yes" && (
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {typeof review.text === 'string' ? review.text : String(review.text || 'No review text')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {googleBusinessUrl && (
            <div className="text-center mt-8">
              <Button 
                asChild={!editMode}
                onClick={editMode ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
              >
                {!editMode ? (
                  <a href={googleBusinessUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Read All Reviews on Google
                  </a>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Read All Reviews on Google
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
  icon: Star,
  category: "Section"
};

// Before/After Gallery Section
export const BeforeAfterSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Our Work"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "See the transformation we deliver"
    },
    items: {
      type: "array",
      label: "Before/After Items",
      defaultValue: [
        {
          title: "Kitchen Renovation",
          description: "Complete kitchen transformation",
          beforeImage: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
          afterImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"
        },
        {
          title: "Bathroom Remodel",
          description: "Modern bathroom upgrade",
          beforeImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
          afterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
        }
      ],
      itemType: {
        type: "text",
        label: "Before/After Item",
        defaultValue: "Project Title|Description|before-image-url|after-image-url"
      },
      maxItems: 10
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "slider",
      options: [
        { value: "slider", label: "Slider Comparison" },
        { value: "side-by-side", label: "Side by Side" },
        { value: "grid", label: "Grid Layout" }
      ]
    },
    showLabels: {
      type: "select",
      label: "Show Before/After Labels",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props, _editMode, _business) => {
    const { title, subtitle, items = [], layout, showLabels } = props as {
      title?: string;
      subtitle?: string;
      items?: Array<string | Record<string, unknown>>;
      layout?: string;
      showLabels?: string;
    };
    
    // Parse items
    interface BeforeAfterItem {
      title: string;
      description: string;
      beforeImage: string;
      afterImage: string;
    }
    
    const beforeAfterData: BeforeAfterItem[] = items.map(item => {
      if (typeof item === 'string') {
        const [title, description, beforeImage, afterImage] = item.split('|');
        return { title, description, beforeImage, afterImage };
      }
      return item as unknown as BeforeAfterItem;
    });
    
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
          
          {layout === "grid" ? (
            <div className="grid @md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {beforeAfterData.map((item, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      {showLabels === "yes" && (
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                          Before
                        </div>
                      )}
                      <Image
                        src={item.beforeImage}
                        alt={`${item.title} - Before`}
                        width={400}
                        height={300}
                        className="rounded-lg w-full h-64 object-cover"
                      />
                    </div>
                    <div className="relative">
                      {showLabels === "yes" && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium">
                          After
                        </div>
                      )}
                      <Image
                        src={item.afterImage}
                        alt={`${item.title} - After`}
                        width={400}
                        height={300}
                        className="rounded-lg w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Side by side layout (default)
            <div className="space-y-12 max-w-6xl mx-auto">
              {beforeAfterData.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    {item.description && (
                      <p className="text-muted-foreground">{item.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid @md:grid-cols-2">
                      <div className="relative">
                        {showLabels === "yes" && (
                          <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded font-medium z-10">
                            Before
                          </div>
                        )}
                        <Image
                          src={item.beforeImage}
                          alt={`${item.title} - Before`}
                          width={600}
                          height={400}
                          className="w-full h-80 object-cover"
                        />
                      </div>
                      <div className="relative">
                        {showLabels === "yes" && (
                          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded font-medium z-10">
                            After
                          </div>
                        )}
                        <Image
                          src={item.afterImage}
                          alt={`${item.title} - After`}
                          width={600}
                          height={400}
                          className="w-full h-80 object-cover"
                        />
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
  },
  icon: ImageIcon,
  category: "Section"
};

// Process Timeline Section
export const ProcessTimelineSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "How We Work"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "Our proven process delivers results"
    },
    steps: {
      type: "array",
      label: "Process Steps",
      defaultValue: [
        {
          number: "01",
          title: "Initial Consultation",
          description: "We meet to understand your needs and vision",
          icon: "chat"
        },
        {
          number: "02",
          title: "Planning & Design",
          description: "Create detailed plans and get your approval",
          icon: "planning"
        },
        {
          number: "03",
          title: "Implementation",
          description: "Execute the project with precision and care",
          icon: "tools"
        },
        {
          number: "04",
          title: "Final Review",
          description: "Ensure everything meets your expectations",
          icon: "check"
        }
      ],
      itemType: {
        type: "text",
        label: "Process Step",
        defaultValue: "01|Step Title|Step description|icon"
      },
      maxItems: 8
    },
    layout: {
      type: "select",
      label: "Layout Style",
      defaultValue: "timeline",
      options: [
        { value: "timeline", label: "Timeline" },
        { value: "cards", label: "Cards" },
        { value: "vertical", label: "Vertical List" }
      ]
    },
    showConnectors: {
      type: "select",
      label: "Show Connectors",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props) => {
    const { title, subtitle, steps = [], layout, showConnectors } = props as {
      title?: string;
      subtitle?: string;
      steps?: Array<string | Record<string, unknown>>;
      layout?: string;
      showConnectors?: string;
    };
    
    // Parse steps
    interface ProcessStep {
      number: string;
      title: string;
      description: string;
      icon?: string;
    }
    
    const processSteps: ProcessStep[] = steps.map(step => {
      if (typeof step === 'string') {
        const [number, title, description, icon] = step.split('|');
        return { number, title, description, icon };
      }
      return step as unknown as ProcessStep;
    });
    
    if (layout === "cards") {
      return (
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
            </div>
            
            <div className="grid @md:grid-cols-2 @lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  {showConnectors === "yes" && index < processSteps.length - 1 && (
                    <div className="hidden @lg:block absolute top-1/3 left-full w-full h-0.5 bg-border -z-10" />
                  )}
                  <Card className="relative h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="text-4xl font-bold text-primary mb-2">{step.number}</div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (layout === "vertical") {
      return (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
            </div>
            
            <div className="max-w-3xl mx-auto">
              {processSteps.map((step, index) => (
                <div key={index} className="flex gap-8 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                      {step.number}
                    </div>
                    {showConnectors === "yes" && index < processSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-4" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Timeline layout (default)
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {showConnectors === "yes" && (
                <div className="absolute top-16 left-0 right-0 h-0.5 bg-border hidden @md:block" />
              )}
              
              <div className="grid @md:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="relative text-center">
                    <div className="relative inline-flex">
                      <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-primary">{step.number}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  icon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  category: "Section"
};

// Stats Counter Section
export const StatsCounterSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "By The Numbers"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "Our achievements speak for themselves"
    },
    stats: {
      type: "array",
      label: "Statistics",
      defaultValue: [
        {
          number: "500+",
          label: "Happy Customers",
          suffix: "",
          icon: "users"
        },
        {
          number: "10",
          label: "Years Experience",
          suffix: "+",
          icon: "calendar"
        },
        {
          number: "98",
          label: "Customer Satisfaction",
          suffix: "%",
          icon: "star"
        },
        {
          number: "24/7",
          label: "Support Available",
          suffix: "",
          icon: "support"
        }
      ],
      itemType: {
        type: "text",
        label: "Statistic",
        defaultValue: "100|Label|+|icon"
      },
      maxItems: 6
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "grid",
      options: [
        { value: "grid", label: "Grid" },
        { value: "inline", label: "Inline" },
        { value: "stacked", label: "Stacked" }
      ]
    },
    showIcons: {
      type: "select",
      label: "Show Icons",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    backgroundColor: {
      type: "select",
      label: "Background Style",
      defaultValue: "primary",
      options: [
        { value: "primary", label: "Primary Color" },
        { value: "muted", label: "Muted" },
        { value: "default", label: "Default" }
      ]
    }
  },
  render: (props) => {
    const { title, subtitle, stats = [], layout, showIcons, backgroundColor } = props as {
      title?: string;
      subtitle?: string;
      stats?: Array<string | Record<string, unknown>>;
      layout?: string;
      showIcons?: string;
      backgroundColor?: string;
    };
    
    // Parse stats
    interface Stat {
      number: string;
      label: string;
      suffix?: string;
      icon?: string;
    }
    
    const statsData: Stat[] = stats.map(stat => {
      if (typeof stat === 'string') {
        const [number, label, suffix, icon] = stat.split('|');
        return { number, label, suffix: suffix || '', icon };
      }
      return stat as unknown as Stat;
    });
    
    const bgClass = backgroundColor === "primary" ? "bg-primary text-primary-foreground" :
                   backgroundColor === "muted" ? "bg-muted" : "";
    
    const textColorClass = backgroundColor === "primary" ? "text-primary-foreground" : "";
    
    return (
      <div className={cn("py-16", bgClass)}>
        <div className="container mx-auto px-4">
          {(title || subtitle) && (
            <div className="text-center mb-12">
              {title && <h2 className={cn("text-3xl font-bold mb-4", textColorClass)}>{title}</h2>}
              {subtitle && <p className={cn("text-lg", backgroundColor === "primary" ? "text-primary-foreground/90" : "text-muted-foreground")}>{subtitle}</p>}
            </div>
          )}
          
          {layout === "inline" ? (
            <div className="flex flex-wrap justify-center gap-8 @md:gap-16 max-w-5xl mx-auto">
              {statsData.map((stat, index) => (
                <div key={index} className="text-center">
                  {showIcons === "yes" && stat.icon && (
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto", 
                      backgroundColor === "primary" ? "bg-primary-foreground/20" : "bg-primary/10"
                    )}>
                      <Users className={cn("w-6 h-6", backgroundColor === "primary" ? "text-primary-foreground" : "text-primary")} />
                    </div>
                  )}
                  <div className={cn("text-4xl font-bold mb-1", textColorClass)}>
                    {stat.number}{stat.suffix}
                  </div>
                  <div className={cn("text-sm font-medium", 
                    backgroundColor === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          ) : layout === "stacked" ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {statsData.map((stat, index) => (
                <div key={index} className={cn(
                  "flex items-center justify-between p-6 rounded-lg",
                  backgroundColor === "primary" ? "bg-primary-foreground/10" : "bg-background border"
                )}>
                  <div className="flex items-center gap-4">
                    {showIcons === "yes" && stat.icon && (
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center",
                        backgroundColor === "primary" ? "bg-primary-foreground/20" : "bg-primary/10"
                      )}>
                        <Users className={cn("w-6 h-6", backgroundColor === "primary" ? "text-primary-foreground" : "text-primary")} />
                      </div>
                    )}
                    <div className={cn("font-medium", textColorClass)}>{stat.label}</div>
                  </div>
                  <div className={cn("text-3xl font-bold", textColorClass)}>
                    {stat.number}{stat.suffix}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Grid layout (default)
            <div className={cn(
              "grid gap-8 max-w-5xl mx-auto",
              statsData.length === 3 ? "@md:grid-cols-3" : "@md:grid-cols-2 @lg:grid-cols-4"
            )}>
              {statsData.map((stat, index) => (
                <div key={index} className="text-center">
                  {showIcons === "yes" && stat.icon && (
                    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto",
                      backgroundColor === "primary" ? "bg-primary-foreground/20" : "bg-primary/10"
                    )}>
                      <Users className={cn("w-8 h-8", backgroundColor === "primary" ? "text-primary-foreground" : "text-primary")} />
                    </div>
                  )}
                  <div className={cn("text-5xl font-bold mb-2", textColorClass)}>
                    {stat.number}{stat.suffix}
                  </div>
                  <div className={cn("text-lg font-medium",
                    backgroundColor === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
  icon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  category: "Section"
};

// Team Section - Professional staff profiles
export const TeamSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Meet Our Team"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "Experienced professionals dedicated to your success"
    },
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "grid",
      options: [
        { value: "grid", label: "Grid" },
        { value: "carousel", label: "Carousel" },
        { value: "featured", label: "Featured + Grid" }
      ]
    },
    showSocial: {
      type: "select",
      label: "Show Social Links",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    teamSize: {
      type: "select",
      label: "Columns per Row",
      defaultValue: "3",
      options: [
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" }
      ]
    }
  },
  render: (props, editMode, business) => {
    const { title, subtitle, showSocial, teamSize = "3" } = props as {
      title?: string;
      subtitle?: string;
      showSocial?: string;
      teamSize?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    // Get team data from AI generated content or use defaults
    const teamData = businessData?.aiGeneratedContent?.team?.members || [
      {
        name: "John Smith",
        role: "Founder & CEO",
        bio: "With over 20 years of experience in the industry, John leads our team with passion and expertise.",
        expertise: ["Leadership", "Strategy", "Customer Relations"]
      },
      {
        name: "Sarah Johnson",
        role: "Operations Manager",
        bio: "Sarah ensures smooth operations and exceptional service delivery for all our clients.",
        expertise: ["Operations", "Quality Control", "Team Management"]
      },
      {
        name: "Michael Chen",
        role: "Lead Specialist",
        bio: "Michael brings technical excellence and innovation to every project he handles.",
        expertise: ["Technical Skills", "Problem Solving", "Innovation"]
      }
    ];
    
    const gridCols = teamSize === "2" ? "@md:grid-cols-2" : 
                    teamSize === "4" ? "@md:grid-cols-2 @lg:grid-cols-4" : 
                    "@md:grid-cols-2 @lg:grid-cols-3";
    
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
          </div>
          
          <div className={cn("grid gap-8 max-w-6xl mx-auto", gridCols)}>
            {teamData.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground mb-4">{member.bio}</p>
                  
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {showSocial === "yes" && (
                    <div className="flex gap-3 mt-4 pt-4 border-t">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
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
  category: "Section"
};

// Features Grid Section - Professional feature showcase
export const FeaturesSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Why Choose Us"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "Key advantages that set us apart"
    },
    layout: {
      type: "select",
      label: "Layout Style",
      defaultValue: "grid",
      options: [
        { value: "grid", label: "Grid with Icons" },
        { value: "alternating", label: "Alternating Rows" },
        { value: "centered", label: "Centered Cards" }
      ]
    },
    iconStyle: {
      type: "select",
      label: "Icon Style",
      defaultValue: "circle",
      options: [
        { value: "circle", label: "Circle Background" },
        { value: "square", label: "Square Background" },
        { value: "none", label: "No Background" }
      ]
    },
    columns: {
      type: "select",
      label: "Columns",
      defaultValue: "3",
      options: [
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
        { value: "4", label: "4 Columns" }
      ]
    }
  },
  render: (props, editMode, business) => {
    const { title, subtitle, layout, iconStyle, columns = "3" } = props as {
      title?: string;
      subtitle?: string;
      layout?: string;
      iconStyle?: string;
      columns?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    // Get features from AI generated content or use defaults
    const features = businessData?.aiGeneratedContent?.features?.items || [
      {
        title: "Expert Team",
        description: "Our skilled professionals bring years of experience to every project.",
        icon: "users"
      },
      {
        title: "Quality Service",
        description: "We maintain the highest standards in everything we do.",
        icon: "star"
      },
      {
        title: "Fast Response",
        description: "Quick turnaround times without compromising on quality.",
        icon: "zap"
      },
      {
        title: "Best Value",
        description: "Competitive pricing with exceptional service delivery.",
        icon: "award"
      },
      {
        title: "24/7 Support",
        description: "Always available when you need us most.",
        icon: "clock"
      },
      {
        title: "Guaranteed Results",
        description: "Your satisfaction is our top priority.",
        icon: "shield"
      }
    ];
    
    const gridCols = columns === "2" ? "@md:grid-cols-2" :
                    columns === "4" ? "@md:grid-cols-2 @lg:grid-cols-4" :
                    "@md:grid-cols-2 @lg:grid-cols-3";
    
    const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
      users: Users,
      star: Star,
      zap: Zap,
      award: Award,
      clock: Clock,
      shield: Shield,
      heart: Heart,
      globe: Globe,
      check: CheckCircle,
      tool: Wrench
    };
    
    const iconBgClass = iconStyle === "circle" ? "rounded-full" :
                       iconStyle === "square" ? "rounded-lg" : "";
    
    if (layout === "alternating") {
      return (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
            </div>
            
            <div className="space-y-16 max-w-5xl mx-auto">
              {features.map((feature, index) => {
                const IconComponent = iconComponents[feature.icon] || Star;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className={cn(
                    "flex flex-col @md:flex-row items-center gap-8",
                    !isEven && "@md:flex-row-reverse"
                  )}>
                    <div className="flex-1">
                      <div className={cn(
                        "w-20 h-20 bg-primary/10 flex items-center justify-center mb-4",
                        iconBgClass
                      )}>
                        <IconComponent className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-lg">{feature.description}</p>
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                        <IconComponent className="w-32 h-32 text-muted-foreground/20" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    
    // Default grid layout
    return (
      <div className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
          </div>
          
          <div className={cn("grid gap-8 max-w-6xl mx-auto", gridCols)}>
            {features.map((feature, index) => {
              const IconComponent = iconComponents[feature.icon] || Star;
              
              return (
                <div key={index} className="group">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className={cn(
                        "w-16 h-16 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors",
                        iconBgClass
                      )}>
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
  icon: Award,
  category: "Section"
};

// CTA Banner Section - Multiple call-to-action variations
export const CTABannerSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Headline",
      defaultValue: "Ready to Get Started?"
    },
    subtitle: {
      type: "text",
      label: "Subheadline",
      defaultValue: "Join thousands of satisfied customers today"
    },
    primaryButtonText: {
      type: "text",
      label: "Primary Button Text",
      defaultValue: "Get Started"
    },
    secondaryButtonText: {
      type: "text",
      label: "Secondary Button Text",
      defaultValue: "Learn More"
    },
    layout: {
      type: "select",
      label: "Layout Style",
      defaultValue: "centered",
      options: [
        { value: "centered", label: "Centered" },
        { value: "split", label: "Split Screen" },
        { value: "gradient", label: "Gradient Background" },
        { value: "pattern", label: "Pattern Background" }
      ]
    },
    urgencyText: {
      type: "text",
      label: "Urgency Text",
      defaultValue: "Limited time offer - Act now!"
    },
    showPhone: {
      type: "select",
      label: "Show Phone Number",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props, editMode, business) => {
    const { 
      title, 
      subtitle, 
      primaryButtonText, 
      secondaryButtonText, 
      layout, 
      urgencyText,
      showPhone 
    } = props as {
      title?: string;
      subtitle?: string;
      primaryButtonText?: string;
      secondaryButtonText?: string;
      layout?: string;
      urgencyText?: string;
      showPhone?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    const bgClass = layout === "gradient" ? "bg-gradient-to-r from-primary to-primary/80" :
                   layout === "pattern" ? "bg-primary relative overflow-hidden" :
                   "bg-primary";
    
    const textColor = "text-primary-foreground";
    
    return (
      <div className={cn("py-16", bgClass)}>
        {layout === "pattern" && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className={cn(
            "max-w-4xl mx-auto",
            layout === "split" ? "grid @md:grid-cols-2 gap-8 items-center" : "text-center"
          )}>
            <div>
              <h2 className={cn("text-3xl @md:text-4xl font-bold mb-4", textColor)}>
                {title}
              </h2>
              <p className={cn("text-lg @md:text-xl mb-6", textColor, "opacity-90")}>
                {subtitle}
              </p>
              {urgencyText && (
                <p className={cn("text-sm font-medium mb-6", textColor, "opacity-80")}>
                  <Clock className="w-4 h-4 inline mr-1" />
                  {urgencyText}
                </p>
              )}
            </div>
            
            <div className={cn(
              "flex flex-col @sm:flex-row gap-4",
              layout === "split" ? "" : "justify-center"
            )}>
              <Button 
                size="lg" 
                variant="secondary"
                className="font-semibold"
                onClick={editMode ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
              >
                {primaryButtonText}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className={cn("font-semibold", textColor, "border-current hover:bg-white/10")}
                onClick={editMode ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
              >
                {secondaryButtonText}
              </Button>
            </div>
          </div>
          
          {showPhone === "yes" && businessData?.phone && (
            <div className={cn("text-center mt-8", textColor)}>
              <p className="text-sm opacity-80">Or call us directly:</p>
              <a 
                href={`tel:${businessData.phone}`} 
                className={cn("text-2xl font-bold hover:underline", textColor)}
                onClick={editMode ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
              >
                {businessData.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  },
  icon: Megaphone,
  category: "Section"
};

// Services Detailed Section - Comprehensive service showcase
export const ServicesDetailedSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Our Services"
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      defaultValue: "Comprehensive solutions tailored to your needs"
    },
    layout: {
      type: "select",
      label: "Layout Style",
      defaultValue: "cards",
      options: [
        { value: "cards", label: "Card Grid" },
        { value: "list", label: "Detailed List" },
        { value: "tabs", label: "Tabbed View" }
      ]
    },
    showFeatures: {
      type: "select",
      label: "Show Service Features",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showPricing: {
      type: "select",
      label: "Show Starting Price",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props, editMode, business) => {
    const { title, subtitle, layout, showFeatures, showPricing } = props as {
      title?: string;
      subtitle?: string;
      layout?: string;
      showFeatures?: string;
      showPricing?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    // Get services from AI generated content
    const services = businessData?.aiGeneratedContent?.services?.items || [
      {
        title: "Premium Service",
        description: "Our flagship offering with comprehensive features and dedicated support.",
        icon: "star",
        features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
      },
      {
        title: "Standard Service",
        description: "Perfect for most needs with essential features and reliable performance.",
        icon: "check",
        features: ["Feature 1", "Feature 2", "Feature 3"]
      },
      {
        title: "Basic Service",
        description: "Entry-level option with core functionality at an affordable price.",
        icon: "zap",
        features: ["Feature 1", "Feature 2"]
      }
    ];
    
    const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
      star: Star,
      check: CheckCircle,
      zap: Zap,
      shield: Shield,
      tool: Wrench,
      users: Users,
      clock: Clock,
      chart: ChartBar
    };
    
    if (layout === "list") {
      return (
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
            </div>
            
            <div className="max-w-4xl mx-auto space-y-8">
              {services.map((service, index) => {
                const IconComponent = iconComponents[service.icon || 'star'] || Star;
                
                return (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col @md:flex-row">
                        <div className="@md:w-1/3 bg-primary/5 p-8 flex items-center justify-center">
                          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                            <IconComponent className="w-12 h-12 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 p-8">
                          <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                          <p className="text-muted-foreground mb-4">{service.description}</p>
                          
                          {showFeatures === "yes" && service.features && (
                            <div className="space-y-2 mb-4">
                              {service.features.map((feature, fIndex) => (
                                <div key={fIndex} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <Button className="mt-4">
                            Learn More
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    
    // Default card grid layout
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
          </div>
          
          <div className="grid @md:grid-cols-2 @lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = iconComponents[service.icon || 'star'] || Star;
              
              return (
                <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    
                    {showFeatures === "yes" && service.features && (
                      <ul className="space-y-2 mb-4">
                        {service.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {showPricing === "yes" && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">Starting from</p>
                        <p className="text-2xl font-bold text-primary">$99</p>
                      </div>
                    )}
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
  category: "Section"
};

// Import additional icons
import { 
  Users, Shield, Heart, Globe, CheckCircle, Wrench, Award, Zap,
  ChevronRight, Megaphone, Briefcase, Mail, ChartBar, ImageIcon
} from "lucide-react";