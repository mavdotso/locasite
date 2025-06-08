"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { EditModeContext } from "@/components/providers/edit-mode-provider";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { 
  Eye, 
  EyeOff, 
  Save, 
  Loader2,
  Type,
  Image as ImageIcon,
  Palette,
  Plus,
  Settings,
  X,
  Upload,
  Bold,
  Italic
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { Section } from "@/app/types/businesses";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Card } from "@/app/components/ui/card";
import BusinessPageContent from "@/app/components/business/business-page-content";

interface PageContent {
  title: string;
  sections: Section[];
}

interface VisualPageBuilderProps {
  businessId: Id<"businesses">;
  pageId: Id<"pages">;
  initialContent: string;
}

// Available sections that can be added
const AVAILABLE_SECTIONS = [
  { type: "hero", label: "Hero Banner", icon: ImageIcon },
  { type: "info", label: "Business Info", icon: Type },
  { type: "about", label: "About Section", icon: Type },
  { type: "gallery", label: "Photo Gallery", icon: ImageIcon },
  { type: "reviews", label: "Reviews", icon: Type },
  { type: "contact", label: "Contact Section", icon: Type },
  { type: "map", label: "Map", icon: Type },
  { type: "contactForm", label: "Contact Form", icon: Type },
];

// Color presets
const COLOR_PRESETS = [
  { name: "Default", primary: "#000000", secondary: "#ffffff", accent: "#3b82f6" },
  { name: "Ocean", primary: "#0f172a", secondary: "#f0f9ff", accent: "#0ea5e9" },
  { name: "Forest", primary: "#14532d", secondary: "#f0fdf4", accent: "#22c55e" },
  { name: "Sunset", primary: "#7c2d12", secondary: "#fff7ed", accent: "#f97316" },
  { name: "Purple", primary: "#581c87", secondary: "#faf5ff", accent: "#a855f7" },
];

// Font options
const FONT_FAMILIES = [
  { value: "font-sans", label: "Sans Serif" },
  { value: "font-serif", label: "Serif" },
  { value: "font-mono", label: "Monospace" },
];

const FONT_SIZES = [
  { value: "text-sm", label: "Small" },
  { value: "text-base", label: "Normal" },
  { value: "text-lg", label: "Large" },
  { value: "text-xl", label: "Extra Large" },
  { value: "text-2xl", label: "2X Large" },
  { value: "text-3xl", label: "3X Large" },
];

const FONT_WEIGHTS = [
  { value: "font-normal", label: "Normal" },
  { value: "font-medium", label: "Medium" },
  { value: "font-semibold", label: "Semibold" },
  { value: "font-bold", label: "Bold" },
];

