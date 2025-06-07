"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { 
  Save, 
  Loader2,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  Image as ImageIcon,
  Type,
  Palette,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { Section } from "@/app/types/businesses";

interface PageContent {
  title: string;
  sections: Section[];
}

interface FullyInlineBuilderProps {
  businessId: Id<"businesses">;
  pageId?: Id<"pages">;
  initialContent: string;
}

// Available sections that can be added
const AVAILABLE_SECTIONS = [
  { type: "hero", label: "Hero Banner", icon: ImageIcon },
  { type: "info", label: "Business Info", icon: Type },
  { type: "about", label: "About Section", icon: Type },
  { type: "services", label: "Services", icon: Type },
  { type: "whyChooseUs", label: "Why Choose Us", icon: Type },
  { type: "gallery", label: "Photo Gallery", icon: ImageIcon },
  { type: "reviews", label: "Reviews", icon: Type },
  { type: "contact", label: "Contact Section", icon: Type },
  { type: "map", label: "Map", icon: Type },
  { type: "contactForm", label: "Contact Form", icon: Type },
];

// Color presets for inline color picker
const COLOR_PRESETS = [
  { name: "Blue", color: "#3b82f6" },
  { name: "Green", color: "#10b981" },
  { name: "Purple", color: "#8b5cf6" },
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Pink", color: "#ec4899" },
];

