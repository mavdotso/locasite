"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Save, Palette } from "lucide-react";
import { toast } from "sonner";
import { SimpleTheme, simpleThemeToCSS } from "@/types/simple-theme";
import { HexColorPicker } from "react-colorful";

interface SimpleThemeEditorProps {
  businessId: Id<"businesses">;
  onSave?: () => void;
}

// Preset color combinations
const COLOR_PRESETS = [
  { name: "Classic Blue", primary: "#2563eb", text: "#1f2937", bg: "#ffffff" },
  { name: "Modern Dark", primary: "#3b82f6", text: "#ffffff", bg: "#0f172a" },
  { name: "Warm Orange", primary: "#f97316", text: "#1f2937", bg: "#fffbeb" },
  { name: "Nature Green", primary: "#10b981", text: "#1f2937", bg: "#f0fdf4" },
  { name: "Royal Purple", primary: "#8b5cf6", text: "#1f2937", bg: "#faf5ff" },
  { name: "Minimalist", primary: "#000000", text: "#000000", bg: "#ffffff" },
];

// Font options (keeping it simple)
const FONT_OPTIONS = [
  { value: "default", label: "Default (System)" },
  { value: "Inter, sans-serif", label: "Modern (Inter)" },
  { value: "Georgia, serif", label: "Classic (Georgia)" },
  { value: "'Courier New', monospace", label: "Technical (Monospace)" },
];

export function SimpleThemeEditor({ businessId, onSave }: SimpleThemeEditorProps) {
  const business = useQuery(api.businesses.getById, { id: businessId });
  const updateBusiness = useMutation(api.businesses.update);
  
  const [theme, setTheme] = useState<SimpleTheme>({
    primaryColor: "#2563eb",
    textColor: "#1f2937",
    backgroundColor: "#ffffff",
    fontSize: "normal",
    spacing: "normal",
    borderRadius: "small",
    fontFamily: "default",
  });
  
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing theme
  useEffect(() => {
    if (!business) return;
    
    if (business.theme?.colorScheme) {
      try {
        const saved = JSON.parse(business.theme.colorScheme);
        if (saved.version === "simple-v1") {
          setTheme(saved);
          return;
        }
      } catch (e) {
        // Continue to fallback
      }
    }
    
    // Fallback for old themes or default
    setTheme({
      primaryColor: business.theme?.primaryColor || "#2563eb",
      textColor: "#1f2937",
      backgroundColor: "#ffffff",
      fontSize: "normal",
      spacing: "normal", 
      borderRadius: "small",
      fontFamily: business.theme?.fontFamily || "default",
    });
  }, [business]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const themeData = {
        primaryColor: theme.primaryColor,
        fontFamily: theme.fontFamily === "default" ? undefined : theme.fontFamily,
        // Store additional data as a JSON string in colorScheme for now
        colorScheme: JSON.stringify({
          ...theme,
          version: "simple-v1"
        })
      };
      
      // For now, save to the legacy theme field
      await updateBusiness({
        id: businessId,
        business: {
          theme: themeData
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

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: preset.primary,
      textColor: preset.text,
      backgroundColor: preset.bg,
    }));
  };

  // Generate live preview CSS
  useEffect(() => {
    const css = simpleThemeToCSS(theme);
    let styleEl = document.getElementById("theme-preview-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "theme-preview-styles";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }, [theme]);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Color Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Choose a color scheme to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary transition-colors text-left"
              >
                <div className="flex gap-1">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.bg }}
                  />
                </div>
                <span className="text-sm font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>Customize your brand colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Color */}
          <div className="flex items-center justify-between">
            <Label>Button & Link Color</Label>
            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 rounded border-2"
                style={{ backgroundColor: theme.primaryColor }}
                onClick={() => setShowColorPicker(showColorPicker === 'primary' ? null : 'primary')}
              />
              <span className="text-sm text-muted-foreground">{theme.primaryColor}</span>
            </div>
          </div>

          {/* Text Color */}
          <div className="flex items-center justify-between">
            <Label>Text Color</Label>
            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 rounded border-2"
                style={{ backgroundColor: theme.textColor }}
                onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
              />
              <span className="text-sm text-muted-foreground">{theme.textColor}</span>
            </div>
          </div>

          {/* Background Color */}
          <div className="flex items-center justify-between">
            <Label>Background Color</Label>
            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 rounded border-2"
                style={{ backgroundColor: theme.backgroundColor }}
                onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')}
              />
              <span className="text-sm text-muted-foreground">{theme.backgroundColor}</span>
            </div>
          </div>

          {/* Color Picker Popover */}
          {showColorPicker && (
            <div className="relative">
              <div className="absolute z-10 top-0 right-0">
                <HexColorPicker
                  color={
                    showColorPicker === 'primary' ? theme.primaryColor :
                    showColorPicker === 'text' ? theme.textColor :
                    theme.backgroundColor
                  }
                  onChange={(color) => {
                    if (showColorPicker === 'primary') {
                      setTheme(prev => ({ ...prev, primaryColor: color }));
                    } else if (showColorPicker === 'text') {
                      setTheme(prev => ({ ...prev, textColor: color }));
                    } else {
                      setTheme(prev => ({ ...prev, backgroundColor: color }));
                    }
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Style Options */}
      <Card>
        <CardHeader>
          <CardTitle>Style</CardTitle>
          <CardDescription>Adjust the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Font Family */}
          <div className="space-y-2">
            <Label>Font</Label>
            <Select value={theme.fontFamily} onValueChange={(value) => setTheme(prev => ({ ...prev, fontFamily: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>Text Size</Label>
            <Select value={theme.fontSize} onValueChange={(value: 'small' | 'normal' | 'large') => setTheme(prev => ({ ...prev, fontSize: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Spacing */}
          <div className="space-y-2">
            <Label>Spacing</Label>
            <Select value={theme.spacing} onValueChange={(value: 'small' | 'normal' | 'large') => setTheme(prev => ({ ...prev, spacing: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Compact</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <Label>Rounded Corners</Label>
            <Select value={theme.borderRadius} onValueChange={(value: 'none' | 'small' | 'large') => setTheme(prev => ({ ...prev, borderRadius: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sharp</SelectItem>
                <SelectItem value="small">Slightly Rounded</SelectItem>
                <SelectItem value="large">Very Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            className="p-6 space-y-4"
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              fontFamily: theme.fontFamily === 'default' ? 'inherit' : theme.fontFamily,
              fontSize: theme.fontSize === 'small' ? '14px' : theme.fontSize === 'large' ? '18px' : '16px',
            }}
          >
            <h2 style={{ fontSize: theme.fontSize === 'small' ? '1.5rem' : theme.fontSize === 'large' ? '2.5rem' : '2rem' }}>
              Your Business Name
            </h2>
            <p>This is how your text will look with the selected theme.</p>
            <div className="flex gap-3">
              <button
                style={{
                  backgroundColor: theme.primaryColor,
                  color: '#ffffff',
                  padding: theme.spacing === 'small' ? '0.5rem 1rem' : theme.spacing === 'large' ? '1rem 2rem' : '0.75rem 1.5rem',
                  borderRadius: theme.borderRadius === 'none' ? '0' : theme.borderRadius === 'large' ? '1rem' : '0.375rem',
                }}
              >
                Primary Button
              </button>
              <a href="#" style={{ color: theme.primaryColor }}>
                Link Example
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        <Save className="mr-2 h-4 w-4" />
        Save Theme
      </Button>
    </div>
  );
}