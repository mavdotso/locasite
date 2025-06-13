"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
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
  Upload,
  Paintbrush,
  Smartphone,
  Monitor,
  Tablet,
  Layers,
  Share2,
  Undo,
  Redo
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { Section } from "@/app/types/businesses";
import { HexColorPicker } from "react-colorful";
import { ModernTheme } from "@/types/simple-theme";
import { ThemePickerModal } from "./theme-picker-modal";
import ThemeIsolatedWrapper from "@/app/components/business/theme-isolated-wrapper";
import { getBusinessStyles } from "@/app/lib/business-theme-utils";

interface PageContent {
  title: string;
  sections: Section[];
}

interface IntegratedThemeBuilderProps {
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

const FONT_OPTIONS = [
  { value: "system", label: "System Default" },
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Georgia", label: "Georgia" },
];

export default function IntegratedThemeBuilder({ 
  businessId, 
  pageId, 
  initialContent 
}: IntegratedThemeBuilderProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent>(() => {
    try {
      const parsed = JSON.parse(initialContent);
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
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<{ section: number; type: string } | null>(null);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Theme state
  const [activeTab, setActiveTab] = useState("sections");
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<ModernTheme>({
    brandColor: "#00C9A8",
    primaryButtonColor: "#035C67",
    secondaryButtonColor: "#DAF1EE",
    secondaryButtonOpacity: 100,
    textColor: "#1f2937",
    headingColor: "#111827",
    linkColor: "#00C9A8",
    backgroundColor: "#ffffff",
    sectionBackgroundColor: "#f9fafb",
    fontFamily: "Inter",
    fontSize: "normal",
    borderRadius: "small",
    spacing: "normal",
  });

  // Fetch business data
  const business = useQuery(api.businesses.getById, { id: businessId });
  const updatePage = useMutation(api.pages.updatePage);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const storeFile = useMutation(api.storage.storeFile);
  const updateBusiness = useMutation(api.businesses.update);

  // Load theme from business
  const businessTheme = useQuery(
    api.themes.getById,
    business?.themeId ? { themeId: business.themeId } : "skip"
  );
  
  // Load existing theme
  useEffect(() => {
    if (!business) return;
    
    // First check if business has a themeId (new system)
    if (business.themeId && businessTheme) {
      // Apply theme from database with any overrides
      const baseTheme = businessTheme.config;
      const overrides = business.themeOverrides || {};
      
      // Convert from new theme format to ModernTheme format
      setTheme({
        brandColor: overrides.colors?.light?.primary || baseTheme.colors?.light?.primary || "#00C9A8",
        primaryButtonColor: overrides.colors?.light?.primary || baseTheme.colors?.light?.primary || "#035C67",
        secondaryButtonColor: overrides.colors?.light?.secondary || baseTheme.colors?.light?.secondary || "#DAF1EE",
        secondaryButtonOpacity: 100,
        textColor: overrides.colors?.light?.foreground || baseTheme.colors?.light?.foreground || "#1f2937",
        headingColor: overrides.colors?.light?.foreground || baseTheme.colors?.light?.foreground || "#111827",
        linkColor: overrides.colors?.light?.primary || baseTheme.colors?.light?.primary || "#00C9A8",
        backgroundColor: overrides.colors?.light?.background || baseTheme.colors?.light?.background || "#ffffff",
        sectionBackgroundColor: overrides.colors?.light?.muted || baseTheme.colors?.light?.muted || "#f9fafb",
        fontFamily: overrides.typography?.fontFamilyBase || baseTheme.typography?.fontFamilyBase || "Inter",
        fontSize: "normal",
        borderRadius: "small",
        spacing: "normal",
      });
      return;
    }
    
    // Fallback to legacy theme system
    if (business.theme?.colorScheme) {
      try {
        const saved = JSON.parse(business.theme.colorScheme);
        if (saved.version === "modern-v1") {
          setTheme(saved.theme);
          return;
        }
      } catch {
        // Continue to fallback
      }
    }
    
    // Fallback for legacy themes
    if (business.theme?.primaryColor) {
      setTheme(prev => ({
        ...prev,
        brandColor: business.theme!.primaryColor!,
        primaryButtonColor: business.theme!.primaryColor!,
        linkColor: business.theme!.primaryColor!,
      }));
    }
  }, [business, businessTheme]);

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
      
      // Check if business is using new theme system
      if (business?.themeId) {
        // Save theme customizations as overrides
        const themeOverrides = {
          colors: {
            light: {
              primary: theme.brandColor,
              secondary: theme.secondaryButtonColor,
              foreground: theme.textColor,
              background: theme.backgroundColor,
              muted: theme.sectionBackgroundColor,
            }
          },
          typography: {
            fontFamilyBase: theme.fontFamily === "system" ? undefined : theme.fontFamily,
            fontFamilyHeading: theme.fontFamily === "system" ? undefined : theme.fontFamily,
          }
        };
        
        await updateBusiness({
          id: businessId,
          business: {
            themeOverrides,
            lastEditedAt: Date.now(),
          }
        });
      } else {
        // Fallback to legacy theme system
        await updateBusiness({
          id: businessId,
          business: {
            theme: {
              primaryColor: theme.brandColor,
              fontFamily: theme.fontFamily === "system" ? undefined : theme.fontFamily,
              colorScheme: JSON.stringify({
                version: "modern-v1",
                theme,
              })
            }
          }
        });
      }
      
      // Save page content
      if (pageId) {
        await updatePage({
          pageId,
          content: JSON.stringify(pageContent)
        });
      }
      
      toast.success("Saved successfully!");
    } catch (error) {
      toast.error("Failed to save");
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

  const ColorInput = ({ 
    label, 
    value, 
    onChange,
    id
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    id: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div 
        className="flex items-center justify-between p-3 rounded-lg border bg-background cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => setActiveColorPicker(activeColorPicker === id ? null : id)}
      >
        <span className="text-sm">Fill</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{value}</span>
          <div 
            className="w-6 h-6 rounded border shadow-sm"
            style={{ backgroundColor: value }}
          />
        </div>
      </div>
      
      {activeColorPicker === id && (
        <div className="absolute z-50 right-0 mt-2">
          <div className="bg-popover rounded-lg shadow-lg p-3 border">
            <HexColorPicker color={value} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  );

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

  const sidebarItems = [
    { id: 'sections', label: 'Sections', icon: Layers },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'fonts', label: 'Fonts', icon: Type },
    { id: 'styles', label: 'Styles', icon: Paintbrush },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Header */}
      <div className="h-14 border-b bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Redo className="h-4 w-4" />
          </Button>
          
          <div className="ml-4 flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={devicePreview === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setDevicePreview('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setDevicePreview('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setDevicePreview('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share/Preview
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save & Publish
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Website Preview Container */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <div className="h-full overflow-y-auto p-8">
            <div className={cn(
              "mx-auto transition-all duration-300 bg-background rounded-lg shadow-xl overflow-hidden",
              devicePreview === 'desktop' && "max-w-none",
              devicePreview === 'tablet' && "max-w-4xl",
              devicePreview === 'mobile' && "max-w-sm"
            )}>
              <div className="overflow-y-auto relative">
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
                    {/* Inline Section Controls - only show when hovering over that section */}
                    {hoveredSection === index && (
                      <div className="absolute top-2 right-2 z-40 flex items-center gap-1 bg-background/95 backdrop-blur-sm rounded-lg p-1 shadow-lg border">
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
                      </div>
                    )}

                    {/* Editable Content */}
                    <ThemeIsolatedWrapper businessId={businessId} temporaryTheme={theme}>
                      <div className={section.hidden ? 'hidden' : ''}>
                        {section.type === 'hero' && (() => {
                        const styles = getBusinessStyles(theme);
                        return (
                          <section style={styles.hero.section}>
                            {section.image && (
                              <div style={{ position: 'absolute', inset: 0 }}>
                                <img 
                                  src={section.image} 
                                  alt="" 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                                />
                                <div style={styles.hero.overlay}></div>
                              </div>
                            )}
                            <div style={styles.hero.content}>
                              <h1 
                                style={{
                                  ...styles.hero.title,
                                  cursor: 'text',
                                  padding: '0.5rem',
                                  borderRadius: '0.25rem',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.outline = '2px solid rgba(59, 130, 246, 0.5)';
                                  e.currentTarget.style.outlineOffset = '2px';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.outline = 'none';
                                }}
                                onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].title`)}
                              >
                                {section.title || "Click to edit title"}
                              </h1>
                              <p 
                                style={{
                                  ...styles.hero.subtitle,
                                  cursor: 'text',
                                  padding: '0.5rem',
                                  borderRadius: '0.25rem',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.outline = '2px solid rgba(59, 130, 246, 0.5)';
                                  e.currentTarget.style.outlineOffset = '2px';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.outline = 'none';
                                }}
                                onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].subtitle`)}
                              >
                                {section.subtitle || "Click to edit subtitle"}
                              </p>
                            </div>
                          </section>
                        );
                      })()}

                      {section.type === 'about' && (() => {
                        const styles = getBusinessStyles(theme);
                        return (
                          <section style={styles.about.section}>
                            <div style={styles.about.container}>
                              <h2 style={styles.about.title}>About Us</h2>
                              <div 
                                style={{
                                  ...styles.about.content,
                                  cursor: 'text',
                                  padding: '1rem',
                                  borderRadius: '0.5rem',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.outline = '2px solid rgba(59, 130, 246, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.outline = 'none';
                                }}
                                onClick={(e) => makeEditable(e.target as HTMLElement, `sections[${index}].content`)}
                              >
                                {section.content || "Click to edit content..."}
                              </div>
                            </div>
                          </section>
                        );
                      })()}

                      {section.type === 'gallery' && (() => {
                        const styles = getBusinessStyles(theme);
                        return (
                          <section style={styles.gallery.section}>
                            <div style={styles.gallery.container}>
                              <h2 style={styles.gallery.title}>Gallery</h2>
                              <div style={styles.gallery.grid}>
                                {section.images?.map((image, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    style={{
                                      ...styles.gallery.imageWrapper,
                                      position: 'relative',
                                    }}
                                    className="group"
                                  >
                                    <img
                                      src={image}
                                      alt={`Gallery ${imgIndex + 1}`}
                                      style={{
                                        ...styles.gallery.image,
                                        transition: 'transform 0.3s',
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                      }}
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
                                  style={{
                                    aspectRatio: '1',
                                    border: `2px dashed ${theme.textColor}33`,
                                    borderRadius: styles.gallery.image.borderRadius,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = theme.brandColor;
                                    e.currentTarget.style.backgroundColor = `${theme.sectionBackgroundColor}80`;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = `${theme.textColor}33`;
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Plus style={{ width: '2rem', height: '2rem', color: `${theme.textColor}66` }} />
                                  <span style={{ fontSize: '0.875rem', color: `${theme.textColor}66` }}>Add Image</span>
                                </button>
                              </div>
                            </div>
                          </section>
                        );
                      })()}

                        {/* Add other section types here... */}
                      </div>
                    </ThemeIsolatedWrapper>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex border-l bg-background">
          {/* Settings Panel */}
          <div className="w-96 bg-background overflow-y-auto border-r">
            <div className="p-6">
              {activeTab === 'sections' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Page Sections</h2>
                    <Button
                      size="sm"
                      onClick={() => setShowAddSection(!showAddSection)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {showAddSection && (
                    <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg bg-muted/20">
                      {AVAILABLE_SECTIONS.map((section) => (
                        <Button
                          key={section.type}
                          variant="outline"
                          size="sm"
                          onClick={() => addSection(section.type)}
                          className="justify-start"
                        >
                          <section.icon className="h-4 w-4 mr-2" />
                          <span className="text-xs">{section.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {pageContent.sections.map((section, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border bg-card transition-colors",
                          hoveredSection === index && "border-primary",
                          section.hidden && "opacity-50"
                        )}
                        onMouseEnter={() => setHoveredSection(index)}
                        onMouseLeave={() => setHoveredSection(null)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Type className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {AVAILABLE_SECTIONS.find(s => s.type === section.type)?.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => moveSection(index, 'up')}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => moveSection(index, 'down')}
                              disabled={index === pageContent.sections.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => toggleSection(index)}
                            >
                              {section.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => removeSection(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Colors</h2>
                    
                    <Tabs defaultValue="themes" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="themes">Themes</TabsTrigger>
                        <TabsTrigger value="customize">Customize</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="themes" className="space-y-4 mt-4">
                        <Button 
                          onClick={() => setShowThemePicker(true)}
                          className="w-full mb-4"
                          variant="outline"
                        >
                          <Palette className="w-4 h-4 mr-2" />
                          Browse Professional Themes
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { name: "Ocean", brand: "#00C9A8", primary: "#035C67" },
                            { name: "Sunset", brand: "#F97316", primary: "#EA580C" },
                            { name: "Forest", brand: "#10B981", primary: "#059669" },
                            { name: "Lavender", brand: "#8B5CF6", primary: "#7C3AED" },
                          ].map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => setTheme(prev => ({
                                ...prev,
                                brandColor: preset.brand,
                                primaryButtonColor: preset.primary,
                                linkColor: preset.brand,
                              }))}
                              className="p-3 rounded-lg border hover:border-primary transition-colors text-left"
                            >
                              <div className="flex gap-2 mb-2">
                                <div 
                                  className="w-6 h-6 rounded"
                                  style={{ backgroundColor: preset.brand }}
                                />
                                <div 
                                  className="w-6 h-6 rounded"
                                  style={{ backgroundColor: preset.primary }}
                                />
                              </div>
                              <span className="text-sm">{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="customize" className="space-y-6 mt-4">
                        <div className="space-y-4">
                          <h3 className="font-medium">Brand</h3>
                          <ColorInput
                            label="Brand Color"
                            value={theme.brandColor}
                            onChange={(color) => setTheme(prev => ({ ...prev, brandColor: color }))}
                            id="brand"
                          />
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Buttons</h3>
                          <ColorInput
                            label="Primary Button"
                            value={theme.primaryButtonColor}
                            onChange={(color) => setTheme(prev => ({ ...prev, primaryButtonColor: color }))}
                            id="primary-button"
                          />
                          
                          <ColorInput
                            label="Secondary Button"
                            value={theme.secondaryButtonColor}
                            onChange={(color) => setTheme(prev => ({ ...prev, secondaryButtonColor: color }))}
                            id="secondary-button"
                          />
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Texts</h3>
                          <ColorInput
                            label="Headings"
                            value={theme.headingColor}
                            onChange={(color) => setTheme(prev => ({ ...prev, headingColor: color }))}
                            id="heading"
                          />
                          <ColorInput
                            label="Body Text"
                            value={theme.textColor}
                            onChange={(color) => setTheme(prev => ({ ...prev, textColor: color }))}
                            id="text"
                          />
                          <ColorInput
                            label="Links"
                            value={theme.linkColor}
                            onChange={(color) => setTheme(prev => ({ ...prev, linkColor: color }))}
                            id="link"
                          />
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Backgrounds</h3>
                          <ColorInput
                            label="Page Background"
                            value={theme.backgroundColor}
                            onChange={(color) => setTheme(prev => ({ ...prev, backgroundColor: color }))}
                            id="background"
                          />
                          <ColorInput
                            label="Section Background"
                            value={theme.sectionBackgroundColor}
                            onChange={(color) => setTheme(prev => ({ ...prev, sectionBackgroundColor: color }))}
                            id="section-bg"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}

              {activeTab === 'fonts' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Fonts</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2">Font Family</Label>
                      <select
                        value={theme.fontFamily}
                        onChange={(e) => setTheme(prev => ({ ...prev, fontFamily: e.target.value }))}
                        className="w-full p-3 rounded-lg border bg-background"
                      >
                        {FONT_OPTIONS.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label className="text-sm mb-2">Font Size</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['small', 'normal', 'large'] as const).map(size => (
                          <button
                            key={size}
                            onClick={() => setTheme(prev => ({ ...prev, fontSize: size }))}
                            className={cn(
                              "p-2 rounded-lg border capitalize",
                              theme.fontSize === size ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'styles' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Styles</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2">Border Radius</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['none', 'small', 'medium', 'large'] as const).map(radius => (
                          <button
                            key={radius}
                            onClick={() => setTheme(prev => ({ ...prev, borderRadius: radius }))}
                            className={cn(
                              "p-2 rounded-lg border capitalize",
                              theme.borderRadius === radius ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                            )}
                          >
                            {radius}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm mb-2">Spacing</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['compact', 'normal', 'spacious'] as const).map(spacing => (
                          <button
                            key={spacing}
                            onClick={() => setTheme(prev => ({ ...prev, spacing }))}
                            className={cn(
                              "p-2 rounded-lg border capitalize",
                              theme.spacing === spacing ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                            )}
                          >
                            {spacing}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Icon Navigation */}
          <div className="w-20 bg-gray-50 flex flex-col items-center py-4 gap-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-background transition-colors",
                  activeTab === item.id && "bg-background shadow-sm"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  activeTab === item.id ? "text-foreground" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs",
                  activeTab === item.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
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
      
      {/* Theme Picker Modal */}
      <ThemePickerModal
        isOpen={showThemePicker}
        onClose={() => setShowThemePicker(false)}
        businessId={businessId}
        currentThemeId={business?.themeId}
        onThemeSelect={async () => {
          // Theme has been applied through the mutation
          // The business data will auto-refresh due to Convex reactivity
          setShowThemePicker(false);
          toast.success("Theme applied successfully!");
          
          // Force reload the page to ensure theme is applied
          window.location.reload();
        }}
      />
    </div>
  );
}