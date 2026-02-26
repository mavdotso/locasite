"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { ArrowLeft, Loader2, Plus, Palette, Settings } from "lucide-react";
import { toast } from "sonner";

import { SectionRenderer } from "@/app/components/simple-builder/sections/section-renderer";
import { SectionOverlay, SECTION_LABELS } from "./section-overlay";
import { EditPanel } from "./edit-panel";
import { ThemePickerSheet } from "@/app/components/preview/theme-picker-sheet";
import { Button } from "@/app/components/ui/button";
import { getVariationById } from "@/app/components/simple-builder/sections/section-variations";
import { sanitizeCssValue } from "@/app/lib/utils";
import type {
  SimplePageData,
  SectionInstance,
  SectionCategory,
  SimpleComponentData,
} from "@/app/components/simple-builder/types/simple-builder";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/** Determine the section category from its variationId */
function getCategoryFromVariationId(variationId: string): SectionCategory {
  const variation = getVariationById(variationId);
  if (variation) return variation.category;

  // Fallback: infer from the id prefix
  if (variationId.startsWith("hero")) return "hero";
  if (variationId.startsWith("about")) return "about";
  if (variationId.startsWith("services")) return "services";
  if (variationId.startsWith("gallery")) return "gallery";
  if (variationId.startsWith("contact")) return "contact";
  if (variationId.startsWith("reviews")) return "reviews";
  if (variationId.startsWith("header")) return "header";
  if (variationId.startsWith("footer")) return "footer";
  return "about"; // safe default
}

