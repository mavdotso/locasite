"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ThemeSchema } from "@/types/theme";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Slider } from "@/app/components/ui/slider";
import { HexColorPicker } from "react-colorful";
import { Eye, Save, Undo, Moon, Sun, Palette, Type, Layout, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ThemePreview } from "./theme-preview";
import { ComponentStyleEditor } from "./component-style-editor";

interface AdvancedThemeEditorProps {
  businessId: Id<"businesses">;
  onSave?: () => void;
}

export function AdvancedThemeEditor({ businessId, onSave }: AdvancedThemeEditorProps) {
  const business = useQuery(api.businesses.getBusiness, { businessId });
  const presetThemes = useQuery(api.themes.getPresetThemes);
  const currentTheme = useQuery(
    api.themes.getTheme,
    business?.themeId ? { themeId: business.themeId } : "skip"
  );
  
  const applyTheme = useMutation(api.themes.applyThemeToBusiness);
  const createTheme = useMutation(api.themes.createTheme);
  const updateTheme = useMutation(api.themes.updateTheme);

  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customTheme, setCustomTheme] = useState<Partial<ThemeSchema>>({});
  const [activeTab, setActiveTab] = useState("presets");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Initialize custom theme from current theme
  useEffect(() => {
    if (currentTheme) {
      setCustomTheme(currentTheme.config as unknown as ThemeSchema);
    }
  }, [currentTheme]);

  const handlePresetSelect = async (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = presetThemes?.find(p => p.presetId === presetId);
    if (preset) {
      try {
        await applyTheme({
          businessId,
          themeId: preset._id,
        });
        toast.success("Theme applied successfully!");
        onSave?.();
      } catch (error) {
        toast.error("Failed to apply theme");
      }
    }
  };

  const handleColorChange = (section: string, colorKey: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [isDarkMode ? 'dark' : 'light']: {
          ...(prev.colors?.[isDarkMode ? 'dark' : 'light'] || {}),
          [colorKey]: value,
        },
      },
    }));
  };

  const handleTypographyChange = (key: string, value: string | number) => {
    setCustomTheme(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value,
      },
    }));
  };

  const handleSpacingChange = (section: string, key: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [section]: {
          ...(prev.spacing?.[section as keyof typeof prev.spacing] || {}),
          [key]: value,
        },
      },
    }));
  };

  const handleSaveCustomTheme = async () => {
    try {
      if (!customTheme.name) {
        toast.error("Please provide a theme name");
        return;
      }

      const themeId = await createTheme({
        name: customTheme.name,
        description: customTheme.description,
        config: customTheme as ThemeSchema,
        businessId,
        isPublic: false,
      });

      await applyTheme({
        businessId,
        themeId,
      });

      toast.success("Custom theme saved and applied!");
      onSave?.();
    } catch (error) {
      toast.error("Failed to save theme");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Theme Editor</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button onClick={handleSaveCustomTheme}>
            <Save className="mr-2 h-4 w-4" />
            Save Theme
          </Button>
        </div>
      </div>

      <div className={cn("grid gap-6", showPreview && "lg:grid-cols-2")}>
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="presets">
            <Palette className="mr-2 h-4 w-4" />
            Presets
          </TabsTrigger>
          <TabsTrigger value="colors">
            <Palette className="mr-2 h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="mr-2 h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="spacing">
            <Layout className="mr-2 h-4 w-4" />
            Spacing
          </TabsTrigger>
          <TabsTrigger value="effects">
            <Sparkles className="mr-2 h-4 w-4" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="components">
            <Layout className="mr-2 h-4 w-4" />
            Components
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {presetThemes?.map((preset) => (
              <Card
                key={preset._id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  selectedPreset === preset.presetId && "ring-2 ring-primary"
                )}
                onClick={() => handlePresetSelect(preset.presetId || "")}
              >
                <CardHeader>
                  <CardTitle>{preset.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{preset.description}</p>
                  <div className="mt-4 flex gap-2">
                    {preset.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-2 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(customTheme.colors?.[isDarkMode ? 'dark' : 'light'] || {}).map(
                ([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{key}</Label>
                    <div className="flex gap-2">
                      <Input
                        id={key}
                        value={value}
                        onChange={(e) => handleColorChange('colors', key, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setColorPickerOpen(colorPickerOpen === key ? null : key)}
                        style={{ backgroundColor: value }}
                      />
                    </div>
                    {colorPickerOpen === key && (
                      <div className="absolute z-10 mt-2">
                        <HexColorPicker
                          color={value}
                          onChange={(color) => handleColorChange('colors', key, color)}
                        />
                      </div>
                    )}
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Base Font Family</Label>
                  <Select
                    value={customTheme.typography?.fontFamilyBase}
                    onValueChange={(value) => handleTypographyChange('fontFamilyBase', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, system-ui, sans-serif">Inter</SelectItem>
                      <SelectItem value="Roboto, system-ui, sans-serif">Roboto</SelectItem>
                      <SelectItem value="Open Sans, sans-serif">Open Sans</SelectItem>
                      <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                      <SelectItem value="Playfair Display, serif">Playfair Display</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="Menlo, monospace">Menlo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Heading Font Family</Label>
                  <Select
                    value={customTheme.typography?.fontFamilyHeading}
                    onValueChange={(value) => handleTypographyChange('fontFamilyHeading', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, system-ui, sans-serif">Inter</SelectItem>
                      <SelectItem value="Roboto, system-ui, sans-serif">Roboto</SelectItem>
                      <SelectItem value="Open Sans, sans-serif">Open Sans</SelectItem>
                      <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                      <SelectItem value="Playfair Display, serif">Playfair Display</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Font Sizes</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(customTheme.typography?.fontSize || {}).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label>{key}</Label>
                      <Input
                        value={value}
                        onChange={(e) =>
                          handleTypographyChange(`fontSize.${key}`, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spacing & Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Container Sizes</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(customTheme.spacing?.container || {}).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label>{key}</Label>
                      <Input
                        value={value}
                        onChange={(e) => handleSpacingChange('container', key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Section Spacing</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(customTheme.spacing?.sectionSpacing || {}).map(
                    ([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label>{key}</Label>
                        <Input
                          value={value}
                          onChange={(e) =>
                            handleSpacingChange('sectionSpacing', key, e.target.value)
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Border Radius</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(customTheme.effects?.borderRadius || {}).map(
                    ([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label>{key}</Label>
                        <Input
                          value={value}
                          onChange={(e) =>
                            setCustomTheme(prev => ({
                              ...prev,
                              effects: {
                                ...prev.effects,
                                borderRadius: {
                                  ...prev.effects?.borderRadius,
                                  [key]: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Box Shadows</h4>
                <div className="space-y-4">
                  {Object.entries(customTheme.effects?.boxShadow || {}).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label>{key}</Label>
                      <Input
                        value={value}
                        onChange={(e) =>
                          setCustomTheme(prev => ({
                            ...prev,
                            effects: {
                              ...prev.effects,
                              boxShadow: {
                                ...prev.effects?.boxShadow,
                                [key]: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <ComponentStyleEditor
            styles={customTheme.components || {}}
            onChange={(components) =>
              setCustomTheme(prev => ({ ...prev, components }))
            }
          />
        </TabsContent>
      </Tabs>
    </div>

    {showPreview && (
      <div className="sticky top-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              See how your theme changes affect the appearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemePreview theme={customTheme} isDarkMode={isDarkMode} />
          </CardContent>
        </Card>
      </div>
    )}
  </div>
    </div>
  );
}