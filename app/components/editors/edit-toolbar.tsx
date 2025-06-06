"use client";

import { Button } from "@/components/ui/button";
import { useEditMode } from "@/components/providers/edit-mode-provider";
import { 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Upload, 
  Loader2,
  AlertCircle 
} from "lucide-react";

export function EditToolbar() {
  const {
    isEditMode,
    setEditMode,
    saveDraft,
    publishDraft,
    discardDraft,
    hasUnsavedChanges,
    isSaving,
    isPublishing,
  } = useEditMode();

  if (!isEditMode) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setEditMode(true)}
          size="lg"
          className="shadow-lg"
        >
          <Eye className="mr-2 h-4 w-4" />
          Edit Mode
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(false)}
          >
            <EyeOff className="mr-2 h-4 w-4" />
            Exit Edit Mode
          </Button>
          
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Unsaved changes
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={discardDraft}
            disabled={!hasUnsavedChanges || isSaving || isPublishing}
          >
            <X className="mr-2 h-4 w-4" />
            Discard
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={saveDraft}
            disabled={!hasUnsavedChanges || isSaving || isPublishing}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
          
          <Button
            size="sm"
            onClick={publishDraft}
            disabled={isSaving || isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}