/** Section types available for "Add a section" */
const ADDABLE_SECTIONS: { category: SectionCategory; defaultVariation: string }[] = [
  { category: "hero", defaultVariation: "hero-section" },
  { category: "about", defaultVariation: "about-section" },
  { category: "services", defaultVariation: "services-3-column" },
  { category: "gallery", defaultVariation: "gallery-grid" },
  { category: "reviews", defaultVariation: "reviews-section" },
  { category: "contact", defaultVariation: "contact-form-map" },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface InlineEditorProps {
  businessId: Id<"businesses">;
  business: Doc<"businesses"> & { googleBusinessAuth?: never };
  domain: Doc<"domains"> | null;
  page: Doc<"pages"> | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InlineEditor({
  businessId,
  business,
  domain: _domain,
  page,
}: InlineEditorProps) {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const user = useQuery(api.auth.currentUser);
  const updatePage = useMutation(api.pages.updatePage);
  const publishBusiness = useMutation(api.businessPublishing.publishBusiness);
  const claimBusiness = useMutation(api.businesses.claimBusinessAfterAuth);

  // Local state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  // Parse the page content into SimplePageData
  const parsedContent = useMemo((): SimplePageData | null => {
    if (!page?.content) return null;
    try {
      const parsed = JSON.parse(page.content);
      if (parsed.mode === "simple" && Array.isArray(parsed.sections)) {
        return parsed as SimplePageData;
      }
    } catch {
      // invalid JSON
    }
    return null;
  }, [page?.content]);

  // Fallback — generate from SitePreviewFrame's resolvePageContent logic
  // For now, we just require the content to exist in simple mode
  const sections = useMemo(() => {
    if (!parsedContent) return [];
    return [...parsedContent.sections].sort((a, b) => a.order - b.order);
  }, [parsedContent]);

  // Business data for template variable replacement in preview
  const businessData: Record<string, string> = useMemo(
    () => ({
      businessName: business.name || "",
      businessAddress: business.address || "",
      businessPhone: business.phone || "",
      businessEmail: business.email ?? "",
      businessDescription: business.description || "",
      businessHours: Array.isArray(business.hours)
        ? business.hours.join(", ")
        : "",
      businessWebsite: business.website || "",
      businessPhotos: Array.isArray(business.photos)
        ? business.photos.join(",")
        : "",
      businessMainPhoto: business.photos?.[0] || "",
    }),
    [business],
  );

  // Currently editing section
  const editingSection = useMemo(
    () => sections.find((s) => s.id === editingSectionId) ?? null,
    [sections, editingSectionId],
  );

  // ------- Handlers -------

  const handleSaveSection = useCallback(
    async (updatedData: SimpleComponentData) => {
      if (!parsedContent || !page) return;

      setIsSaving(true);
      try {
        const updatedSections = parsedContent.sections.map((s) =>
          s.id === editingSectionId ? { ...s, data: updatedData } : s,
        );

        const updatedContent: SimplePageData = {
          ...parsedContent,
          sections: updatedSections,
        };

        await updatePage({
          pageId: page._id,
          content: JSON.stringify({ ...updatedContent, mode: "simple" }),
        });

        toast.success("Section saved");
        setEditingSectionId(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save";
        toast.error(msg);
      } finally {
        setIsSaving(false);
      }
    },
    [parsedContent, page, editingSectionId, updatePage],
  );

  const handleDeleteSection = useCallback(
    async (sectionId: string) => {
      if (!parsedContent || !page) return;

      const sectionToDelete = sections.find((s) => s.id === sectionId);
      if (!sectionToDelete) return;

      const category = getCategoryFromVariationId(sectionToDelete.variationId);
      const label = SECTION_LABELS[category] ?? category;

      if (!window.confirm(`Remove "${label}" section?`)) return;

      setIsSaving(true);
      try {
        const updatedSections = parsedContent.sections
          .filter((s) => s.id !== sectionId)
          .map((s, i) => ({ ...s, order: i }));

        const updatedContent: SimplePageData = {
          ...parsedContent,
          sections: updatedSections,
        };

        await updatePage({
          pageId: page._id,
          content: JSON.stringify({ ...updatedContent, mode: "simple" }),
        });

        toast.success(`${label} removed`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete section";
        toast.error(msg);
      } finally {
        setIsSaving(false);
      }
    },
    [parsedContent, page, sections, updatePage],
  );

  const handleAddSection = useCallback(
    async (category: SectionCategory, defaultVariation: string) => {
      if (!parsedContent || !page) return;

      const variation = getVariationById(defaultVariation);
      if (!variation) {
        toast.error("Could not find section template");
        return;
      }

      const newSection: SectionInstance = {
        id: generateId(),
        variationId: defaultVariation,
        order: parsedContent.sections.length,
        data: JSON.parse(JSON.stringify(variation.template)),
      };

      setIsSaving(true);
      try {
        const updatedContent: SimplePageData = {
          ...parsedContent,
          sections: [...parsedContent.sections, newSection],
        };

        await updatePage({
          pageId: page._id,
          content: JSON.stringify({ ...updatedContent, mode: "simple" }),
        });

        toast.success(`${SECTION_LABELS[category]} added`);
        setShowAddSection(false);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to add section";
        toast.error(msg);
      } finally {
        setIsSaving(false);
      }
    },
    [parsedContent, page, updatePage],
  );

  const handleGoLive = useCallback(async () => {
    if (user === null) {
      sessionStorage.setItem("claimBusinessId", businessId);
      await signIn("google");
      return;
    }
    if (user === undefined) return;

    setIsPublishing(true);
    try {
      await claimBusiness({ businessId });
      await publishBusiness({ businessId });
      router.push(`/live/${businessId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to publish";
      toast.error(msg);
    } finally {
      setIsPublishing(false);
    }
  }, [user, businessId, signIn, claimBusiness, publishBusiness, router]);

  // ------- Render -------

  // If page content is not in simple mode, show fallback
  if (!parsedContent) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-muted-foreground text-sm">
          This site does not have editable simple-mode content yet.
        </p>
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/business/${businessId}/edit`)
          }
        >
          Open full editor
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-sm border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push(`/preview/${businessId}`)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Done</span>
          </button>

          <h1 className="text-sm font-medium text-foreground truncate max-w-[40%]">
            {business.name}
          </h1>

          <Button
            size="sm"
            onClick={handleGoLive}
            disabled={isPublishing || user === undefined}
          >
            {isPublishing || user === undefined ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Go Live"
            )}
          </Button>
        </div>
      </header>

      {/* Main content — sections with overlays */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-2">
        {/* Theme CSS variables */}
        {parsedContent.theme && (
          <style jsx global>{`
            .inline-editor-preview {
              --simple-primary: ${sanitizeCssValue(parsedContent.theme.colors.primary)};
              --simple-secondary: ${sanitizeCssValue(parsedContent.theme.colors.secondary)};
              --simple-accent: ${sanitizeCssValue(parsedContent.theme.colors.accent)};
              --simple-background: ${sanitizeCssValue(parsedContent.theme.colors.background)};
              --simple-text: ${sanitizeCssValue(parsedContent.theme.colors.text)};
              --simple-muted: ${sanitizeCssValue(parsedContent.theme.colors.muted)};
              --simple-font-heading: ${sanitizeCssValue(parsedContent.theme.fonts.heading)};
              --simple-font-body: ${sanitizeCssValue(parsedContent.theme.fonts.body)};
            }
            .inline-editor-preview .simple-section {
              font-family: var(--simple-font-body);
            }
            .inline-editor-preview .simple-section h1,
            .inline-editor-preview .simple-section h2,
            .inline-editor-preview .simple-section h3,
            .inline-editor-preview .simple-section h4,
            .inline-editor-preview .simple-section h5,
            .inline-editor-preview .simple-section h6 {
              font-family: var(--simple-font-heading);
            }
          `}</style>
        )}

        <div className="inline-editor-preview rounded-xl border border-border/60 shadow-sm bg-background overflow-hidden">
          {sections.map((section) => {
            const category = getCategoryFromVariationId(section.variationId);
            return (
              <SectionOverlay
                key={section.id}
                sectionId={section.id}
                category={category}
                onEdit={() => setEditingSectionId(section.id)}
                onDelete={() => handleDeleteSection(section.id)}
              >
                <SectionRenderer
                  data={section.data}
                  businessData={businessData}
                  businessId={businessId}
                  editMode={false}
                />
              </SectionOverlay>
            );
          })}
        </div>

        {/* Add a section button */}
        <div className="relative pt-2">
          <Button
            variant="outline"
            className="w-full h-11 border-dashed"
            onClick={() => setShowAddSection(!showAddSection)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a section
          </Button>

          {/* Add section dropdown */}
          {showAddSection && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-background rounded-lg border border-border shadow-lg p-2 animate-in fade-in slide-in-from-top-1 duration-150">
              {ADDABLE_SECTIONS.map(({ category, defaultVariation }) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleAddSection(category, defaultVariation)}
                  disabled={isSaving}
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {SECTION_LABELS[category]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Secondary actions */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThemePicker(true)}
          >
            <Palette className="h-4 w-4 mr-1.5" />
            Change look
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(`/business/${businessId}/edit`)
            }
          >
            <Settings className="h-4 w-4 mr-1.5" />
            More options
          </Button>
        </div>
      </main>

      {/* Edit panel (slide-up) */}
      {editingSection && (
        <EditPanel
          section={editingSection}
          category={getCategoryFromVariationId(editingSection.variationId)}
          isOpen={editingSectionId !== null}
          isSaving={isSaving}
          onClose={() => setEditingSectionId(null)}
          onSave={handleSaveSection}
        />
      )}

      {/* Theme picker */}
      <ThemePickerSheet
        businessId={businessId}
        isOpen={showThemePicker}
        onClose={() => setShowThemePicker(false)}
      />

      {/* Dismiss add-section dropdown on outside click */}
      {showAddSection && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowAddSection(false)}
        />
      )}
    </div>
  );
}
