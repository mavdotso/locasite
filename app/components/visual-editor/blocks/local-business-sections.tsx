import React from "react";
import { ComponentConfig } from "../types";
import { 
  Clock,
  MapPin,
  Calendar,
  Tag,
  HelpCircle,
  Shield,
  Map,
  Menu,
  CreditCard,
  Car
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
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                <div className="grid md:grid-cols-2 gap-6">
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
  category: "Local Business"
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
  render: (props, _editMode, business) => {
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
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
                          <Button size="sm" className="mt-2" asChild>
                            <a 
                              href={`https://maps.google.com/?q=${encodeURIComponent(businessData.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Get Directions
                            </a>
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
  category: "Local Business"
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
  category: "Local Business"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
  category: "Local Business"
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
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
  category: "Local Business"
};

// Service Area Section
export const ServiceAreaSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Service Area"
    },
    description: {
      type: "textarea",
      label: "Description",
      defaultValue: "We proudly serve the following areas:",
      rows: 2
    },
    areas: {
      type: "array",
      label: "Service Areas",
      defaultValue: [
        "Downtown",
        "North Side",
        "South Side",
        "East District",
        "West End"
      ],
      itemType: {
        type: "text",
        label: "Area"
      },
      maxItems: 20
    },
    showMap: {
      type: "select",
      label: "Show Map",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    radius: {
      type: "text",
      label: "Service Radius",
      defaultValue: "Within 10 miles",
      placeholder: "e.g., Within 10 miles"
    }
  },
  render: (props, _editMode, business) => {
    const { title, description, areas = [], showMap, radius } = props as {
      title?: string;
      description?: string;
      areas?: string[];
      showMap?: string;
      radius?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {showMap === "yes" && businessData?.address && (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(businessData.address)}`}
                  className="w-full h-96"
                  allowFullScreen
                />
              </div>
            )}
            
            <div className={showMap === "no" ? "max-w-3xl mx-auto" : ""}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Areas We Serve
                  </CardTitle>
                  {radius && (
                    <p className="text-sm text-muted-foreground">{radius}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {areas.map((area, index) => (
                      <div
                        key={index}
                        className="bg-muted rounded-lg px-4 py-2 text-center font-medium"
                      >
                        {area}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  },
  icon: Map,
  category: "Local Business"
};

// Insurance/Payment Accepted Section
export const InsurancePaymentSection: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
      defaultValue: "Insurance & Payment"
    },
    insuranceProviders: {
      type: "array",
      label: "Insurance Providers",
      defaultValue: [
        "Blue Cross Blue Shield",
        "Aetna",
        "United Healthcare",
        "Medicare"
      ],
      itemType: {
        type: "text",
        label: "Provider"
      },
      maxItems: 20
    },
    paymentMethods: {
      type: "array",
      label: "Payment Methods",
      defaultValue: [
        "Cash",
        "Credit Cards",
        "Debit Cards",
        "HSA/FSA Cards"
      ],
      itemType: {
        type: "text",
        label: "Method"
      },
      maxItems: 10
    },
    additionalInfo: {
      type: "textarea",
      label: "Additional Information",
      defaultValue: "We also offer payment plans for qualifying patients.",
      rows: 2
    }
  },
  render: (props) => {
    const { title, insuranceProviders = [], paymentMethods = [], additionalInfo } = props as {
      title?: string;
      insuranceProviders?: string[];
      paymentMethods?: string[];
      additionalInfo?: string;
    };
    
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Insurance Accepted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {insuranceProviders.map((provider, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm font-medium">{provider}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map((method, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm font-medium">{method}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {additionalInfo && (
            <div className="mt-8 text-center max-w-3xl mx-auto">
              <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                {additionalInfo}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
  icon: Shield,
  category: "Local Business"
};