"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  X,
  Type,
  Palette,
  Image as ImageIcon,
  Layout,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TypographyEditor } from "./typography-editor";
import { BackgroundEditor } from "./background-editor";
import { GalleryManager } from "./gallery-manager";

interface SectionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  sectionType: string;
  sectionData: any;
  onSave: (data: any) => void;
  className?: string;
}

export function SectionEditor({
  isOpen,
  onClose,
  sectionType,
  sectionData,
  onSave,
  className
}: SectionEditorProps) {
  const [data, setData] = useState(sectionData || {});
  const [activeTab, setActiveTab] = useState("content");

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  const updateData = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const getSectionTitle = () => {
    switch (sectionType) {
      case "hero": return "Hero Section";
      case "info": return "Business Info Section";
      case "about": return "About Section";
      case "gallery": return "Gallery Section";
      case "reviews": return "Reviews Section";
      case "contact": return "Contact Section";
      case "map": return "Map Section";
      default: return "Section Editor";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Editor Panel */}
      <div className={cn(
        "relative ml-auto w-96 bg-white shadow-xl h-full flex flex-col",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{getSectionTitle()}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="content" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Content
              </TabsTrigger>
              <TabsTrigger value="style" className="text-xs">
                <Type className="h-3 w-3 mr-1" />
                Style
              </TabsTrigger>
              <TabsTrigger value="background" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                Background
              </TabsTrigger>
              {sectionType === "gallery" && (
                <TabsTrigger value="gallery" className="text-xs">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Images
                </TabsTrigger>
              )}
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <TabsContent value="content" className="mt-0">
                    <SectionContentEditor 
                      sectionType={sectionType}
                      data={data}
                      onChange={updateData}
                    />
                  </TabsContent>

                  <TabsContent value="style" className="mt-0">
                    <TypographyEditor
                      value={data.typography || {}}
                      onChange={(value) => updateData("typography", value)}
                    />
                  </TabsContent>

                  <TabsContent value="background" className="mt-0">
                    <BackgroundEditor
                      value={data.background || {}}
                      onChange={(value) => updateData("background", value)}
                    />
                  </TabsContent>

                  {sectionType === "gallery" && (
                    <TabsContent value="gallery" className="mt-0">
                      <GalleryManager
                        value={data.images || []}
                        onChange={(value) => updateData("images", value)}
                      />
                    </TabsContent>
                  )}
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Content editor for different section types
function SectionContentEditor({ 
  sectionType, 
  data, 
  onChange 
}: { 
  sectionType: string; 
  data: any; 
  onChange: (field: string, value: any) => void; 
}) {
  switch (sectionType) {
    case "hero":
      return <HeroContentEditor data={data} onChange={onChange} />;
    case "about":
      return <AboutContentEditor data={data} onChange={onChange} />;
    case "info":
      return <InfoContentEditor data={data} onChange={onChange} />;
    case "contact":
      return <ContactContentEditor data={data} onChange={onChange} />;
    default:
      return <div className="text-sm text-muted-foreground">No content editor available for this section type.</div>;
  }
}

function HeroContentEditor({ data, onChange }: { data: any; onChange: (field: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          type="text"
          value={data.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          placeholder="Enter hero title"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Subtitle</label>
        <textarea
          value={data.subtitle || ""}
          onChange={(e) => onChange("subtitle", e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          rows={3}
          placeholder="Enter hero subtitle"
        />
      </div>
    </div>
  );
}

function AboutContentEditor({ data, onChange }: { data: any; onChange: (field: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">About Text</label>
        <textarea
          value={data.content || ""}
          onChange={(e) => onChange("content", e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          rows={6}
          placeholder="Tell your story..."
        />
      </div>
    </div>
  );
}

function InfoContentEditor({ data, onChange }: { data: any; onChange: (field: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Phone</label>
        <input
          type="text"
          value={data.phone || ""}
          onChange={(e) => onChange("phone", e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          placeholder="(555) 123-4567"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={data.email || ""}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          placeholder="hello@business.com"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Address</label>
        <textarea
          value={data.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          rows={2}
          placeholder="123 Main St, City, State 12345"
        />
      </div>
    </div>
  );
}

function ContactContentEditor({ data, onChange }: { data: any; onChange: (field: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Section Title</label>
        <input
          type="text"
          value={data.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          placeholder="Get In Touch"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={data.subtitle || ""}
          onChange={(e) => onChange("subtitle", e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          rows={3}
          placeholder="We'd love to hear from you..."
        />
      </div>
    </div>
  );
}