"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface EditModeContextType {
  isEditMode: boolean;
  setEditMode: (enabled: boolean) => void;
  businessId: Id<"businesses"> | null;
  draftData: Doc<"businesses">["draftContent"];
  updateDraft: (field: string, value: unknown) => void;
  saveDraft: () => Promise<void>;
  publishDraft: () => Promise<void>;
  discardDraft: () => Promise<void>;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isPublishing: boolean;
}

export const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within EditModeProvider");
  }
  return context;
}

interface EditModeProviderProps {
  children: React.ReactNode;
  businessId: Id<"businesses">;
  initialEditMode?: boolean;
}

export function EditModeProvider({
  children,
  businessId,
  initialEditMode = false,
}: EditModeProviderProps) {
  const [isEditMode, setEditMode] = useState(initialEditMode);
  const [draftData, setDraftData] = useState<Doc<"businesses">["draftContent"]>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch business data with draft content
  const business = useQuery(api.businesses.getByIdWithDraft, { id: businessId });

  // Mutations
  const saveDraftMutation = useMutation(api.businesses.saveDraft);
  const publishDraftMutation = useMutation(api.businesses.publishDraft);
  const discardDraftMutation = useMutation(api.businesses.discardDraft);

  // Initialize draft data when business loads
  useEffect(() => {
    if (business) {
      setDraftData({
        name: business.name,
        description: business.description,
        phone: business.phone,
        email: business.email,
        website: business.website,
        hours: business.hours,
        theme: business.theme,
      });
    }
  }, [business]);

  // Update draft data
  const updateDraft = useCallback((field: string, value: unknown) => {
    setDraftData((prev) => {
      const keys = field.split(".");
      if (keys.length > 1) {
        const newData = { ...prev };
        let current: Record<string, unknown> = newData;
  
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!current[key]) {
            current[key] = {};
          } else if (typeof current[key] === 'object' && current[key] !== null) {
            current[key] = { ...(current[key] as Record<string, unknown>) };
          }
          current = current[key] as Record<string, unknown>;
        }
  
        current[keys[keys.length - 1]] = value;
        return newData as Doc<"businesses">["draftContent"];
      }
      return { ...prev, [field]: value } as Doc<"businesses">["draftContent"];
    });
    setHasUnsavedChanges(true);
  }, []);

  // Save draft
  const saveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveDraftMutation({
        businessId,
        draftContent: draftData ?? {},
      });
      setHasUnsavedChanges(false);
      toast.success("Draft saved");
    } catch (error) {
      toast.error("Failed to save draft");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [businessId, draftData, saveDraftMutation]);

  // Publish draft
  const publishDraft = useCallback(async () => {
    setIsPublishing(true);
    try {
      // First save the draft
      await saveDraftMutation({
        businessId,
        draftContent: draftData ?? {},
      });
      
      // Then publish it
      await publishDraftMutation({ businessId });
      
      setHasUnsavedChanges(false);
      toast.success("Changes published");
    } catch (error) {
      toast.error("Failed to publish changes");
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  }, [businessId, draftData, saveDraftMutation, publishDraftMutation]);

  // Discard draft
  const discardDraft = useCallback(async () => {
    try {
      await discardDraftMutation({ businessId });
      
      // Reset draft data to original
      if (business) {
        setDraftData({
          name: business.name,
          description: business.description,
          phone: business.phone,
          email: business.email,
          website: business.website,
          hours: business.hours,
          theme: business.theme,
        });
      }
      
      setHasUnsavedChanges(false);
      toast.success("Changes discarded");
    } catch (error) {
      toast.error("Failed to discard changes");
      console.error(error);
    }
  }, [businessId, business, discardDraftMutation]);

  // Auto-save draft every 30 seconds if there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges && isEditMode) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, isEditMode, saveDraft]);

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <EditModeContext.Provider
      value={{
        isEditMode,
        setEditMode,
        businessId,
        draftData,
        updateDraft,
        saveDraft,
        publishDraft,
        discardDraft,
        hasUnsavedChanges,
        isSaving,
        isPublishing,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}