"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: Id<"businesses">;
  currentThemeId?: Id<"themes">;
  onThemeSelect?: (themeId: Id<"themes">) => void;
}

export function ThemePickerModal({
  isOpen,
  onClose,
  businessId,
  currentThemeId,
  onThemeSelect,
}: ThemePickerModalProps) {
  const presetThemes = useQuery(api.themes.getPresetThemes);
  const applyTheme = useMutation(api.themes.applyThemeToBusiness);
  const [selectedThemeId, setSelectedThemeId] = useState<Id<"themes"> | null>(currentThemeId || null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyTheme = async () => {
    if (!selectedThemeId) return;
    
    setIsApplying(true);
    try {
      await applyTheme({
        businessId,
        themeId: selectedThemeId,
      });
      
      if (onThemeSelect) {
        onThemeSelect(selectedThemeId);
      }
      
      onClose();
    } catch (error) {
      console.error("Failed to apply theme:", error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Theme</DialogTitle>
          <DialogDescription>
            Select a professional theme for your business website
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {presetThemes?.map((theme) => (
            <div
              key={theme._id}
              className={cn(
                "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg",
                selectedThemeId === theme._id
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border hover:border-muted-foreground"
              )}
              onClick={() => setSelectedThemeId(theme._id)}
            >
              {selectedThemeId === theme._id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">{theme.name}</h3>
                {theme.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {theme.description}
                  </p>
                )}
                
                {/* Theme preview */}
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-md border"
                      style={{
                        backgroundColor: theme.config.colors.light.primary,
                      }}
                    />
                    <div
                      className="w-8 h-8 rounded-md border"
                      style={{
                        backgroundColor: theme.config.colors.light.secondary,
                      }}
                    />
                    <div
                      className="w-8 h-8 rounded-md border"
                      style={{
                        backgroundColor: theme.config.colors.light.accent,
                      }}
                    />
                  </div>
                  
                  {theme.config.typography && (
                    <p 
                      className="text-xs truncate"
                      style={{ fontFamily: theme.config.typography.fontFamilyBase }}
                    >
                      {theme.config.typography.fontFamilyBase}
                    </p>
                  )}
                  
                  {theme.tags && theme.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {theme.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-muted rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleApplyTheme}
            disabled={!selectedThemeId || isApplying}
          >
            {isApplying ? "Applying..." : "Apply Theme"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}