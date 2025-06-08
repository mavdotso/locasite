'use client';

import { useState, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Eye, Edit3, Save, Undo, Smartphone, Monitor, Tablet } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/app/lib/utils';

interface LivePreviewEditorProps {
  business: {
    _id: Id<'businesses'>;
    name: string;
    description?: string;
    address: string;
    phone?: string;
    website?: string;
    hours: string[];
    photos: string[];
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      fontFamily?: string;
    };
  };
  domain: {
    _id: Id<'domains'>;
    name: string;
    subdomain: string;
  };
  pages: Array<{
    _id: Id<'pages'>;
    slug: string;
    content: string;
  }>;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export default function LivePreviewEditor({ business, domain }: Omit<LivePreviewEditorProps, 'pages'>) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [editMode, setEditMode] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [businessData, setBusinessData] = useState(business);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Convex mutations
  const updateBusiness = useMutation(api.businesses.update);

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
    try {
      await updateBusiness({
        id: businessData._id,
        business: {
          name: businessData.name,
          description: businessData.description,
          address: businessData.address,
          phone: businessData.phone,
          website: businessData.website,
          hours: businessData.hours,
          theme: businessData.theme
        }
      });
      
      // Send update to iframe
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'BUSINESS_UPDATE',
          data: businessData
        }, '*');
      }
      
      toast.success('Changes saved', {
        description: 'Your website has been updated successfully.'
      });
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes', {
        description: 'Please try again.'
      });
    }
  };

  const handleUndo = () => {
    setBusinessData(business);
    setUnsavedChanges(false);
    toast.info('Changes undone');
  };

  const updateBusinessField = (field: string, value: unknown) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
    setUnsavedChanges(true);
    
    // Send real-time update to iframe
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'LIVE_UPDATE',
        field,
        value,
        data: { ...businessData, [field]: value }
      }, '*');
    }
  };

  const updateThemeField = (field: string, value: unknown) => {
    const updatedBusiness = {
      ...businessData,
      theme: {
        ...businessData.theme,
        [field]: value
      }
    };
    setBusinessData(updatedBusiness);
    setUnsavedChanges(true);
    
    // Send real-time update to iframe
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'THEME_UPDATE',
        field,
        value,
        data: updatedBusiness
      }, '*');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-muted">
      {/* Top Toolbar */}
      <div className="bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{domain.name} Editor</h1>
            {unsavedChanges && (
              <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                Unsaved Changes
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
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
              <TabsList className="grid w-full grid-cols-3 m-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="px-4 pb-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Content Editor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Business Name</label>
                      <input
                        type="text"
                        value={businessData.name}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => updateBusinessField('name', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        value={businessData.description || ''}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        onChange={(e) => updateBusinessField('description', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        value={businessData.phone || ''}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => updateBusinessField('phone', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Website</label>
                      <input
                        type="url"
                        value={businessData.website || ''}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => updateBusinessField('website', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="design" className="px-4 pb-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Theme Customization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Primary Color</label>
                      <input
                        type="color"
                        value={businessData.theme?.primaryColor || '#3B82F6'}
                        className="w-full mt-1 h-10 border border-border rounded-md"
                        onChange={(e) => updateThemeField('primaryColor', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Secondary Color</label>
                      <input
                        type="color"
                        value={businessData.theme?.secondaryColor || '#6B7280'}
                        className="w-full mt-1 h-10 border border-border rounded-md"
                        onChange={(e) => updateThemeField('secondaryColor', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Font Family</label>
                      <select
                        value={businessData.theme?.fontFamily || 'Inter'}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => updateThemeField('fontFamily', e.target.value)}
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="px-4 pb-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Page Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">SEO Title</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter SEO title"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Meta Description</label>
                      <textarea
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="Enter meta description"
                      />
                    </div>
                  </CardContent>
                </Card>
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
            <iframe
              ref={iframeRef}
              src={`/${domain.subdomain}${editMode ? '?edit=true' : ''}`}
              className="w-full h-full border-0"
              title="Live Preview"
              onLoad={() => {
                if (editMode && iframeRef.current?.contentWindow) {
                  // Send initial data to iframe
                  iframeRef.current.contentWindow.postMessage({
                    type: 'INIT_EDITOR',
                    data: businessData
                  }, '*');
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-background border-t border-border px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <div>
            Live Preview • {domain.subdomain}.locasite.com
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