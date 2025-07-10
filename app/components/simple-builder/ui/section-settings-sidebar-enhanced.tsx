"use client";

import React from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
  Palette,
  Type,
  Image,
  Layout,
  Plus,
  Minus,
  Menu,
  Star,
  Settings,
  Heart,
  Users,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Globe,
  Check,
  X,
  Link2,
  Hash,
  AtSign,
  Building,
} from "lucide-react";
import { SimpleComponentData } from "../types/simple-builder";
import type { SimpleStyleOptions } from "../types/simple-builder";
import { getVariationById } from "../sections/section-variations";

interface SectionSettingsSidebarEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  sectionData?: SimpleComponentData;
  variationId?: string;
  onUpdate: (data: SimpleComponentData) => void;
  pageSections?: Array<{ id: string; type: string; content: unknown }>;
}

// Icon mapping for services and other sections
const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="h-4 w-4" />,
  check: <Check className="h-4 w-4" />,
  heart: <Heart className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  headphones: <Headphones className="h-4 w-4" />,
  "map-pin": <MapPin className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  mail: <Mail className="h-4 w-4" />,
  facebook: <Hash className="h-4 w-4" />,
  instagram: <AtSign className="h-4 w-4" />,
  twitter: <Link2 className="h-4 w-4" />,
  linkedin: <Building className="h-4 w-4" />,
  globe: <Globe className="h-4 w-4" />,
};

