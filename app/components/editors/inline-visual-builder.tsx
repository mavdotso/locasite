"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
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
  Type
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { Section } from "@/app/types/businesses";
import BusinessPageContent from "@/app/components/business/business-page-content";
import EditableHero from "@/app/components/business/editable-hero";
import EditableGallery from "@/app/components/business/editable-gallery";
import EditableTextSection from "@/app/components/business/editable-text-section";
import EditableContact from "@/app/components/business/editable-contact";

interface PageContent {
  title: string;
  sections: Section[];
}

interface InlineVisualBuilderProps {
  businessId: Id<"businesses">;
  pageId?: Id<"pages">;
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

export default function InlineVisualBuilder({ 
  businessId, 
  pageId, 
  initialContent 
}: InlineVisualBuilderProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent>(() => {
    try {
      return JSON.parse(initialContent);
    } catch {
      return { title: "Page Title", sections: [] };
    }
  });
  
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<{ section: number; type: string } | null>(null);

  // Fetch business data
  const business = useQuery(api.businesses.getById, { id: businessId });
  const updatePage = useMutation(api.pages.updatePage);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const storeFile = useMutation(api.storage.storeFile);


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
      ...(type === 'gallery' && {
        images: []
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

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Fixed Save Button */}
      <Button
        className="fixed top-4 right-4 z-50 shadow-lg"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save
      </Button>

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
            {/* Section Controls */}
            {hoveredSection === index && (
              <div className="absolute top-2 right-2 z-40 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === pageContent.sections.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleSection(index)}
                >
                  {section.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {section.type === 'hero' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setUploadingFor({ section: index, type: 'hero' });
                      fileInputRef.current?.click();
                    }}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeSection(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="px-2 text-xs font-medium">
                  {AVAILABLE_SECTIONS.find(s => s.type === section.type)?.label}
                </div>
              </div>
            )}

            {/* Gallery-specific inline controls */}
            {section.type === 'gallery' && hoveredSection === index && (
              <div className="absolute top-16 right-4 z-30">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    setUploadingFor({ section: index, type: 'gallery' });
                    fileInputRef.current?.click();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
            )}

            {/* Render section with editable content */}
            <div className={section.hidden ? 'hidden' : ''}>
              {section.type === 'hero' && (
                <EditableHero
                  title={section.title}
                  subtitle={section.subtitle}
                  image={section.image}
                  isEditing={true}
                  onTitleChange={(value) => updateContentByPath(`sections[${index}].title`, value)}
                  onSubtitleChange={(value) => updateContentByPath(`sections[${index}].subtitle`, value)}
                  onImageRemove={() => updateContentByPath(`sections[${index}].image`, '')}
                />
              )}

              {section.type === 'about' && (
                <EditableTextSection
                  content={section.content}
                  title="About Us"
                  isEditing={true}
                  onContentChange={(value) => updateContentByPath(`sections[${index}].content`, value)}
                />
              )}

              {section.type === 'gallery' && (
                <EditableGallery
                  images={section.images || []}
                  isEditing={true}
                  onAddImage={() => {
                    setUploadingFor({ section: index, type: 'gallery' });
                    fileInputRef.current?.click();
                  }}
                  onRemoveImage={(imgIndex) => removeGalleryImage(index, imgIndex)}
                />
              )}

              {(section.type === 'contact' || section.type === 'contactForm') && (
                <EditableContact
                  title={section.title}
                  subtitle={section.subtitle}
                  isEditing={true}
                  onTitleChange={(value) => updateContentByPath(`sections[${index}].title`, value)}
                  onSubtitleChange={(value) => updateContentByPath(`sections[${index}].subtitle`, value)}
                />
              )}

              {/* Render other components that don't have custom editors yet */}
              {!['hero', 'about', 'gallery', 'contact', 'contactForm'].includes(section.type) && (
                <BusinessPageContent
                  initialBusiness={business as Doc<"businesses">}
                  content={{ sections: [section] }}
                  isVisualEditor={true}
                />
              )}
            </div>
          </div>
        ))}

        {/* Add Section Button */}
        <div className="relative py-8">
          <div className="flex justify-center">
            {!showAddSection ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAddSection(true)}
                className="group"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                Add Section
              </Button>
            ) : (
              <div className="flex flex-wrap gap-2 max-w-2xl mx-auto p-4 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg">
                {AVAILABLE_SECTIONS.map((sectionType) => (
                  <Button
                    key={sectionType.type}
                    variant="outline"
                    onClick={() => addSection(sectionType.type)}
                    className="flex items-center gap-2"
                  >
                    <sectionType.icon className="h-4 w-4" />
                    {sectionType.label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => setShowAddSection(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input for image uploads */}
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