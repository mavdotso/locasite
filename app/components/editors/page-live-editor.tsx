'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { Eye, Edit3, Save, Undo, Smartphone, Monitor, Tablet, Plus, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/app/lib/utils';
import { Section } from '@/app/types/businesses';
import Image from 'next/image';
import BusinessPreview from '@/app/components/business/business-preview';

interface PageContent {
  title: string;
  sections: Section[];
}

interface PageLiveEditorProps {
  page: Doc<"pages">,
  domain: Doc<"domains">
  business: Doc<"businesses">
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'info', label: 'Business Info' },
  { value: 'about', label: 'About Section' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'contact', label: 'Contact Form' },
  { value: 'content', label: 'Custom Content' },
  { value: 'header', label: 'Header' },
  { value: 'map', label: 'Map' },
];

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

export default function PageLiveEditor({ page, domain, business }: PageLiveEditorProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [editMode, setEditMode] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [businessUnsavedChanges, setBusinessUnsavedChanges] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent>(() => {
    try {
      return JSON.parse(page.content);
    } catch {
      return { title: '', sections: [] };
    }
  });
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  
  // Business editing state
  const [businessData, setBusinessData] = useState(business);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(business.theme?.logoUrl || null);
  const [previewKey, setPreviewKey] = useState(0); // Force preview updates
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Convex mutations
  const updatePage = useMutation(api.pages.updatePage);
  const updateBusiness = useMutation(api.businesses.update);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const storeFile = useMutation(api.storage.storeFile);

  const getViewportClasses = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      default:
        return 'w-full h-full';
    }
  };

  const getViewportIcon = () => {
    switch (viewport) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode && unsavedChanges) {
      toast.info('You have unsaved changes', {
        description: 'Don\'t forget to save your changes before leaving edit mode.',
        action: {
          label: 'Save Now',
          onClick: handleSave
        }
      });
    }
  };

  const handleSave = async () => {
    // Don't save mock pages (unpublished businesses)
    if (page._id.startsWith('mock-')) {
      toast.info('Page preview only', {
        description: 'Publish your business to create and edit actual pages. Use Business Settings to edit business information.'
      });
      return;
    }

    try {
      await updatePage({
        pageId: page._id,
        content: JSON.stringify(pageContent),
      });
      
      toast.success('Page saved', {
        description: 'Your page has been updated successfully.'
      });
      setUnsavedChanges(false);
      
      // Refresh iframe
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page', {
        description: 'Please try again.'
      });
    }
  };

  const handleUndo = () => {
    try {
      setPageContent(JSON.parse(page.content));
      setUnsavedChanges(false);
      setSelectedSectionIndex(null);
      toast.info('Changes undone');
    } catch {
      toast.error('Error undoing changes');
    }
  };

  const updatePageField = (field: string, value: unknown) => {
    setPageContent(prev => ({
      ...prev,
      [field]: value
    }));
    setUnsavedChanges(true);
  };

  const updateSection = (index: number, updatedSection: Section) => {
    setPageContent(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? updatedSection : section
      )
    }));
    setUnsavedChanges(true);
  };

  const addSection = (type: string) => {
    const newSection: Section = {
      type,
      title: `New ${type} section`,
      content: 'Edit this content...'
    };
    
    setPageContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setSelectedSectionIndex(pageContent.sections.length);
    setUnsavedChanges(true);
  };

  const deleteSection = (index: number) => {
    setPageContent(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
    setSelectedSectionIndex(null);
    setUnsavedChanges(true);
    toast.success('Section deleted');
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pageContent.sections.length) return;

    setPageContent(prev => {
      const newSections = [...prev.sections];
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      return { ...prev, sections: newSections };
    });
    setSelectedSectionIndex(newIndex);
    setUnsavedChanges(true);
  };

  // Business editing functions
  const updateBusinessField = (field: string, value: unknown) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
    setBusinessUnsavedChanges(true);
    setPreviewKey(prev => prev + 1); // Trigger preview update
  };

  const updateBusinessTheme = (field: string, value: unknown) => {
    setBusinessData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value
      }
    }));
    setBusinessUnsavedChanges(true);
    setPreviewKey(prev => prev + 1); // Trigger preview update
  };

  const handleColorSchemeChange = (scheme: string) => {
    const selectedScheme = COLOR_SCHEMES.find(s => s.value === scheme);
    if (selectedScheme) {
      setBusinessData(prev => ({
        ...prev,
        theme: {
          ...prev.theme,
          colorScheme: scheme,
          primaryColor: selectedScheme.primary,
          secondaryColor: selectedScheme.secondary,
          accentColor: selectedScheme.accent,
        }
      }));
      setBusinessUnsavedChanges(true);
      setPreviewKey(prev => prev + 1); // Trigger preview update
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
      setBusinessUnsavedChanges(true);
      setPreviewKey(prev => prev + 1); // Trigger preview update
    }
  };

  const uploadLogo = useCallback(async (file: File) => {
    try {
      const uploadUrl = await generateUploadUrl({});
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error("Failed to upload logo");
      }
      
      const { storageId } = await result.json();
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

  const handleBusinessSave = async () => {
    try {
      let logoUrl = businessData.theme?.logoUrl || "";
      
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      } else if (logoPreview && logoPreview !== businessData.theme?.logoUrl) {
        logoUrl = logoPreview as string;
      }
      
      await updateBusiness({
        id: businessData._id,
        business: {
          ...businessData,
          theme: {
            ...businessData.theme,
            logoUrl,
          },
        },
      });
      
      toast.success("Business updated", {
        description: "Your business information has been saved successfully."
      });
      setBusinessUnsavedChanges(false);
      
      // Refresh iframe
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    } catch (error) {
      console.error("Error saving business:", error);
      toast.error("Failed to save business changes", {
        description: "Please try again."
      });
    }
  };

  const updateBusinessHours = (index: number, value: string) => {
    setBusinessData(prev => {
      const newHours = [...prev.hours];
      newHours[index] = value;
      return { ...prev, hours: newHours };
    });
    setBusinessUnsavedChanges(true);
  };

  const renderSectionEditor = (section: Section, index: number) => {
    return (
      <Card key={index} className={cn("mb-4", selectedSectionIndex === index && "ring-2 ring-blue-500")}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {SECTION_TYPES.find(t => t.value === section.type)?.label || section.type}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveSection(index, 'up')}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveSection(index, 'down')}
                disabled={index === pageContent.sections.length - 1}
                className="h-6 w-6 p-0"
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSection(index)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {section.title !== undefined && (
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={section.title || ''}
                onChange={(e) => updateSection(index, { ...section, title: e.target.value })}
                className="mt-1"
              />
            </div>
          )}
          
          {section.subtitle !== undefined && (
            <div>
              <Label className="text-xs">Subtitle</Label>
              <Input
                value={section.subtitle || ''}
                onChange={(e) => updateSection(index, { ...section, subtitle: e.target.value })}
                className="mt-1"
              />
            </div>
          )}
          
          {section.content !== undefined && (
            <div>
              <Label className="text-xs">Content</Label>
              <Textarea
                value={section.content || ''}
                onChange={(e) => updateSection(index, { ...section, content: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
          )}
          
          {section.text !== undefined && (
            <div>
              <Label className="text-xs">Text</Label>
              <Textarea
                value={section.text || ''}
                onChange={(e) => updateSection(index, { ...section, text: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
          )}

          {section.image !== undefined && (
            <div>
              <Label className="text-xs">Image URL</Label>
              <Input
                value={section.image || ''}
                onChange={(e) => updateSection(index, { ...section, image: e.target.value })}
                className="mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          {section.address !== undefined && (
            <div>
              <Label className="text-xs">Address</Label>
              <Input
                value={section.address || ''}
                onChange={(e) => updateSection(index, { ...section, address: e.target.value })}
                className="mt-1"
              />
            </div>
          )}

          {section.phone !== undefined && (
            <div>
              <Label className="text-xs">Phone</Label>
              <Input
                value={section.phone || ''}
                onChange={(e) => updateSection(index, { ...section, phone: e.target.value })}
                className="mt-1"
              />
            </div>
          )}

          {section.email !== undefined && (
            <div>
              <Label className="text-xs">Email</Label>
              <Input
                value={section.email || ''}
                onChange={(e) => updateSection(index, { ...section, email: e.target.value })}
                className="mt-1"
              />
            </div>
          )}

          {section.website !== undefined && (
            <div>
              <Label className="text-xs">Website</Label>
              <Input
                value={section.website || ''}
                onChange={(e) => updateSection(index, { ...section, website: e.target.value })}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-muted">
      {/* Top Toolbar */}
      <div className="bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{pageContent.title || page.slug} Page Editor</h1>
            <div className="flex items-center gap-2">
              {unsavedChanges && (
                <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                  Page Changes
                </Badge>
              )}
              {businessUnsavedChanges && (
                <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-800">
                  Business Changes
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Business Settings Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Business Settings
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[500px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Business Settings</SheetTitle>
                </SheetHeader>
                
                <Tabs defaultValue="business" className="mt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="business">Info</TabsTrigger>
                    <TabsTrigger value="theme">Theme</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="business" className="space-y-4 mt-4">
                    <div>
                      <Label>Business Name</Label>
                      <Input
                        value={businessData.name}
                        onChange={(e) => updateBusinessField('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={businessData.description || ''}
                        onChange={(e) => updateBusinessField('description', e.target.value)}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Address</Label>
                      <Input
                        value={businessData.address}
                        onChange={(e) => updateBusinessField('address', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={businessData.phone || ''}
                        onChange={(e) => updateBusinessField('phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={businessData.website || ''}
                        onChange={(e) => updateBusinessField('website', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Business Hours</Label>
                      <div className="space-y-2 mt-1">
                        {businessData.hours.map((hour, index) => (
                          <Input
                            key={index}
                            value={hour}
                            onChange={(e) => updateBusinessHours(index, e.target.value)}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBusinessField('hours', [...businessData.hours, ''])}
                        >
                          Add Hours
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleBusinessSave} 
                        disabled={!businessUnsavedChanges}
                        className="w-full"
                      >
                        Save Business Changes
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="theme" className="space-y-4 mt-4">
                    <div>
                      <Label>Color Schemes</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {COLOR_SCHEMES.map((scheme) => (
                          <div
                            key={scheme.value}
                            className={cn(
                              "p-3 border rounded-md cursor-pointer transition-all",
                              (businessData.theme?.colorScheme || 'default') === scheme.value && 'ring-2 ring-primary'
                            )}
                            onClick={() => handleColorSchemeChange(scheme.value)}
                          >
                            <div className="text-xs font-medium mb-1">{scheme.name}</div>
                            <div className="flex space-x-1">
                              <div className="rounded-full w-4 h-4" style={{ backgroundColor: scheme.primary }} />
                              <div className="rounded-full w-4 h-4" style={{ backgroundColor: scheme.secondary }} />
                              <div className="rounded-full w-4 h-4" style={{ backgroundColor: scheme.accent }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Custom Colors</Label>
                      <div className="space-y-2 mt-2">
                        <div>
                          <Label className="text-xs">Primary Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={businessData.theme?.primaryColor || '#000000'}
                              onChange={(e) => updateBusinessTheme('primaryColor', e.target.value)}
                              className="p-1 w-12 h-8"
                            />
                            <Input
                              type="text"
                              value={businessData.theme?.primaryColor || '#000000'}
                              onChange={(e) => updateBusinessTheme('primaryColor', e.target.value)}
                              className="flex-1 text-xs"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Secondary Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={businessData.theme?.secondaryColor || '#f8f8f8'}
                              onChange={(e) => updateBusinessTheme('secondaryColor', e.target.value)}
                              className="p-1 w-12 h-8"
                            />
                            <Input
                              type="text"
                              value={businessData.theme?.secondaryColor || '#f8f8f8'}
                              onChange={(e) => updateBusinessTheme('secondaryColor', e.target.value)}
                              className="flex-1 text-xs"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Accent Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={businessData.theme?.accentColor || '#0070f3'}
                              onChange={(e) => updateBusinessTheme('accentColor', e.target.value)}
                              className="p-1 w-12 h-8"
                            />
                            <Input
                              type="text"
                              value={businessData.theme?.accentColor || '#0070f3'}
                              onChange={(e) => updateBusinessTheme('accentColor', e.target.value)}
                              className="flex-1 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Font Family</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {FONT_OPTIONS.map((font) => (
                          <div
                            key={font.value}
                            className={cn(
                              "p-2 border rounded-md cursor-pointer transition-all text-sm",
                              (businessData.theme?.fontFamily || 'var(--font-sans)') === font.value && 'ring-2 ring-primary'
                            )}
                            onClick={() => updateBusinessTheme('fontFamily', font.value)}
                            style={{ fontFamily: font.value }}
                          >
                            {font.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Logo</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="mt-1"
                      />
                      {logoPreview && (
                        <div className="mt-2">
                          <div className="flex justify-center p-2 border rounded-md">
                            <Image
                              height={200}
                              width={200}
                              src={logoPreview}
                              alt="Logo preview"
                              className="max-h-20 object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleBusinessSave} 
                        disabled={!businessUnsavedChanges}
                        className="w-full"
                      >
                        Save Theme Changes
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gallery" className="space-y-4 mt-4">
                    <div>
                      <Label>Photo Gallery</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {businessData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <Image
                              height={150}
                              width={150}
                              src={photo}
                              alt={`Business photo ${index + 1}`}
                              className="w-full h-20 object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                      {businessData.photos.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No photos uploaded yet
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>

            {/* Viewport Controls */}
            <div className="flex items-center border rounded-lg p-1 bg-muted">
              {(['desktop', 'tablet', 'mobile'] as ViewportSize[]).map((size) => (
                <Button
                  key={size}
                  variant={viewport === size ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewport(size)}
                  className="h-8 px-3"
                >
                  {size === 'desktop' && <Monitor className="w-4 h-4" />}
                  {size === 'tablet' && <Tablet className="w-4 h-4" />}
                  {size === 'mobile' && <Smartphone className="w-4 h-4" />}
                  <span className="ml-1 hidden sm:inline capitalize">{size}</span>
                </Button>
              ))}
            </div>

            {/* Edit Mode Toggle */}
            <Button
              variant={editMode ? 'default' : 'outline'}
              onClick={handleEditToggle}
              className="flex items-center gap-2"
            >
              {editMode ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {editMode ? 'Preview' : 'Edit'}
            </Button>

            {/* Save/Undo Controls */}
            {editMode && (
              <>
                <Button
                  variant="outline"
                  onClick={handleUndo}
                  disabled={!unsavedChanges}
                  className="flex items-center gap-2"
                >
                  <Undo className="w-4 h-4" />
                  Undo
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!unsavedChanges}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (when in edit mode) */}
        {editMode && (
          <div className="w-80 bg-background border-r border-border overflow-y-auto">
            <Tabs defaultValue="content" className="h-full">
              <TabsList className="grid w-full grid-cols-2 m-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="px-4 pb-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Page Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Page Title</Label>
                      <Input
                        value={pageContent.title}
                        onChange={(e) => updatePageField('title', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sections" className="px-4 pb-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add Section</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {SECTION_TYPES.map((type) => (
                        <Button
                          key={type.value}
                          variant="outline"
                          size="sm"
                          onClick={() => addSection(type.value)}
                          className="text-xs h-8"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Page Sections</h3>
                  {pageContent.sections.map((section, index) => renderSectionEditor(section, index))}
                  {pageContent.sections.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No sections yet. Add a section to get started.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Preview Area */}
        <div className="flex-1 bg-muted flex items-center justify-center p-4">
          <div
            className={cn(
              'bg-card shadow-lg rounded-lg overflow-hidden transition-all duration-300',
              getViewportClasses(),
              viewport !== 'desktop' && 'border border-border'
            )}
          >
            {page._id.startsWith('mock-') ? (
              // Show live preview for unpublished businesses
              <BusinessPreview 
                key={previewKey}
                business={businessData}
                pageContent={pageContent}
                viewport={viewport}
              />
            ) : (
              <iframe
                ref={iframeRef}
                src={`/${domain.subdomain}/${page.slug}`}
                className="w-full h-full border-0"
                title="Live Preview"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-background border-t border-border px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <div>
            Live Preview • {domain.subdomain}.locasite.com/{page.slug}
          </div>
          <div className="flex items-center gap-4">
            {getViewportIcon()}
            <span className="capitalize">{viewport}</span>
            {editMode && (
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                Edit Mode
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}