export default function FullyInlineBuilder({ 
  businessId, 
  pageId, 
  initialContent 
}: FullyInlineBuilderProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent>(() => {
    console.log('FullyInlineBuilder - initialContent:', initialContent);
    try {
      const parsed = JSON.parse(initialContent);
      console.log('FullyInlineBuilder - parsed content:', parsed);
      // If no sections, create default ones
      if (!parsed.sections || parsed.sections.length === 0) {
        return {
          title: "Your Business Page",
          sections: [
            {
              type: "hero",
              title: "Welcome to Your Business",
              subtitle: "Click to edit this text and make it your own",
              hidden: false
            },
            {
              type: "about",
              content: "Tell your story here. What makes your business special? Click to edit this text.",
              hidden: false
            },
            {
              type: "gallery",
              images: [],
              hidden: false
            },
            {
              type: "contact",
              title: "Get in Touch",
              subtitle: "We'd love to hear from you",
              hidden: false
            }
          ]
        };
      }
      return parsed;
    } catch {
      return {
        title: "Your Business Page",
        sections: [
          {
            type: "hero",
            title: "Welcome to Your Business",
            subtitle: "Click to edit this text and make it your own",
            hidden: false
          },
          {
            type: "about",
            content: "Tell your story here. What makes your business special? Click to edit this text.",
            hidden: false
          }
        ]
      };
    }
  });
  
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<{ section: number; type: string } | null>(null);

  // Fetch business data
  const business = useQuery(api.businesses.getById, { id: businessId });
  const updatePage = useMutation(api.pages.updatePage);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const storeFile = useMutation(api.storage.storeFile);
  const updateBusiness = useMutation(api.businesses.update);
  const regenerateAI = useAction(api.regenerateAI.regenerateAIContentForBusiness);

  const updateContentByPath = (path: string, value: string | boolean | string[] | object) => {
    const parts = path.split('.');
    setPageContent((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev)); // Deep clone
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newContent;
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i].includes('[')) {
          const [key, index] = parts[i].split('[');
          const idx = parseInt(index.replace(']', ''));
          if (!current[key]) current[key] = [];
          if (!current[key][idx]) current[key][idx] = {};
          current = current[key][idx];
        } else {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
      }
      
      const finalKey = parts[parts.length - 1];
      if (finalKey.includes('[')) {
        const [key, index] = finalKey.split('[');
        const idx = parseInt(index.replace(']', ''));
        if (!current[key]) current[key] = [];
        current[key][idx] = value;
      } else {
        current[finalKey] = value;
      }
      
      return newContent;
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (pageId) {
        await updatePage({
          pageId,
          content: JSON.stringify(pageContent)
        });
        toast.success("Page saved successfully");
      } else {
        // If no pageId, we could create a new page or just show a message
        toast.info("No page to save - this is a preview mode");
      }
    } catch (error) {
      toast.error("Failed to save page");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (index: number) => {
    setPageContent((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i: number) => 
        i === index ? { ...section, hidden: !section.hidden } : section
      )
    }));
  };

  const addSection = (type: string) => {
    const newSection: Section = {
      type,
      hidden: false,
      ...(type === 'hero' && { 
        title: 'Your Business Name', 
        subtitle: 'Welcome to our amazing business' 
      }),
      ...(type === 'about' && { 
        content: 'Tell your story here. What makes your business special? What do you offer? Why should customers choose you?' 
      }),
      ...(type === 'gallery' && {
        images: []
      }),
      ...(type === 'contact' && {
        title: 'Get in Touch',
        subtitle: 'We\'d love to hear from you'
      }),
      ...(type === 'services' && {
        title: 'Our Services',
        items: [
          {
            title: 'Service 1',
            description: 'Description of your first service'
          },
          {
            title: 'Service 2', 
            description: 'Description of your second service'
          },
          {
            title: 'Service 3',
            description: 'Description of your third service'
          }
        ]
      }),
      ...(type === 'whyChooseUs' && {
        title: 'Why Choose Us',
        points: [
          'Experienced professionals',
          'Quality service guaranteed',
          'Competitive pricing',
          'Customer satisfaction focused'
        ]
      }),
    };

    setPageContent((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setShowAddSection(false);
  };

  const removeSection = (index: number) => {
    setPageContent((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i: number) => i !== index)
    }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pageContent.sections.length) return;

    setPageContent((prev) => {
      const newSections = [...prev.sections];
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      return { ...prev, sections: newSections };
    });
  };

  const handleImageUpload = async (file: File, section: number, type: string) => {
    try {
      const uploadUrl = await generateUploadUrl({});
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) throw new Error("Failed to upload image");
      
      const { storageId } = await result.json();
      const url = await storeFile({
        storageId,
        businessId,
        fileType: file.type,
      });
      
      if (type === 'hero') {
        updateContentByPath(`sections[${section}].image`, url);
      } else if (type === 'gallery') {
        const currentImages = pageContent.sections[section].images || [];
        updateContentByPath(`sections[${section}].images`, [...currentImages, url]);
      }
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const removeGalleryImage = (sectionIndex: number, imageIndex: number) => {
    const currentImages = pageContent.sections[sectionIndex].images || [];
    const newImages = currentImages.filter((_, i) => i !== imageIndex);
    updateContentByPath(`sections[${sectionIndex}].images`, newImages);
  };

  const handleColorChange = async (color: string) => {
    try {
      await updateBusiness({
        id: businessId,
        business: {
          theme: {
            ...business?.theme,
            primaryColor: color,
          }
        }
      });
      toast.success("Color updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update color");
    }
  };

  // Make text editable
  const makeEditable = (element: HTMLElement, path: string) => {
    element.contentEditable = 'true';
    element.focus();
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    const handleBlur = () => {
      element.contentEditable = 'false';
      const newValue = element.innerText;
      updateContentByPath(path, newValue);
      element.removeEventListener('blur', handleBlur);
    };

    element.addEventListener('blur', handleBlur);
  };

  if (!business) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading business data...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="relative min-h-screen">
      {/* Fixed Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Color Picker */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(showColorPicker ? null : 1)}
          >
            <Palette className="h-4 w-4" />
          </Button>
          
          {showColorPicker && (
            <div className="absolute top-full right-0 mt-2 bg-background rounded-lg shadow-lg p-3 border min-w-[200px]">
              <p className="text-sm font-medium mb-2">Brand Colors</p>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    className="w-8 h-8 rounded-md border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: preset.color }}
                    onClick={() => {
                      handleColorChange(preset.color);
                      setShowColorPicker(null);
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Regenerate AI Button */}
        {!business?.aiGeneratedContent && (
          <Button
            onClick={async () => {
              try {
                console.log('Regenerating AI content...');
                await regenerateAI({ businessId });
                toast.success("AI content generated! Refresh the page to see changes.");
              } catch (error) {
                console.error('AI regeneration failed:', error);
                toast.error("Failed to generate AI content");
              }
            }}
            variant="outline"
            className="shadow-lg"
          >
            Generate AI Content
          </Button>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="shadow-lg"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </Button>
      </div>

      {/* Page Content with Inline Editing */}
      <div className="relative">
        {pageContent.sections.map((section, index) => (
          <div
            key={index}
            className={cn(
              "relative group",
              section.hidden && "opacity-50",
              hoveredSection === index && "ring-2 ring-blue-500"
            )}
            onMouseEnter={() => setHoveredSection(index)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Inline Section Controls */}
            {hoveredSection === index && (
              <div className="absolute top-2 right-2 z-40 flex items-center gap-1 bg-background/95 backdrop-blur-sm rounded-lg p-1 shadow-lg border">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="h-7 w-7 p-0"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === pageContent.sections.length - 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleSection(index)}
                  className="h-7 w-7 p-0"
                >
                  {section.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                {section.type === 'hero' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setUploadingFor({ section: index, type: 'hero' });
                      fileInputRef.current?.click();
                    }}
                    className="h-7 w-7 p-0"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                )}
                {section.type === 'gallery' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setUploadingFor({ section: index, type: 'gallery' });
                      fileInputRef.current?.click();
                    }}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeSection(index)}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="px-2 text-xs font-medium text-muted-foreground">
                  {AVAILABLE_SECTIONS.find(s => s.type === section.type)?.label}
                </div>
              </div>
            )}

            {/* Editable Content */}
            <div className={section.hidden ? 'hidden' : ''}>
              {section.type === 'hero' && (
                <section className="relative bg-gradient-to-r from-foreground to-foreground/90 text-white overflow-hidden min-h-[60vh] flex items-center">
                  {section.image && (
                    <div className="absolute inset-0">
                      <img 
                        src={section.image} 
                        alt="" 
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-foreground/40"></div>
                    </div>
                  )}
                  <div className="relative z-10 container mx-auto px-4 py-32 text-center">
                    <h1 
                      className={cn(
                        "text-4xl md:text-6xl font-bold mb-6 cursor-text transition-all",
                        "hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 hover:ring-offset-transparent rounded px-2 py-1"
                      )}
                      onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].title`)}
                    >
                      {section.title || "Click to edit title"}
                    </h1>
                    <p 
                      className={cn(
                        "text-xl md:text-2xl text-white/90 max-w-2xl mx-auto cursor-text transition-all",
                        "hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 hover:ring-offset-transparent rounded px-2 py-1"
                      )}
                      onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].subtitle`)}
                    >
                      {section.subtitle || "Click to edit subtitle"}
                    </p>
                  </div>
                </section>
              )}

              {section.type === 'about' && (
                <section className="py-16 bg-background">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
                    <div 
                      className={cn(
                        "max-w-4xl mx-auto text-lg text-muted-foreground leading-relaxed cursor-text transition-all",
                        "hover:ring-2 hover:ring-blue-400 rounded p-4"
                      )}
                      onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].content`)}
                    >
                      {section.content || "Click to edit content..."}
                    </div>
                  </div>
                </section>
              )}

              {section.type === 'gallery' && (
                <section className="py-16 bg-muted/30">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {section.images?.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative group aspect-square rounded-lg overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`Gallery ${imgIndex + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={() => removeGalleryImage(index, imgIndex)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      
                      {/* Add Image Button */}
                      <button
                        onClick={() => {
                          setUploadingFor({ section: index, type: 'gallery' });
                          fileInputRef.current?.click();
                        }}
                        className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-muted/50 transition-colors"
                      >
                        <Plus className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Add Image</span>
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {(section.type === 'contact' || section.type === 'contactForm') && (
                <section className="py-16 bg-muted/30">
                  <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                      <h2 
                        className={cn(
                          "text-3xl font-bold mb-4 cursor-text transition-all",
                          "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1"
                        )}
                        onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].title`)}
                      >
                        {section.title || "Contact Us"}
                      </h2>
                      <p 
                        className={cn(
                          "text-lg text-muted-foreground cursor-text transition-all",
                          "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1"
                        )}
                        onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].subtitle`)}
                      >
                        {section.subtitle || "Get in touch with us"}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {section.type === 'info' && (
                <section className="py-16 bg-background">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Business Info</h2>
                    <div className="max-w-2xl mx-auto space-y-4">
                      <div className="group relative">
                        <strong>Address:</strong>
                        <span 
                          className={cn(
                            "ml-2 cursor-text transition-all",
                            "hover:ring-2 hover:ring-blue-400 rounded px-1"
                          )}
                          onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].address`)}
                        >
                          {section.address || business.address || "Click to edit address"}
                        </span>
                      </div>
                      <div className="group relative">
                        <strong>Phone:</strong>
                        <span 
                          className={cn(
                            "ml-2 cursor-text transition-all",
                            "hover:ring-2 hover:ring-blue-400 rounded px-1"
                          )}
                          onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].phone`)}
                        >
                          {section.phone || business.phone || "Click to edit phone"}
                        </span>
                      </div>
                      <div className="group relative">
                        <strong>Email:</strong>
                        <span 
                          className={cn(
                            "ml-2 cursor-text transition-all",
                            "hover:ring-2 hover:ring-blue-400 rounded px-1"
                          )}
                          onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].email`)}
                        >
                          {section.email || business.email || "Click to edit email"}
                        </span>
                      </div>
                      <div className="group relative">
                        <strong>Website:</strong>
                        <span 
                          className={cn(
                            "ml-2 cursor-text transition-all",
                            "hover:ring-2 hover:ring-blue-400 rounded px-1"
                          )}
                          onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].website`)}
                        >
                          {section.website || business.website || "Click to edit website"}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {section.type === 'reviews' && (
                <section className="py-16 bg-muted/30">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(business.reviews || []).map((review, reviewIndex) => (
                        <div key={reviewIndex} className="bg-background p-6 rounded-lg shadow-sm">
                          <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{review.text}</p>
                          <p className="font-semibold">{review.reviewer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {section.type === 'map' && (
                <section className="py-16 bg-background">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Location</h2>
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-muted rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">Map will be displayed here</p>
                        <p className="mt-2">
                          <span 
                            className={cn(
                              "cursor-text transition-all",
                              "hover:ring-2 hover:ring-blue-400 rounded px-1"
                            )}
                            onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].address`)}
                          >
                            {section.address || business.address || "Click to edit address"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {section.type === 'services' && (
                <section className="py-16 bg-background">
                  <div className="container mx-auto px-4">
                    <h2 
                      className={cn(
                        "text-3xl font-bold text-center mb-12 cursor-text transition-all",
                        "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1"
                      )}
                      onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].title`)}
                    >
                      {section.title || "Our Services"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {(section.items || []).map((service, serviceIndex) => (
                        <div key={serviceIndex} className="bg-muted/30 p-6 rounded-lg">
                          <h3 
                            className={cn(
                              "text-xl font-semibold mb-3 cursor-text transition-all",
                              "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1"
                            )}
                            onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].items[${serviceIndex}].title`)}
                          >
                            {service.title || "Service Title"}
                          </h3>
                          <p 
                            className={cn(
                              "text-muted-foreground cursor-text transition-all",
                              "hover:ring-2 hover:ring-blue-400 rounded p-2"
                            )}
                            onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].items[${serviceIndex}].description`)}
                          >
                            {service.description || "Service description..."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {section.type === 'whyChooseUs' && (
                <section className="py-16 bg-muted/30">
                  <div className="container mx-auto px-4">
                    <h2 
                      className={cn(
                        "text-3xl font-bold text-center mb-12 cursor-text transition-all",
                        "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1"
                      )}
                      onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].title`)}
                    >
                      {section.title || "Why Choose Us"}
                    </h2>
                    <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(section.points || []).map((point, pointIndex) => (
                          <div key={pointIndex} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                              <span className="text-white text-sm">✓</span>
                            </div>
                            <p 
                              className={cn(
                                "text-foreground cursor-text transition-all",
                                "hover:ring-2 hover:ring-blue-400 rounded p-1"
                              )}
                              onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].points[${pointIndex}]`)}
                            >
                              {point || "Why choose us point..."}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Fallback for any other section types */}
              {!['hero', 'about', 'gallery', 'contact', 'contactForm', 'info', 'reviews', 'map', 'services', 'whyChooseUs'].includes(section.type) && (
                <section className="py-16 bg-background">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                      {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                    </h2>
                    <div className="text-center text-muted-foreground">
                      <p>Section type: {section.type}</p>
                      <p>This section needs inline editing implementation</p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        ))}

        {/* Add Section */}
        <div className="py-12 text-center">
          {!showAddSection ? (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAddSection(true)}
              className="group hover:scale-105 transition-transform"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
              Add Section
            </Button>
          ) : (
            <div className="max-w-2xl mx-auto p-6 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Add a new section</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AVAILABLE_SECTIONS.map((sectionType) => (
                  <Button
                    key={sectionType.type}
                    variant="outline"
                    onClick={() => addSection(sectionType.type)}
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <sectionType.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{sectionType.label}</span>
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowAddSection(false)}
                className="mt-4"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file && uploadingFor) {
            await handleImageUpload(file, uploadingFor.section, uploadingFor.type);
            setUploadingFor(null);
          }
        }}
      />
    </div>
  );
}