"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import Image from "next/image";

// Predefined color schemes
const COLOR_SCHEMES = [
  { name: "Default", value: "default", primary: "#000000", secondary: "#f8f8f8", accent: "#0070f3" },
  { name: "Ocean", value: "ocean", primary: "#1a365d", secondary: "#e6f0ff", accent: "#3182ce" },
  { name: "Forest", value: "forest", primary: "#2f855a", secondary: "#e6ffed", accent: "#38a169" },
  { name: "Sunset", value: "sunset", primary: "#c53030", secondary: "#fff5f5", accent: "#ed8936" },
  { name: "Lavender", value: "lavender", primary: "#6b46c1", secondary: "#f3e8ff", accent: "#805ad5" },
];

// Font options
const FONT_OPTIONS = [
  { name: "Default", value: "var(--font-sans)" },
  { name: "Serif", value: "Georgia, serif" },
  { name: "Monospace", value: "monospace" },
  { name: "Cursive", value: "cursive" },
];

interface ThemeEditorProps {
  business: {
    _id: Id<"businesses">;
    theme?: {
      colorScheme?: string;
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
      fontFamily?: string;
      logoUrl?: string;
    };
  };
  onClose?: () => void;
}

export default function ThemeEditor({ business, onClose }: ThemeEditorProps) {
  const updateBusiness = useMutation(api.businesses.update);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const storeFile = useMutation(api.storage.storeFile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(business.theme?.logoUrl || null);
  
  const [formData, setFormData] = useState({
    colorScheme: business.theme?.colorScheme || "default",
    primaryColor: business.theme?.primaryColor || "#000000",
    secondaryColor: business.theme?.secondaryColor || "#f8f8f8",
    accentColor: business.theme?.accentColor || "#0070f3",
    fontFamily: business.theme?.fontFamily || "var(--font-sans)",
    logoUrl: business.theme?.logoUrl || "",
  });

  const handleColorSchemeChange = (scheme: string) => {
    const selectedScheme = COLOR_SCHEMES.find(s => s.value === scheme);
    if (selectedScheme) {
      setFormData({
        ...formData,
        colorScheme: scheme,
        primaryColor: selectedScheme.primary,
        secondaryColor: selectedScheme.secondary,
        accentColor: selectedScheme.accent,
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = useCallback(async (file: File) => {
    try {
      // Get a signed URL for uploading
      const uploadUrl = await generateUploadUrl({});
      
      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error("Failed to upload logo");
      }
      
      // Get the storage ID from the response
      const { storageId } = await result.json();
      
      // Store the file and get the URL
      const url = await storeFile({
        storageId,
        businessId: business._id,
        fileType: file.type,
      });
      
      return url;
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw error;
    }
  }, [business._id, generateUploadUrl, storeFile]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      let logoUrl = business.theme?.logoUrl || "";
      
      // If there's a new logo file, upload it
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      } else if (logoPreview && logoPreview !== business.theme?.logoUrl) {
        // If we have a preview but no file (e.g. from data URL), use the preview
        logoUrl = logoPreview as string;
      }
      
      await updateBusiness({
        id: business._id,
        business: {
          theme: {
            ...formData,
            logoUrl,
          },
        },
      });
      
      setIsEditing(false);
      toast.success("Theme updated", {
        description: "Your theme changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Error", {
        description: "Failed to save theme changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsEditing(true)}>Customize Theme</Button>
      </div>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Customize Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colorScheme">
          <TabsList className="mb-4">
            <TabsTrigger value="colorScheme">Color Scheme</TabsTrigger>
            <TabsTrigger value="custom">Custom Colors</TabsTrigger>
            <TabsTrigger value="font">Typography</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colorScheme">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              {COLOR_SCHEMES.map((scheme) => (
                <div
                  key={scheme.value}
                  className={`p-4 border rounded-md cursor-pointer transition-all ${formData.colorScheme === scheme.value ? 'ring-2 ring-primary' : ''
                    }`}
                  onClick={() => handleColorSchemeChange(scheme.value)}
                >
                  <div className="mb-2 font-medium">{scheme.name}</div>
                  <div className="flex space-x-2">
                    <div
                      className="rounded-full w-8 h-8"
                      style={{ backgroundColor: scheme.primary }}
                    />
                    <div
                      className="rounded-full w-8 h-8"
                      style={{ backgroundColor: scheme.secondary }}
                    />
                    <div
                      className="rounded-full w-8 h-8"
                      style={{ backgroundColor: scheme.accent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="p-1 w-12 h-12"
                  />
                  <Input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="p-1 w-12 h-12"
                  />
                  <Input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="p-1 w-12 h-12"
                  />
                  <Input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="font">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-2">
                  {FONT_OPTIONS.map((font) => (
                    <div
                      key={font.value}
                      className={`p-4 border rounded-md cursor-pointer transition-all ${formData.fontFamily === font.value ? 'ring-2 ring-primary' : ''
                        }`}
                      onClick={() => setFormData({ ...formData, fontFamily: font.value })}
                      style={{ fontFamily: font.value }}
                    >
                      <div className="font-medium">{font.name}</div>
                      <p className="mt-2">The quick brown fox jumps over the lazy dog.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logo">
            <div className="space-y-4">
              <div>
                <Label htmlFor="logo">Upload Logo</Label>
                <div className="mt-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full"
                  />
                </div>
      
                {logoPreview && (
                  <div className="mt-4">
                    <p className="mb-2 font-medium text-sm">Preview:</p>
                    <div className="flex justify-center p-4 border rounded-md">
                      <Image
                        height={300}
                        width={300}
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-h-32 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setIsEditing(false);
          onClose?.();
        }}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}