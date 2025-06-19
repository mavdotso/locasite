"use client";

import { useState } from "react";
import { Preloaded, usePreloadedQuery, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ThemeEditor from "@/app/components/editors/theme-editor";
import { ModernTheme } from "@/types/simple-theme";
import { AdvancedThemeConfig } from "@/types/theme-config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface ThemeEditorPageProps {
  businessId: Id<"businesses">;
  preloadedBusiness: Preloaded<typeof api.businesses.getById>;
}

export function ThemeEditorPage({ businessId, preloadedBusiness }: ThemeEditorPageProps) {
  const business = usePreloadedQuery(preloadedBusiness);
  const businessTheme = useQuery(
    api.themes.getById,
    business?.themeId ? { themeId: business.themeId } : "skip"
  );
  
  const updateBusiness = useMutation(api.businesses.update);
  const applyTheme = useMutation(api.themes.applyThemeToBusiness);
  const createCustomTheme = useMutation(api.themes.createTheme);
  
  // Preview URL for the business
  const domainId = business?.domainId;
  const domain = useQuery(api.domains.getById, domainId ? { id: domainId } : "skip");
  
  const [pendingTheme, setPendingTheme] = useState<AdvancedThemeConfig | ModernTheme | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!business) {
    return <div>Business not found</div>;
  }

  // Get current theme
  const getCurrentTheme = (): AdvancedThemeConfig | ModernTheme => {
    if (pendingTheme) return pendingTheme;
    
    if (business.themeId && businessTheme) {
      // Return the theme from database
      return businessTheme.config as AdvancedThemeConfig;
    }
    
    // Legacy theme
    if (business.theme?.colorScheme) {
      try {
        const themeData = JSON.parse(business.theme.colorScheme);
        if (themeData.version === "modern-v1") {
          return themeData.theme as ModernTheme;
        }
      } catch {}
    }
    
    // Default theme
    return {
      brandColor: business.theme?.primaryColor || "#00C9A8",
      primaryButtonColor: business.theme?.primaryColor || "#035C67",
      secondaryButtonColor: business.theme?.secondaryColor || "#DAF1EE",
      secondaryButtonOpacity: 100,
      textColor: "#1f2937",
      headingColor: "#111827",
      linkColor: business.theme?.primaryColor || "#00C9A8",
      backgroundColor: "#ffffff",
      sectionBackgroundColor: "#f9fafb",
      fontFamily: business.theme?.fontFamily || "Inter",
      fontSize: "normal",
      borderRadius: "small",
      spacing: "normal",
    } as ModernTheme;
  };

  const handleThemeChange = (theme: AdvancedThemeConfig | ModernTheme) => {
    setPendingTheme(theme);
  };

  const handleSave = async () => {
    if (!pendingTheme) {
      toast.info("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      // Check if this is an AdvancedThemeConfig
      const isAdvanced = 'id' in pendingTheme && 'colors' in pendingTheme && 'typography' in pendingTheme;
      
      if (isAdvanced) {
        // Create or update advanced theme
        const theme = pendingTheme as AdvancedThemeConfig;
        
        if (!business.themeId) {
          // Create a new custom theme
          const themeId = await createCustomTheme({
            name: `${business.name} Custom Theme`,
            description: `Custom theme for ${business.name}`,
            config: theme,
            businessId: business._id,
            isPublic: false,
            tags: [],
          });
          
          // Apply the theme to the business
          await applyTheme({
            businessId: business._id,
            themeId,
          });
        } else {
          // Update existing theme with overrides
          await applyTheme({
            businessId: business._id,
            themeId: business.themeId,
            themeOverrides: theme,
          });
        }
      } else {
        // Save as legacy ModernTheme
        const modernTheme = pendingTheme as ModernTheme;
        await updateBusiness({
          id: business._id,
          business: {
            theme: {
            primaryColor: modernTheme.brandColor,
            secondaryColor: modernTheme.secondaryButtonColor,
            accentColor: modernTheme.linkColor,
            fontFamily: modernTheme.fontFamily,
            colorScheme: JSON.stringify({
              version: "modern-v1",
              theme: modernTheme
            })
            }
          }
        });
      }

      toast.success("Theme saved successfully!");
      setPendingTheme(null);
    } catch (error) {
      console.error("Failed to save theme:", error);
      toast.error("Failed to save theme");
    } finally {
      setIsSaving(false);
    }
  };

  const previewUrl = domain ? `/${domain.subdomain}` : undefined;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/business/${businessId}/edit`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Theme Editor</h1>
              <p className="text-sm text-muted-foreground">{business.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPendingTheme(null)}
              disabled={!pendingTheme || isSaving}
            >
              Reset Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={!pendingTheme || isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Theme"}
            </Button>
          </div>
        </div>
      </div>

      {/* Theme Editor */}
      <div className="flex-1 overflow-hidden">
        <ThemeEditor
          theme={getCurrentTheme()}
          onChange={handleThemeChange}
          onSave={handleSave}
          previewUrl={previewUrl}
          businessName={business.name}
          businessId={businessId}
        />
      </div>
    </div>
  );
}