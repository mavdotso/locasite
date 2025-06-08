"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Slider } from "@/app/components/ui/slider";
import { Switch } from "@/app/components/ui/switch";
import { 
  Save, 
  Share2, 
  Palette, 
  Type, 
  Clock,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Undo,
  Redo,
  FileText,
  Paintbrush,
  MousePointer,
  X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";
import { modernThemeToCSS } from "@/types/simple-theme";

interface ModernThemeEditorProps {
  businessId: Id<"businesses">;
  onSave?: () => void;
  onClose?: () => void;
}

interface ThemeState {
  // Brand
  brandColor: string;
  
  // Buttons
  primaryButtonColor: string;
  secondaryButtonColor: string;
  secondaryButtonOpacity: number;
  
  // Text
  textColor: string;
  headingColor: string;
  linkColor: string;
  
  // Background
  backgroundColor: string;
  sectionBackgroundColor: string;
  
  // Typography
  fontFamily: string;
  fontSize: 'small' | 'normal' | 'large';
  
  // Layout
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
}

const FONT_OPTIONS = [
  { value: "system", label: "System Default" },
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Georgia", label: "Georgia" },
];

export function ModernThemeEditor({ businessId, onSave, onClose }: ModernThemeEditorProps) {
  const business = useQuery(api.businesses.getById, { id: businessId });
  const updateBusiness = useMutation(api.businesses.update);
  
  const [activeTab, setActiveTab] = useState("colors");
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  
  const [theme, setTheme] = useState<ThemeState>({
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
  
  // Apply theme changes in real-time
  const applyThemePreview = useCallback(() => {
    const css = modernThemeToCSS(theme);
    let styleEl = document.getElementById("theme-preview-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "theme-preview-styles";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }, [theme]);
  
  useEffect(() => {
    applyThemePreview();
    
    // Cleanup on unmount
    return () => {
      const styleEl = document.getElementById("theme-preview-styles");
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [applyThemePreview]);

  // Load existing theme
  useEffect(() => {
    if (!business) return;
    
    if (business.theme?.colorScheme) {
      try {
        const saved = JSON.parse(business.theme.colorScheme);
        if (saved.version === "modern-v1") {
          setTheme(saved.theme);
          return;
        }
      } catch (e) {
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
  }, [business]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
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
      
      toast.success("Theme saved successfully!");
      onSave?.();
    } catch (error) {
      toast.error("Failed to save theme");
    } finally {
      setIsSaving(false);
    }
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

  const sidebarItems = [
    { id: 'page', label: 'Page', icon: FileText },
    { id: 'branding', label: 'Branding', icon: Paintbrush },
    { id: 'fonts', label: 'Fonts', icon: Type },
    { id: 'colors', label: 'Colors', icon: Palette, active: true },
    { id: 'styles', label: 'Styles', icon: Clock },
    { id: 'motion', label: 'Motion', icon: MousePointer },
    { id: 'flow', label: 'Flow', icon: Layout },
  ];

  return (
    <div className="fixed inset-0 bg-background z-50 flex">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => {
            // Cleanup preview styles
            const styleEl = document.getElementById("theme-preview-styles");
            if (styleEl) {
              styleEl.remove();
            }
            onClose?.();
          }}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Redo className="h-4 w-4" />
          </Button>
          
          <div className="ml-4 flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={devicePreview === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setDevicePreview('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setDevicePreview('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
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
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save & Publish
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full pt-16">
        {/* Sidebar */}
        <div className="w-20 border-r bg-muted/30 flex flex-col items-center py-4 gap-1">
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

        {/* Settings Panel */}
        <div className="w-96 border-r bg-background overflow-y-auto">
          <div className="p-6">
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
                        
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Secondary Button</Label>
                          <ColorInput
                            label=""
                            value={theme.secondaryButtonColor}
                            onChange={(color) => setTheme(prev => ({ ...prev, secondaryButtonColor: color }))}
                            id="secondary-button"
                          />
                          <div className="flex items-center justify-between p-3 rounded-lg border">
                            <span className="text-sm">Opacity</span>
                            <span className="text-sm text-muted-foreground">
                              {theme.secondaryButtonOpacity}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium">Texts</h3>
                        <ColorInput
                          label="Text Strong"
                          value={theme.headingColor}
                          onChange={(color) => setTheme(prev => ({ ...prev, headingColor: color }))}
                          id="heading"
                        />
                        <ColorInput
                          label="Text"
                          value={theme.textColor}
                          onChange={(color) => setTheme(prev => ({ ...prev, textColor: color }))}
                          id="text"
                        />
                        <ColorInput
                          label="Link"
                          value={theme.linkColor}
                          onChange={(color) => setTheme(prev => ({ ...prev, linkColor: color }))}
                          id="link"
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

        {/* Preview Area */}
        <div className="flex-1 bg-muted/20 overflow-y-auto p-8 relative">
          <div className={cn(
            "mx-auto bg-background rounded-lg shadow-lg overflow-hidden transition-all",
            devicePreview === 'desktop' && "max-w-6xl",
            devicePreview === 'tablet' && "max-w-2xl",
            devicePreview === 'mobile' && "max-w-sm"
          )}>
            {/* Theme Preview */}
            <div className="p-8" style={{
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              fontFamily: theme.fontFamily === 'system' ? 'inherit' : theme.fontFamily,
            }}>
              <h1 className="text-3xl font-bold mb-4" style={{ color: theme.headingColor }}>
                {business?.name || "Your Business Name"}
              </h1>
              <p className="mb-6">
                {business?.description || "This is a preview of how your website will look with the selected theme."}
              </p>
              
              {/* Sample section with alternating background */}
              <div className="-mx-8 px-8 py-8 mb-8" style={{ backgroundColor: theme.sectionBackgroundColor }}>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: theme.headingColor }}>
                  About Us
                </h2>
                <p className="leading-relaxed">
                  This section demonstrates the alternating background color scheme. Your content will flow seamlessly between light and dark sections.
                </p>
              </div>
              
              <div className="flex gap-3 flex-wrap">
                <button
                  className="px-6 py-3 transition-colors font-medium"
                  style={{
                    backgroundColor: theme.primaryButtonColor,
                    color: 'white',
                    borderRadius: theme.borderRadius === 'none' ? '0' : 
                                 theme.borderRadius === 'small' ? '0.375rem' :
                                 theme.borderRadius === 'medium' ? '0.75rem' : '1.5rem'
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-6 py-3 transition-colors font-medium"
                  style={{
                    backgroundColor: theme.secondaryButtonColor,
                    opacity: theme.secondaryButtonOpacity / 100,
                    color: theme.textColor,
                    borderRadius: theme.borderRadius === 'none' ? '0' : 
                                 theme.borderRadius === 'small' ? '0.375rem' :
                                 theme.borderRadius === 'medium' ? '0.75rem' : '1.5rem'
                  }}
                >
                  Secondary Button
                </button>
              </div>
              
              <div className="mt-8">
                <a href="#" style={{ color: theme.linkColor }} className="hover:underline">
                  This is a link with your chosen link color →
                </a>
              </div>
            </div>
          </div>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}