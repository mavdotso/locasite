"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  Eye, 
  Save,
  Undo,
  Redo,
  ChevronRight,
  ChevronDown,
  Layers,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdvancedThemeConfig } from "@/types/theme-config";
import { ModernTheme } from "@/types/simple-theme";
import { ThemePresetSelector } from "./theme-preset-selector";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";

interface ThemeEditorProps {
  theme: AdvancedThemeConfig | ModernTheme;
  onChange: (theme: AdvancedThemeConfig | ModernTheme) => void;
  onSave?: () => void;
  previewUrl?: string;
  businessName?: string;
  businessId?: Id<"businesses">;
}

// Helper to check if theme is AdvancedThemeConfig
function isAdvancedTheme(theme: unknown): theme is AdvancedThemeConfig {
  const t = theme as Record<string, unknown>;
  return !!(t && typeof t.id === 'string' && t.colors && t.typography);
}

// Color palette presets
const colorPalettes = [
  {
    name: "Ocean Breeze",
    colors: { primary: "#0ea5e9", secondary: "#06b6d4", accent: "#0284c7", background: "#f0f9ff" }
  },
  {
    name: "Forest Green", 
    colors: { primary: "#10b981", secondary: "#059669", accent: "#047857", background: "#f0fdf4" }
  },
  {
    name: "Sunset Orange",
    colors: { primary: "#f97316", secondary: "#fb923c", accent: "#ea580c", background: "#fff7ed" }
  },
  {
    name: "Royal Purple",
    colors: { primary: "#8b5cf6", secondary: "#a78bfa", accent: "#7c3aed", background: "#faf5ff" }
  },
  {
    name: "Rose Gold",
    colors: { primary: "#f43f5e", secondary: "#fb7185", accent: "#e11d48", background: "#fff1f2" }
  }
];

// Font combinations
const fontCombinations = [
  { name: "Modern Sans", heading: "Inter", body: "Inter" },
  { name: "Classic Serif", heading: "Playfair Display", body: "Georgia" },
  { name: "Tech Stack", heading: "Space Grotesk", body: "Inter" },
  { name: "Editorial", heading: "Merriweather", body: "Open Sans" },
  { name: "Friendly", heading: "Poppins", body: "Roboto" }
];