// Helper function to format field names
const formatFieldName = (fieldName: string): string => {
  // Handle special cases
  const specialCases: Record<string, string> = {
    ctaText: "Call to Action Text",
    ctaLink: "Call to Action Link",
    socialLinks: "Social Media Links",
    menuItems: "Navigation Menu",
    pricingTiers: "Pricing Plans",
    logoAlt: "Logo Alt Text",
    showButton: "Show Button",
    buttonText: "Button Text",
    buttonLink: "Button Link",
    imageAlt: "Image Alt Text",
    backgroundImage: "Background Image",
    overlayOpacity: "Overlay Opacity",
    imagePosition: "Image Position",
    showForm: "Show Contact Form",
    showMap: "Show Map",
    showInfo: "Show Contact Info",
  };

  if (specialCases[fieldName]) {
    return specialCases[fieldName];
  }

  // Convert camelCase to Title Case
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export function SectionSettingsSidebarEnhanced({
  isOpen,
  onClose,
  sectionData,
  variationId,
  onUpdate,
  pageSections = [],
}: SectionSettingsSidebarEnhancedProps) {
  const [localData, setLocalData] = React.useState<SimpleComponentData | null>(
    null,
  );

  React.useEffect(() => {
    if (sectionData) {
      setLocalData(JSON.parse(JSON.stringify(sectionData))); // Deep clone
    }
  }, [sectionData]);

  if (!localData || !variationId) return null;

  const variation = getVariationById(variationId);
  if (!variation) return null;

  const handleContentChange = (path: string, value: unknown) => {
    if (!localData) return;

    const newData = { ...localData };
    const keys = path.split(".");
    let current: Record<string, unknown> = newData as unknown as Record<
      string,
      unknown
    >;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
    setLocalData(newData);
  };

  const handleStyleChange = (key: keyof SimpleStyleOptions, value: unknown) => {
    if (!localData) return;

    setLocalData({
      ...localData,
      style: {
        ...localData.style,
        [key]: value,
      },
    });
  };

  const handleSave = () => {
    if (localData) {
      onUpdate(localData);
      onClose();
    }
  };

  const getContentValue = (path: string): unknown => {
    if (!localData) return "";

    const keys = path.split(".");
    let current: unknown = localData;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return "";
      }
    }

    return current;
  };

  // Handle array fields (menuItems, services, etc.)
  const handleArrayItemChange = (
    arrayPath: string,
    index: number,
    field: string,
    value: unknown,
  ) => {
    const array = getContentValue(arrayPath) as Array<Record<string, unknown>>;
    if (!Array.isArray(array)) return;

    const newArray = [...array];
    newArray[index] = { ...newArray[index], [field]: value };
    handleContentChange(arrayPath, newArray);
  };

  const handleArrayItemAdd = (arrayPath: string, template: unknown) => {
    const array = getContentValue(arrayPath) as Array<unknown>;
    const newArray = Array.isArray(array) ? [...array] : [];
    newArray.push(template);
    handleContentChange(arrayPath, newArray);
  };

  const handleArrayItemRemove = (arrayPath: string, index: number) => {
    const array = getContentValue(arrayPath) as Array<unknown>;
    if (!Array.isArray(array)) return;

    const newArray = array.filter((_, i) => i !== index);
    handleContentChange(arrayPath, newArray);
  };

  // Render field based on type
  const renderField = (field: string, parentPath: string = "") => {
    const fullPath = parentPath ? `${parentPath}.${field}` : field;
    const value = getContentValue(fullPath);
    const fieldName = field.split(".").pop() || field;
    const displayName = formatFieldName(fieldName);

    // Handle boolean fields (switches)
    if (typeof value === "boolean") {
      return (
        <div
          key={fullPath}
          className="flex items-center justify-between space-x-2 py-2"
        >
          <Label htmlFor={fullPath} className="flex-1">
            {displayName}
          </Label>
          <Switch
            id={fullPath}
            checked={value}
            onCheckedChange={(checked) =>
              handleContentChange(fullPath, checked)
            }
          />
        </div>
      );
    }

    // Handle menu items array for header
    if (fieldName === "menuItems" && Array.isArray(value)) {
      return (
        <div key={fullPath} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{displayName}</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleArrayItemAdd(fullPath, {
                  label: "New Item",
                  link: "#",
                  enabled: true,
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {value.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="flex items-center gap-2">
                      <Menu className="h-4 w-4" />
                      {item.label || `Menu Item ${index + 1}`}
                    </span>
                    {item.enabled !== undefined && (
                      <Switch
                        checked={item.enabled}
                        onCheckedChange={(checked) => {
                          handleArrayItemChange(
                            fullPath,
                            index,
                            "enabled",
                            checked,
                          );
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={item.label || ""}
                      onChange={(e) =>
                        handleArrayItemChange(
                          fullPath,
                          index,
                          "label",
                          e.target.value,
                        )
                      }
                      placeholder="Menu item label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link</Label>
                    <Input
                      value={item.link || ""}
                      onChange={(e) =>
                        handleArrayItemChange(
                          fullPath,
                          index,
                          "link",
                          e.target.value,
                        )
                      }
                      placeholder="#section-id or URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link to Section</Label>
                    <Select
                      value={item.link || ""}
                      onValueChange={(value) =>
                        handleArrayItemChange(fullPath, index, "link", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="#home">Home</SelectItem>
                        {pageSections.map((section) => (
                          <SelectItem key={section.id} value={`#${section.id}`}>
                            {formatFieldName(section.type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleArrayItemRemove(fullPath, index)}
                    className="w-full"
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    Remove Item
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
    }

    // Handle services array
    if (fieldName === "services" && Array.isArray(value)) {
      return (
        <div key={fullPath} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{displayName}</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleArrayItemAdd(fullPath, {
                  title: "New Service",
                  description: "Service description",
                  icon: "star",
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Service
            </Button>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {value.map((service, index) => (
              <AccordionItem key={index} value={`service-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    {iconMap[service.icon] || <Star className="h-4 w-4" />}
                    {service.title || `Service ${index + 1}`}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={service.icon || "star"}
                      onValueChange={(value) =>
                        handleArrayItemChange(fullPath, index, "icon", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(iconMap).map(([key, icon]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {icon}
                              <span>{formatFieldName(key)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={service.title || ""}
                      onChange={(e) =>
                        handleArrayItemChange(
                          fullPath,
                          index,
                          "title",
                          e.target.value,
                        )
                      }
                      placeholder="Service title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={service.description || ""}
                      onChange={(e) =>
                        handleArrayItemChange(
                          fullPath,
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Service description"
                      rows={3}
                    />
                  </div>
                  {service.features && (
                    <div className="space-y-2">
                      <Label>Features</Label>
                      {service.features.map(
                        (feature: string, fIndex: number) => (
                          <div key={fIndex} className="flex gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...service.features];
                                newFeatures[fIndex] = e.target.value;
                                handleArrayItemChange(
                                  fullPath,
                                  index,
                                  "features",
                                  newFeatures,
                                );
                              }}
                              placeholder="Feature"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newFeatures = service.features.filter(
                                  (_: string, i: number) => i !== fIndex,
                                );
                                handleArrayItemChange(
                                  fullPath,
                                  index,
                                  "features",
                                  newFeatures,
                                );
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ),
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newFeatures = [
                            ...(service.features || []),
                            "New feature",
                          ];
                          handleArrayItemChange(
                            fullPath,
                            index,
                            "features",
                            newFeatures,
                          );
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Feature
                      </Button>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleArrayItemRemove(fullPath, index)}
                    className="w-full"
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    Remove Service
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
    }

    // Handle social links array
    if (fieldName === "socialLinks" && Array.isArray(value)) {
      return (
        <div key={fullPath} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{displayName}</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleArrayItemAdd(fullPath, { platform: "facebook", url: "#" })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {value.map((link, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Select
                  value={link.platform || "globe"}
                  onValueChange={(value) =>
                    handleArrayItemChange(fullPath, index, "platform", value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Facebook
                      </div>
                    </SelectItem>
                    <SelectItem value="instagram">
                      <div className="flex items-center gap-2">
                        <AtSign className="h-4 w-4" />
                        Instagram
                      </div>
                    </SelectItem>
                    <SelectItem value="twitter">
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        Twitter
                      </div>
                    </SelectItem>
                    <SelectItem value="linkedin">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        LinkedIn
                      </div>
                    </SelectItem>
                    <SelectItem value="globe">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={link.url || ""}
                  onChange={(e) =>
                    handleArrayItemChange(
                      fullPath,
                      index,
                      "url",
                      e.target.value,
                    )
                  }
                  placeholder="URL"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleArrayItemRemove(fullPath, index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle reviews array
    if (fieldName === "reviews" && Array.isArray(value)) {
      return (
        <div key={fullPath} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{displayName}</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleArrayItemAdd(fullPath, {
                  id: `review-${Date.now()}`,
                  author: "Customer Name",
                  rating: 5,
                  content: "Great service!",
                  date: new Date().toLocaleDateString(),
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Review
            </Button>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {value.map((review, index) => (
              <AccordionItem key={index} value={`review-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {review.author || `Review ${index + 1}`}
                    <span className="text-sm text-muted-foreground">
                      ({review.rating || 0} stars)
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input
                      value={review.author || ""}
                      onChange={(e) =>
                        handleArrayItemChange(
                          fullPath,
                          index,
                          "author",
                          e.target.value,
                        )
                      }
                      placeholder="Customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <Select
                      value={String(review.rating || 5)}
                      onValueChange={(value) =>
                        handleArrayItemChange(
                          fullPath,
                          index,
                          "rating",
                          parseInt(value),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                            ))}
                            <span className="ml-2">5 stars</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="4">
                          <div className="flex items-center gap-1">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                            ))}
                            <Star className="h-4 w-4 text-muted-foreground/30" />
                            <span className="ml-2">4 stars</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex items-center gap-1">
                            {[...Array(3)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                            ))}
                            {[...Array(2)].map((_, i) => (
                              <Star key={i + 3} className="h-4 w-4 text-muted-foreground/30" />
                            ))}
                            <span className="ml-2">3 stars</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex items-center gap-1">
                            {[...Array(2)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                            ))}
                            {[...Array(3)].map((_, i) => (
                              <Star key={i + 2} className="h-4 w-4 text-muted-foreground/30" />
                            ))}
                            <span className="ml-2">2 stars</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            {[...Array(4)].map((_, i) => (
                              <Star key={i + 1} className="h-4 w-4 text-muted-foreground/30" />
                            ))}
                            <span className="ml-2">1 star</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Review Text</Label>
                    <Textarea
                      value={review.content || ""}
                      onChange={(e) =>
                        handleArrayItemChange(
                          fullPath,
                          index,
                          "content",
                          e.target.value,
                        )
                      }
                      placeholder="Review content"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      value={review.date || ""}
                      onChange={(e) =>
                        handleArrayItemChange(
                          fullPath,
                          index,
                          "date",
                          e.target.value,
                        )
                      }
                      placeholder="Review date"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleArrayItemRemove(fullPath, index)}
                    className="w-full"
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    Remove Review
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
    }

    // Handle gallery images array
    if (fieldName === "images" && Array.isArray(value)) {
      return (
        <div key={fullPath} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{displayName}</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleArrayItemAdd(fullPath, {
                  src: "/api/placeholder/400/300",
                  alt: "Gallery image",
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Image
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {value.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.alt || `Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      const newSrc = prompt("Enter image URL:", image.src);
                      if (newSrc !== null) {
                        handleArrayItemChange(fullPath, index, "src", newSrc);
                      }
                    }}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => handleArrayItemRemove(fullPath, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  className="mt-1 text-xs"
                  placeholder="Alt text"
                  value={image.alt || ""}
                  onChange={(e) =>
                    handleArrayItemChange(fullPath, index, "alt", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle image fields
    if (fieldName.includes("image") || fieldName.includes("Image")) {
      return (
        <div key={fullPath} className="space-y-2">
          <Label htmlFor={fullPath} className="flex items-center gap-2">
            <Image className="h-4 w-4" aria-label="Image field" />
            {displayName}
          </Label>
          <Input
            id={fullPath}
            type="url"
            value={String(value)}
            onChange={(e) => handleContentChange(fullPath, e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
      );
    }

    // Handle textarea fields
    if (
      fieldName.includes("content") ||
      fieldName.includes("description") ||
      fieldName.includes("subtitle")
    ) {
      return (
        <div key={fullPath} className="space-y-2">
          <Label htmlFor={fullPath}>{displayName}</Label>
          <Textarea
            id={fullPath}
            value={String(value)}
            onChange={(e) => handleContentChange(fullPath, e.target.value)}
            rows={4}
            placeholder={`Enter ${displayName.toLowerCase()}`}
          />
        </div>
      );
    }

    // Default to input
    return (
      <div key={fullPath} className="space-y-2">
        <Label htmlFor={fullPath}>{displayName}</Label>
        <Input
          id={fullPath}
          value={String(value)}
          onChange={(e) => handleContentChange(fullPath, e.target.value)}
          placeholder={`Enter ${displayName.toLowerCase()}`}
        />
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Section Settings</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="content" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Style
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            {variation.editableFields.map((field) => {
              const fieldParts = field.split(".");
              if (fieldParts[0] === "content" && fieldParts.length > 1) {
                return renderField(fieldParts.slice(1).join("."), "content");
              }
              return renderField(field);
            })}
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={localData.style?.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                  className="w-20"
                />
                <Input
                  value={localData.style?.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={localData.style?.textColor || "#000000"}
                  onChange={(e) =>
                    handleStyleChange("textColor", e.target.value)
                  }
                  className="w-20"
                />
                <Input
                  value={localData.style?.textColor || "#000000"}
                  onChange={(e) =>
                    handleStyleChange("textColor", e.target.value)
                  }
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <Select
                value={localData.style?.textAlign || "left"}
                onValueChange={(value) => handleStyleChange("textAlign", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select
                value={localData.style?.fontSize || "medium"}
                onValueChange={(value) => handleStyleChange("fontSize", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Padding</Label>
              <Select
                value={localData.style?.padding || "4rem 2rem"}
                onValueChange={(value) => handleStyleChange("padding", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2rem 1rem">Small</SelectItem>
                  <SelectItem value="4rem 2rem">Medium</SelectItem>
                  <SelectItem value="6rem 3rem">Large</SelectItem>
                  <SelectItem value="8rem 4rem">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