export default function VisualPageBuilder({ 
  businessId, 
  pageId, 
  initialContent 
}: VisualPageBuilderProps) {
  const editModeContext = useContext(EditModeContext);
  const { isEditMode: contextEditMode } = editModeContext || {};
  const [isEditMode, setIsEditMode] = useState(contextEditMode ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<PageContent>(() => {
    try {
      return JSON.parse(initialContent);
    } catch {
      return { title: "Page Title", sections: [] };
    }
  });
  
  // Track editable elements

  // Fetch business data
  const business = useQuery(api.businesses.getById, { id: businessId });
  const updatePage = useMutation(api.pages.updatePage);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const storeFile = useMutation(api.storage.storeFile);
  const updateBusiness = useMutation(api.businesses.update);

  // Style state
  const [elementStyles, setElementStyles] = useState<Map<string, Record<string, string>>>(new Map()); // For future use
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<{ type: string; index?: number } | null>(null);

  const updateContentByPath = (path: string, value: string | boolean | string[]) => {
    const parts = path.split('.');
    setPageContent((prev) => {
      const newContent = { ...prev };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newContent;
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i].includes('[')) {
          const [key, index] = parts[i].split('[');
          const idx = parseInt(index.replace(']', ''));
          current = current[key][idx];
        } else {
          current = current[parts[i]];
        }
      }
      
      current[parts[parts.length - 1]] = value;
      return newContent;
    });
  };

  const handleContentChange = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    const path = target.getAttribute('data-editable');
    if (!path) return;

    const newContent = target.innerText;
    updateContentByPath(path, newContent);
  }, []);

  const handleElementClick = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    const path = target.getAttribute('data-editable');
    if (path) {
      setSelectedElement(path);
      e.stopPropagation();
    }
  }, []);

  // Initialize editable elements
  useEffect(() => {
    if (isEditMode) {
      // Make text elements editable
      const editables = document.querySelectorAll('[data-editable]');
      editables.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.contentEditable = 'true';
        htmlEl.style.cursor = 'text';
        htmlEl.addEventListener('input', handleContentChange);
        htmlEl.addEventListener('click', handleElementClick);
      });

      return () => {
        editables.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.contentEditable = 'false';
          htmlEl.removeEventListener('input', handleContentChange);
          htmlEl.removeEventListener('click', handleElementClick);
        });
      };
    }
  }, [isEditMode, pageContent, handleContentChange, handleElementClick]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (pageId) {
        await updatePage({
          pageId,
          content: JSON.stringify(pageContent)
        });
      }
      toast.success("Page saved successfully");
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
        title: 'New Hero Title', 
        subtitle: 'New subtitle text' 
      }),
      ...(type === 'about' && { 
        content: 'Tell your story here...' 
      }),
    };

    setPageContent((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (index: number) => {
    setPageContent((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i: number) => i !== index)
    }));
  };

  const handleImageUpload = async (file: File, path: string) => {
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
      
      updateContentByPath(path, url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const applyTextStyle = (style: string, value: string) => {
    if (!selectedElement) return;
    
    const element = document.querySelector(`[data-editable="${selectedElement}"]`);
    if (!element) return;

    const htmlElement = element as HTMLElement;
    
    switch (style) {
      case 'fontFamily':
        htmlElement.className = htmlElement.className.replace(/font-\w+/g, '') + ' ' + value;
        break;
      case 'fontSize':
        htmlElement.className = htmlElement.className.replace(/text-\w+/g, '') + ' ' + value;
        break;
      case 'fontWeight':
        htmlElement.className = htmlElement.className.replace(/font-\w+/g, '') + ' ' + value;
        break;
      case 'color':
        htmlElement.style.color = value;
        break;
      case 'bold':
        htmlElement.style.fontWeight = htmlElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
        break;
      case 'italic':
        htmlElement.style.fontStyle = htmlElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
        break;
    }

    // Store the styles for persistence
    setElementStyles((prev) => {
      const newStyles = new Map(prev);
      const currentStyles = newStyles.get(selectedElement) || {};
      currentStyles[style] = value;
      newStyles.set(selectedElement, currentStyles);
      return newStyles;
    });
  };

  // Apply stored styles on load
  useEffect(() => {
    elementStyles.forEach((styles, elementPath) => {
      const element = document.querySelector(`[data-editable="${elementPath}"]`);
      if (element) {
        const htmlElement = element as HTMLElement;
        Object.entries(styles).forEach(([style, value]) => {
          if (style === 'color') {
            htmlElement.style.color = value;
          }
          // Apply other stored styles as needed
        });
      }
    });
  }, [elementStyles, pageContent]);

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Edit Mode Toolbar */}
      {isEditMode && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Visual Page Editor</h1>
              <div className="flex items-center gap-2">
                {selectedElement && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyTextStyle('bold', 'bold')}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyTextStyle('italic', 'italic')}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Style Editor */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Palette className="h-4 w-4 mr-2" />
                    Styles
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Page Styles</SheetTitle>
                  </SheetHeader>
                  
                  <Tabs defaultValue="text" className="mt-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="colors">Colors</TabsTrigger>
                      <TabsTrigger value="sections">Sections</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text" className="space-y-4">
                      {selectedElement && (
                        <>
                          <div>
                            <Label>Font Family</Label>
                            <Select onValueChange={(value) => applyTextStyle('fontFamily', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select font" />
                              </SelectTrigger>
                              <SelectContent>
                                {FONT_FAMILIES.map((font) => (
                                  <SelectItem key={font.value} value={font.value}>
                                    {font.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Font Size</Label>
                            <Select onValueChange={(value) => applyTextStyle('fontSize', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                {FONT_SIZES.map((size) => (
                                  <SelectItem key={size.value} value={size.value}>
                                    {size.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Font Weight</Label>
                            <Select onValueChange={(value) => applyTextStyle('fontWeight', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select weight" />
                              </SelectTrigger>
                              <SelectContent>
                                {FONT_WEIGHTS.map((weight) => (
                                  <SelectItem key={weight.value} value={weight.value}>
                                    {weight.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Text Color</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                type="color"
                                className="w-16 h-10"
                                onChange={(e) => applyTextStyle('color', e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="colors" className="space-y-4">
                      <div>
                        <Label>Color Presets</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {COLOR_PRESETS.map((preset) => (
                            <Button
                              key={preset.name}
                              variant="outline"
                              className="h-auto p-3 justify-start"
                              onClick={async () => {
                                try {
                                  await updateBusiness({
                                    id: businessId,
                                    business: {
                                      theme: {
                                        primaryColor: preset.primary,
                                        secondaryColor: preset.secondary,
                                        accentColor: preset.accent,
                                      }
                                    }
                                  });
                                  toast.success("Colors updated");
                                } catch {
                                  toast.error("Failed to update colors");
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <div 
                                    className="w-4 h-4 rounded-full border" 
                                    style={{ backgroundColor: preset.primary }}
                                  />
                                  <div 
                                    className="w-4 h-4 rounded-full border" 
                                    style={{ backgroundColor: preset.secondary }}
                                  />
                                  <div 
                                    className="w-4 h-4 rounded-full border" 
                                    style={{ backgroundColor: preset.accent }}
                                  />
                                </div>
                                <span className="text-sm">{preset.name}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Custom Colors</Label>
                        <div className="space-y-3 mt-2">
                          <div>
                            <Label className="text-xs">Primary Color</Label>
                            <Input 
                              type="color" 
                              className="w-full h-10 mt-1"
                              defaultValue={business?.theme?.primaryColor || "#000000"}
                              onChange={async (e) => {
                                try {
                                  await updateBusiness({
                                    id: businessId,
                                    business: {
                                      theme: {
                                        ...business?.theme,
                                        primaryColor: e.target.value,
                                      }
                                    }
                                  });
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Secondary Color</Label>
                            <Input 
                              type="color" 
                              className="w-full h-10 mt-1"
                              defaultValue={business?.theme?.secondaryColor || "#ffffff"}
                              onChange={async (e) => {
                                try {
                                  await updateBusiness({
                                    id: businessId,
                                    business: {
                                      theme: {
                                        ...business?.theme,
                                        secondaryColor: e.target.value,
                                      }
                                    }
                                  });
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Accent Color</Label>
                            <Input 
                              type="color" 
                              className="w-full h-10 mt-1"
                              defaultValue={business?.theme?.accentColor || "#3b82f6"}
                              onChange={async (e) => {
                                try {
                                  await updateBusiness({
                                    id: businessId,
                                    business: {
                                      theme: {
                                        ...business?.theme,
                                        accentColor: e.target.value,
                                      }
                                    }
                                  });
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sections" className="space-y-4">
                      <div>
                        <Label>Available Sections</Label>
                        <div className="space-y-2 mt-4">
                          {AVAILABLE_SECTIONS.map((section) => (
                            <Button
                              key={section.type}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => addSection(section.type)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add {section.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Label>Current Sections</Label>
                        <div className="space-y-2 mt-4">
                          {pageContent.sections.map((section, index: number) => (
                            <Card key={index} className="p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {AVAILABLE_SECTIONS.find(s => s.type === section.type)?.label || section.type}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleSection(index)}
                                  >
                                    {section.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                  {section.type === 'hero' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setUploadTarget({ type: 'hero', index });
                                        setShowImageUploader(true);
                                      }}
                                    >
                                      <ImageIcon className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSection(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>
              
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Page Preview with Inline Editing */}
      <div className={cn(
        "h-full overflow-auto",
        isEditMode && "pt-16"
      )}>
        <div 
          className="min-h-full"
          onClick={() => setSelectedElement(null)}
        >
          <div data-edit-mode={isEditMode}>
            <BusinessPageContent
              initialBusiness={business as Doc<"businesses">}
              content={pageContent}
              isVisualEditor={true}
            />
          </div>
        </div>
      </div>

      {/* Floating Edit Button */}
      {!isEditMode && (
        <Button
          className="fixed bottom-6 right-6 shadow-lg"
          onClick={() => setIsEditMode(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Edit Page
        </Button>
      )}
      
      {/* Image Upload Modal */}
      {showImageUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Image</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageUploader(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && uploadTarget) {
                        if (uploadTarget.type === 'hero' && uploadTarget.index !== undefined) {
                          await handleImageUpload(file, `sections[${uploadTarget.index}].image`);
                        }
                        setShowImageUploader(false);
                        setUploadTarget(null);
                      }
                    }}
                  />
                </Label>
              </div>
              
              <div>
                <Label>Or enter image URL</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && uploadTarget) {
                      const url = (e.target as HTMLInputElement).value;
                      if (uploadTarget.type === 'hero' && uploadTarget.index !== undefined) {
                        updateContentByPath(`sections[${uploadTarget.index}].image`, url);
                      }
                      setShowImageUploader(false);
                      setUploadTarget(null);
                    }
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}