export default function ThemeEditor({ 
  theme, 
  onChange, 
  onSave, 
  previewUrl, 
  businessName = "Your Business",
  businessId
}: ThemeEditorProps) {
  const [activeTab, setActiveTab] = useState("colors");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: true,
    semantic: false,
    ui: false,
    state: false
  });
  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [history, setHistory] = useState<(AdvancedThemeConfig | ModernTheme)[]>([theme]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showPresetSelector, setShowPresetSelector] = useState(false);

  // Convert ModernTheme to AdvancedThemeConfig format for editing
  const [editingTheme, setEditingTheme] = useState<AdvancedThemeConfig>(() => {
    if (isAdvancedTheme(theme)) {
      return theme;
    } else {
      // Convert ModernTheme to AdvancedThemeConfig
      return {
        id: "custom",
        name: "Custom Theme",
        version: "1.0.0",
        darkMode: false,
        colors: {
          light: {
            primary: theme.brandColor,
            primaryForeground: "#ffffff",
            secondary: theme.secondaryButtonColor,
            secondaryForeground: theme.textColor,
            accent: theme.linkColor,
            accentForeground: "#ffffff",
            background: theme.backgroundColor,
            foreground: theme.textColor,
            card: theme.backgroundColor,
            cardForeground: theme.textColor,
            popover: theme.backgroundColor,
            popoverForeground: theme.textColor,
            muted: theme.sectionBackgroundColor,
            mutedForeground: theme.textColor,
            border: "#e5e7eb",
            input: "#e5e7eb",
            ring: theme.brandColor,
            destructive: "#ef4444",
            destructiveForeground: "#ffffff",
            success: "#10b981",
            successForeground: "#ffffff",
            warning: "#f59e0b",
            warningForeground: "#ffffff",
            info: "#3b82f6",
            infoForeground: "#ffffff"
          }
        },
        typography: {
          fontFamilyBase: theme.fontFamily || "Inter",
          fontFamilyHeading: theme.fontFamily || "Inter",
          fontFamilyMonospace: "Fira Code",
          fontSize: {
            xs: "0.75rem",
            sm: "0.875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.25rem",
            xl2: "1.5rem",
            xl3: "1.875rem",
            xl4: "2.25rem",
            xl5: "3rem",
            xl6: "3.75rem",
            xl7: "4.5rem",
            xl8: "6rem",
            xl9: "8rem"
          },
          fontWeight: {
            thin: 100,
            extralight: 200,
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900
          },
          lineHeight: {
            none: "1",
            tight: "1.25",
            snug: "1.375",
            normal: "1.5",
            relaxed: "1.625",
            loose: "2"
          },
          letterSpacing: {
            tighter: "-0.05em",
            tight: "-0.025em",
            normal: "0em",
            wide: "0.025em",
            wider: "0.05em",
            widest: "0.1em"
          }
        },
        spacing: {
          spacing: {
            s0: "0px",
            s0_5: "2px",
            s1: "4px",
            s1_5: "6px",
            s2: "8px",
            s2_5: "10px",
            s3: "12px",
            s3_5: "14px",
            s4: "16px",
            s5: "20px",
            s6: "24px",
            s7: "28px",
            s8: "32px",
            s9: "36px",
            s10: "40px",
            s11: "44px",
            s12: "48px",
            s14: "56px",
            s16: "64px",
            s20: "80px",
            s24: "96px",
            s28: "112px",
            s32: "128px",
            s36: "144px",
            s40: "160px",
            s44: "176px",
            s48: "192px",
            s52: "208px",
            s56: "224px",
            s60: "240px",
            s64: "256px",
            s72: "288px",
            s80: "320px",
            s96: "384px"
          },
          container: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            xl2: "1536px",
            full: "100%"
          },
          sectionSpacing: {
            none: "0px",
            sm: "32px",
            md: "64px",
            lg: "96px",
            xl: "128px",
            xl2: "160px"
          }
        },
        effects: {
          borderRadius: {
            none: "0px",
            sm: "2px",
            base: "4px",
            md: "6px",
            lg: "8px",
            xl: "12px",
            xl2: "16px",
            xl3: "24px",
            full: "9999px"
          },
          boxShadow: {
            none: "none",
            sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            xl2: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"
          },
          transition: {
            none: "none",
            all: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
            colors: "color, background-color, border-color, text-decoration-color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)",
            shadow: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
            transform: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)"
          },
          animation: {
            none: "none",
            spin: "spin 1s linear infinite",
            ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
            pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            bounce: "bounce 1s infinite",
            fadeIn: "fadeIn 0.5s ease-in-out",
            fadeOut: "fadeOut 0.5s ease-in-out",
            slideUp: "slideUp 0.3s ease-out",
            slideDown: "slideDown 0.3s ease-out"
          }
        },
        components: {
          button: {
            variants: {
              primary: {
                base: "bg-primary text-primary-foreground hover:bg-primary/90",
                hover: "hover:bg-primary/90",
                active: "active:bg-primary/80",
                disabled: "disabled:opacity-50 disabled:cursor-not-allowed"
              },
              secondary: {
                base: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                hover: "hover:bg-secondary/80",
                active: "active:bg-secondary/70",
                disabled: "disabled:opacity-50 disabled:cursor-not-allowed"
              },
              outline: {
                base: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                hover: "hover:bg-accent hover:text-accent-foreground",
                active: "active:bg-accent/90",
                disabled: "disabled:opacity-50 disabled:cursor-not-allowed"
              },
              ghost: {
                base: "hover:bg-accent hover:text-accent-foreground",
                hover: "hover:bg-accent hover:text-accent-foreground",
                active: "active:bg-accent/90",
                disabled: "disabled:opacity-50 disabled:cursor-not-allowed"
              }
            },
            sizes: {
              sm: {
                padding: "px-3 py-1",
                fontSize: "text-sm",
                height: "h-8"
              },
              md: {
                padding: "px-4 py-2",
                fontSize: "text-base",
                height: "h-10"
              },
              lg: {
                padding: "px-6 py-3",
                fontSize: "text-lg",
                height: "h-12"
              }
            },
            borderRadius: theme.borderRadius === "small" ? "4px" : theme.borderRadius === "medium" ? "8px" : "12px",
            fontWeight: "500",
            transition: "all 150ms"
          },
          link: {
            base: "text-primary underline-offset-4",
            hover: "hover:underline",
            visited: "visited:text-primary/80",
            underline: false,
            transition: "all 150ms"
          },
          card: {
            borderRadius: "8px",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            padding: "24px",
            borderWidth: "1px",
            borderColor: "border"
          },
          input: {
            borderRadius: "4px",
            borderWidth: "1px",
            borderColor: "border",
            focusBorderColor: "ring",
            padding: "8px 12px",
            fontSize: "14px",
            transition: "all 150ms"
          }
        },
        sections: {
          hero: {
            minHeight: "500px",
            padding: "80px 0",
            textAlign: "center",
            overlayOpacity: 0.5
          },
          about: {
            padding: "64px 0",
            maxWidth: "800px",
            textAlign: "left"
          },
          gallery: {
            padding: "64px 0",
            gridCols: 3,
            gap: "24px",
            aspectRatio: "square"
          },
          contact: {
            padding: "64px 0",
            layout: "split",
            formWidth: "500px"
          },
          reviews: {
            padding: "64px 0",
            layout: "grid",
            itemsPerRow: 3
          }
        }
      };
    }
  });

  // Update history when theme changes
  const updateTheme = (updates: Partial<AdvancedThemeConfig>) => {
    const newTheme = { ...editingTheme, ...updates };
    setEditingTheme(newTheme);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTheme);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Notify parent
    onChange(newTheme);
  };

  // Undo/Redo functions
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = () => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEditingTheme(history[newIndex] as AdvancedThemeConfig);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEditingTheme(history[newIndex] as AdvancedThemeConfig);
      onChange(history[newIndex]);
    }
  };

  // Color picker component
  const ColorPicker = ({ 
    label, 
    value, 
    onChange,
    description 
  }: { 
    label: string; 
    value: string; 
    onChange: (color: string) => void;
    description?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 px-3 py-2"
          >
            <div 
              className="h-5 w-5 rounded border border-border"
              style={{ backgroundColor: value }}
            />
            <span className="flex-1 text-left font-mono text-sm">{value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <HexColorPicker color={value} onChange={onChange} />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2"
            placeholder="#000000"
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  // Section header component
  const SectionHeader = ({ 
    title, 
    sectionKey,
    icon: Icon 
  }: { 
    title: string; 
    sectionKey: string;
    icon: React.ElementType;
  }) => (
    <button
      onClick={() => setExpandedSections(prev => ({ 
        ...prev, 
        [sectionKey]: !prev[sectionKey] 
      }))}
      className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{title}</span>
      </div>
      {expandedSections[sectionKey] ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="flex h-full">
      {/* Editor Panel */}
      <div className="w-[400px] border-r border-border bg-background">
        <div className="sticky top-0 z-10 border-b border-border bg-background p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{businessName} Theme</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPresetSelector(true)}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Presets
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
              {onSave && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onSave}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors" className="gap-1">
                <Palette className="h-3 w-3" />
                <span className="hidden sm:inline">Colors</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="gap-1">
                <Type className="h-3 w-3" />
                <span className="hidden sm:inline">Fonts</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="gap-1">
                <Layout className="h-3 w-3" />
                <span className="hidden sm:inline">Layout</span>
              </TabsTrigger>
              <TabsTrigger value="effects" className="gap-1">
                <Sparkles className="h-3 w-3" />
                <span className="hidden sm:inline">Effects</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4">
            <TabsContent value="colors" className="mt-0 space-y-4">
              {/* Quick Palettes */}
              <Card className="p-4">
                <h3 className="font-medium mb-3">Quick Palettes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {colorPalettes.map((palette) => (
                    <button
                      key={palette.name}
                      onClick={() => {
                        updateTheme({
                          colors: {
                            ...editingTheme.colors,
                            light: {
                              ...editingTheme.colors.light,
                              primary: palette.colors.primary,
                              secondary: palette.colors.secondary,
                              accent: palette.colors.accent,
                              background: palette.colors.background
                            }
                          }
                        });
                        toast.success(`Applied ${palette.name} palette`);
                      }}
                      className="flex items-center gap-2 p-2 rounded-md border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex gap-1">
                        {Object.values(palette.colors).slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="h-4 w-4 rounded-full border border-border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm">{palette.name}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Brand Colors */}
              <Card className="overflow-hidden">
                <SectionHeader title="Brand Colors" sectionKey="brand" icon={Palette} />
                <AnimatePresence>
                  {expandedSections.brand && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 space-y-3"
                    >
                      <ColorPicker
                        label="Primary"
                        value={editingTheme.colors.light.primary}
                        onChange={(color) => updateTheme({
                          colors: {
                            ...editingTheme.colors,
                            light: {
                              ...editingTheme.colors.light,
                              primary: color
                            }
                          }
                        })}
                        description="Main brand color"
                      />
                      <ColorPicker
                        label="Secondary"
                        value={editingTheme.colors.light.secondary}
                        onChange={(color) => updateTheme({
                          colors: {
                            ...editingTheme.colors,
                            light: {
                              ...editingTheme.colors.light,
                              secondary: color
                            }
                          }
                        })}
                        description="Supporting color"
                      />
                      <ColorPicker
                        label="Accent"
                        value={editingTheme.colors.light.accent}
                        onChange={(color) => updateTheme({
                          colors: {
                            ...editingTheme.colors,
                            light: {
                              ...editingTheme.colors.light,
                              accent: color
                            }
                          }
                        })}
                        description="Highlight color"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Semantic Colors */}
              <Card className="overflow-hidden">
                <SectionHeader title="Semantic Colors" sectionKey="semantic" icon={Layers} />
                <AnimatePresence>
                  {expandedSections.semantic && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 space-y-3"
                    >
                      <ColorPicker
                        label="Background"
                        value={editingTheme.colors.light.background}
                        onChange={(color) => updateTheme({
                          colors: {
                            ...editingTheme.colors,
                            light: {
                              ...editingTheme.colors.light,
                              background: color
                            }
                          }
                        })}
                      />
                      <ColorPicker
                        label="Foreground"
                        value={editingTheme.colors.light.foreground}
                        onChange={(color) => updateTheme({
                          colors: {
                            ...editingTheme.colors,
                            light: {
                              ...editingTheme.colors.light,
                              foreground: color
                            }
                          }
                        })}
                      />
                      <ColorPicker
                        label="Muted"
                        value={editingTheme.colors.light.muted}
                        onChange={(color) => updateTheme({
                          colors: {
                            ...editingTheme.colors,
                            light: {
                              ...editingTheme.colors.light,
                              muted: color
                            }
                          }
                        })}
                      />
                      <ColorPicker
                        label="Border"
                        value={editingTheme.colors.light.border}
                        onChange={(color) => updateTheme({
                          colors: {
                            ...editingTheme.colors,
                            light: {
                              ...editingTheme.colors.light,
                              border: color
                            }
                          }
                        })}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="mt-0 space-y-4">
              {/* Font Combinations */}
              <Card className="p-4">
                <h3 className="font-medium mb-3">Font Combinations</h3>
                <div className="space-y-2">
                  {fontCombinations.map((combo) => (
                    <button
                      key={combo.name}
                      onClick={() => {
                        updateTheme({
                          typography: {
                            ...editingTheme.typography,
                            fontFamilyBase: combo.body,
                            fontFamilyHeading: combo.heading
                          }
                        });
                        toast.success(`Applied ${combo.name} fonts`);
                      }}
                      className="w-full p-3 rounded-md border border-border hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="font-medium" style={{ fontFamily: combo.heading }}>
                        {combo.name}
                      </div>
                      <div className="text-sm text-muted-foreground" style={{ fontFamily: combo.body }}>
                        {combo.heading} / {combo.body}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Custom Fonts */}
              <Card className="p-4 space-y-4">
                <h3 className="font-medium">Custom Fonts</h3>
                
                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <Select
                    value={editingTheme.typography.fontFamilyHeading}
                    onValueChange={(value) => updateTheme({
                      typography: {
                        ...editingTheme.typography,
                        fontFamilyHeading: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Merriweather">Merriweather</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Select
                    value={editingTheme.typography.fontFamilyBase}
                    onValueChange={(value) => updateTheme({
                      typography: {
                        ...editingTheme.typography,
                        fontFamilyBase: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Merriweather">Merriweather</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Base Font Size</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[parseInt(editingTheme.typography.fontSize.base)]}
                      onValueChange={([value]) => updateTheme({
                        typography: {
                          ...editingTheme.typography,
                          fontSize: {
                            ...editingTheme.typography.fontSize,
                            base: `${value}px`
                          }
                        }
                      })}
                      min={12}
                      max={20}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {editingTheme.typography.fontSize.base}
                    </span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="mt-0 space-y-4">
              <Card className="p-4 space-y-4">
                <h3 className="font-medium">Spacing</h3>
                
                <div className="space-y-2">
                  <Label>Section Spacing</Label>
                  <Select
                    value={editingTheme.spacing.sectionSpacing.md}
                    onValueChange={(value) => updateTheme({
                      spacing: {
                        ...editingTheme.spacing,
                        sectionSpacing: {
                          ...editingTheme.spacing.sectionSpacing,
                          md: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="32px">Compact (32px)</SelectItem>
                      <SelectItem value="64px">Normal (64px)</SelectItem>
                      <SelectItem value="96px">Relaxed (96px)</SelectItem>
                      <SelectItem value="128px">Spacious (128px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Container Width</Label>
                  <Select
                    value={editingTheme.spacing.container.xl}
                    onValueChange={(value) => updateTheme({
                      spacing: {
                        ...editingTheme.spacing,
                        container: {
                          ...editingTheme.spacing.container,
                          xl: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024px">Narrow (1024px)</SelectItem>
                      <SelectItem value="1280px">Normal (1280px)</SelectItem>
                      <SelectItem value="1536px">Wide (1536px)</SelectItem>
                      <SelectItem value="100%">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <h3 className="font-medium">Sections</h3>
                
                <div className="space-y-2">
                  <Label>Hero Height</Label>
                  <Select
                    value={editingTheme.sections.hero.minHeight}
                    onValueChange={(value) => updateTheme({
                      sections: {
                        ...editingTheme.sections,
                        hero: {
                          ...editingTheme.sections.hero,
                          minHeight: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400px">Small (400px)</SelectItem>
                      <SelectItem value="500px">Medium (500px)</SelectItem>
                      <SelectItem value="600px">Large (600px)</SelectItem>
                      <SelectItem value="100vh">Full Screen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Gallery Layout</Label>
                  <Select
                    value={editingTheme.sections.gallery.gridCols.toString()}
                    onValueChange={(value) => updateTheme({
                      sections: {
                        ...editingTheme.sections,
                        gallery: {
                          ...editingTheme.sections.gallery,
                          gridCols: parseInt(value)
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                      <SelectItem value="5">5 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="effects" className="mt-0 space-y-4">
              <Card className="p-4 space-y-4">
                <h3 className="font-medium">Border Radius</h3>
                
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(editingTheme.effects.borderRadius).slice(0, 6).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => updateTheme({
                        components: {
                          ...editingTheme.components,
                          button: {
                            ...editingTheme.components.button,
                            borderRadius: value
                          },
                          card: {
                            ...editingTheme.components.card,
                            borderRadius: value
                          }
                        }
                      })}
                      className={cn(
                        "p-3 rounded-md border border-border hover:bg-muted/50 transition-colors",
                        editingTheme.components.button.borderRadius === value && "bg-muted"
                      )}
                    >
                      <div 
                        className="h-8 w-full bg-primary mb-1"
                        style={{ borderRadius: value }}
                      />
                      <span className="text-xs capitalize">{key}</span>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <h3 className="font-medium">Shadows</h3>
                
                <div className="space-y-2">
                  <Label>Card Shadow</Label>
                  <Select
                    value={editingTheme.components.card.boxShadow}
                    onValueChange={(value) => updateTheme({
                      components: {
                        ...editingTheme.components,
                        card: {
                          ...editingTheme.components.card,
                          boxShadow: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(editingTheme.effects.boxShadow).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {key === "none" ? "None" : key.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Animations</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable animations</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </ScrollArea>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 bg-muted/30">
        <div className="sticky top-0 z-10 border-b border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="font-medium">Live Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={devicePreview === "desktop" ? "default" : "ghost"}
                size="icon"
                onClick={() => setDevicePreview("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={devicePreview === "tablet" ? "default" : "ghost"}
                size="icon"
                onClick={() => setDevicePreview("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={devicePreview === "mobile" ? "default" : "ghost"}
                size="icon"
                onClick={() => setDevicePreview("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div 
            className={cn(
              "mx-auto transition-all duration-300",
              devicePreview === "mobile" && "max-w-[375px]",
              devicePreview === "tablet" && "max-w-[768px]",
              devicePreview === "desktop" && "max-w-[1200px]"
            )}
          >
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-[calc(100vh-200px)] rounded-lg border border-border shadow-lg"
                title="Theme Preview"
              />
            ) : (
              <Card className="p-8">
                <div className="space-y-6">
                  {/* Sample content showing theme */}
                  <div>
                    <h1 
                      className="text-3xl font-bold mb-2"
                      style={{ 
                        color: editingTheme.colors.light.foreground,
                        fontFamily: editingTheme.typography.fontFamilyHeading 
                      }}
                    >
                      {businessName}
                    </h1>
                    <p 
                      style={{ 
                        color: editingTheme.colors.light.mutedForeground,
                        fontFamily: editingTheme.typography.fontFamilyBase
                      }}
                    >
                      Experience the best service in town
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="px-4 py-2 rounded transition-all"
                      style={{
                        backgroundColor: editingTheme.colors.light.primary,
                        color: editingTheme.colors.light.primaryForeground,
                        borderRadius: editingTheme.components.button.borderRadius
                      }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-4 py-2 rounded transition-all"
                      style={{
                        backgroundColor: editingTheme.colors.light.secondary,
                        color: editingTheme.colors.light.secondaryForeground,
                        borderRadius: editingTheme.components.button.borderRadius
                      }}
                    >
                      Secondary Button
                    </button>
                  </div>

                  <div 
                    className="p-6 rounded"
                    style={{
                      backgroundColor: editingTheme.colors.light.muted,
                      borderRadius: editingTheme.components.card.borderRadius,
                      boxShadow: editingTheme.components.card.boxShadow
                    }}
                  >
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ 
                        color: editingTheme.colors.light.foreground,
                        fontFamily: editingTheme.typography.fontFamilyHeading
                      }}
                    >
                      Featured Section
                    </h3>
                    <p 
                      style={{ 
                        color: editingTheme.colors.light.mutedForeground,
                        fontFamily: editingTheme.typography.fontFamilyBase
                      }}
                    >
                      This is how your content will look with the current theme settings.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Preset Selector Dialog */}
      <Dialog open={showPresetSelector} onOpenChange={setShowPresetSelector}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Choose a Theme Preset</DialogTitle>
          </DialogHeader>
          {businessId && (
            <ThemePresetSelector
              businessId={businessId}
              onSelect={(preset) => {
                updateTheme(preset);
                setShowPresetSelector(false);
                toast.success("Theme preset applied!");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}