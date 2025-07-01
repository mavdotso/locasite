"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { templateMetadata, pageTemplates } from "../templates/page-templates";
import { PageData } from "../core/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PageData) => void;
  currentPageHasContent?: boolean;
}

export default function TemplateSelector({
  isOpen,
  onClose,
  onSelectTemplate,
  currentPageHasContent = false,
}: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (currentPageHasContent) {
      setShowConfirmation(true);
    } else {
      applyTemplate(templateId);
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = pageTemplates[templateId as keyof typeof pageTemplates];
    if (template) {
      onSelectTemplate(template);
      onClose();
      setShowConfirmation(false);
      setSelectedTemplate(null);
    }
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      applyTemplate(selectedTemplate);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedTemplate(null);
  };

  // Group templates by category
  const templatesByCategory = templateMetadata.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    },
    {} as Record<string, typeof templateMetadata>,
  );

  return (
    <>
      <Dialog open={isOpen && !showConfirmation} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>
              Select a pre-designed template to get started quickly. You can
              customize it after applying.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-8">
              {Object.entries(templatesByCategory).map(
                ([category, templates]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-4">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => handleSelectTemplate(template.id)}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <span className="text-3xl">{template.icon}</span>
                              <span>{template.name}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                              {template.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">Ready to use</Badge>
                              <Badge variant="outline">Customizable</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Current Content?</DialogTitle>
          </DialogHeader>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Applying this template will replace all current page content. This
              action cannot be undone.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Replace Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
