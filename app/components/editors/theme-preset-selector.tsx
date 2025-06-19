"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdvancedThemeConfig } from "@/types/theme-config";
import { toast } from "sonner";

interface ThemePresetSelectorProps {
  businessId: Id<"businesses">;
  currentThemeId?: Id<"themes">;
  onSelect: (theme: AdvancedThemeConfig) => void;
  className?: string;
}

export function ThemePresetSelector({ 
  businessId: _businessId, 
  currentThemeId,
  onSelect,
  className 
}: ThemePresetSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Get all available themes
  const themes = useQuery(api.themes.getPresetThemes);
  
  // Get theme suggestions based on business
  // const suggestThemes = useMutation(api.themeSuggestions.suggestThemes);
  const [suggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Theme categories
  const categories = [
    { id: "all", label: "All Themes", icon: Palette },
    { id: "suggested", label: "AI Suggested", icon: Sparkles },
    { id: "modern", label: "Modern" },
    { id: "classic", label: "Classic" },
    { id: "minimal", label: "Minimal" },
    { id: "bold", label: "Bold" },
  ];
  
  // Load AI suggestions
  const loadSuggestions = async () => {
    // TODO: Implement theme suggestions
    setIsLoadingSuggestions(false);
    toast.info("AI suggestions coming soon!");
  };
  
  // Filter themes based on category
  interface ThemeDoc {
    _id: string;
    name: string;
    description?: string;
    isPreset?: boolean;
    tags?: string[];
    config: {
      colors?: {
        light?: {
          primary?: string;
          secondary?: string;
          accent?: string;
          background?: string;
          foreground?: string;
          muted?: string;
          mutedForeground?: string;
        };
      };
      typography?: {
        fontFamilyBase?: string;
        fontFamilyHeading?: string;
      };
    };
  }
  
  const filteredThemes = themes?.filter((theme: ThemeDoc) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "suggested") return suggestions.includes(theme._id);
    return theme.tags?.includes(selectedCategory);
  }) || [];
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Category Tabs */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (category.id === "suggested" && suggestions.length === 0) {
                  loadSuggestions();
                } else {
                  setSelectedCategory(category.id);
                }
              }}
              disabled={category.id === "suggested" && isLoadingSuggestions}
              className="gap-2"
            >
              {category.icon && <category.icon className="h-3 w-3" />}
              {category.label}
              {category.id === "suggested" && suggestions.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 h-5">
                  {suggestions.length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Theme Grid */}
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredThemes.map((theme: ThemeDoc) => (
            <Card 
              key={theme._id}
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all hover:shadow-lg",
                currentThemeId === theme._id && "ring-2 ring-primary"
              )}
              onClick={() => onSelect(theme.config as AdvancedThemeConfig)}
            >
              {/* Color Preview Bar */}
              <div className="h-2 flex">
                <div 
                  className="flex-1"
                  style={{ backgroundColor: theme.config.colors?.light?.primary }}
                />
                <div 
                  className="flex-1"
                  style={{ backgroundColor: theme.config.colors?.light?.secondary }}
                />
                <div 
                  className="flex-1"
                  style={{ backgroundColor: theme.config.colors?.light?.accent }}
                />
                <div 
                  className="flex-1"
                  style={{ backgroundColor: theme.config.colors?.light?.background }}
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{theme.name}</h3>
                    {theme.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {theme.description}
                      </p>
                    )}
                  </div>
                  {currentThemeId === theme._id && (
                    <div className="ml-2">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
                
                {/* Theme Details */}
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {theme.config.typography?.fontFamilyBase || "Inter"}
                  </Badge>
                  {theme.isPreset && (
                    <Badge variant="secondary" className="text-xs">
                      Preset
                    </Badge>
                  )}
                  {suggestions.includes(theme._id) && (
                    <Badge className="text-xs gap-1">
                      <Sparkles className="h-3 w-3" />
                      Suggested
                    </Badge>
                  )}
                </div>
                
                {/* Quick Preview */}
                <div className="mt-3 p-3 rounded-md" style={{
                  backgroundColor: theme.config.colors?.light?.muted,
                  color: theme.config.colors?.light?.foreground
                }}>
                  <div 
                    className="text-xs font-medium mb-1"
                    style={{ 
                      fontFamily: theme.config.typography?.fontFamilyHeading,
                      color: theme.config.colors?.light?.primary
                    }}
                  >
                    Sample Heading
                  </div>
                  <div 
                    className="text-xs"
                    style={{ 
                      fontFamily: theme.config.typography?.fontFamilyBase,
                      color: theme.config.colors?.light?.mutedForeground
                    }}
                  >
                    This is how your content will look
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredThemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedCategory === "suggested" && !isLoadingSuggestions
                ? "Click to get AI-powered theme suggestions"
                : "No themes found in this category"}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}