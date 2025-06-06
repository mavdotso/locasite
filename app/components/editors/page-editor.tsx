"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { toast } from "sonner";
import DragDropSectionEditor from "./drag-drop-section-editor";

interface PageEditorProps {
  page: {
    _id: Id<"pages">;
    content: string;
    slug: string;
  };
  onClose?: () => void;
}

interface PageContent {
  title: string;
  sections: Array<{
    type: string;
    title?: string;
    subtitle?: string;
    image?: string;
    content?: string;
    text?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default function PageEditor({ page, onClose }: PageEditorProps) {
  const updatePage = useMutation(api.pages.updatePage);
  const [content, setContent] = useState<PageContent>(() => {
    try {
      return JSON.parse(page.content);
    } catch (error) {
      console.error("Error parsing page content:", error);
      return { title: page.slug, sections: [] };
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePage({
        pageId: page._id,
        content: JSON.stringify(content),
      });
      setIsEditing(false);
      toast.success("Page updated", {
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Error", {
        description: "Failed to save changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSectionField = (sectionIndex: number, field: string, value: string) => {
    setContent((prev: PageContent) => {
      const newContent = { ...prev };
      const newSections = [...newContent.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        [field]: value,
      };
      newContent.sections = newSections;
      return newContent;
    });
  };

  if (!isEditing) {
    return (
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsEditing(true)}>Edit Page</Button>
      </div>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Edit {content.title || page.slug}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-sm">Page Title</label>
          <Input
            value={content.title || ""}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full"
          />
        </div>

        <Tabs defaultValue="visual">
          <TabsList>
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="sections">Basic Sections</TabsTrigger>
            <TabsTrigger value="json">Advanced (JSON)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="mt-6">
            <DragDropSectionEditor page={page} />
          </TabsContent>
          
          <TabsContent value="sections">
            <div className="mb-4">
              <Button
                onClick={() => {
                  setContent(prev => ({
                    ...prev,
                    sections: [
                      ...prev.sections,
                      { type: "content", text: "" }
                    ]
                  }));
                }}
                size="sm"
              >
                Add New Section
              </Button>
            </div>
          {content.sections?.map((section, index: number) => (
              <Card key={index} className="mb-4 border border-border">
                <CardHeader className="py-2">
                  <CardTitle className="font-medium text-sm">
                    {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                      <Button
                      onClick={() => {
                        setContent(prev => {
                          const newSections = [...prev.sections];
                          newSections.splice(index, 1);
                          return { ...prev, sections: newSections };
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="float-right"
                    >
                      Remove
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {section.type === "hero" && (
                    <>
                      <div className="mb-2">
                        <label className="block mb-1 font-medium text-sm">Title</label>
                        <Input
                          value={section.title || ""}
                          onChange={(e) => updateSectionField(index, "title", e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block mb-1 font-medium text-sm">Subtitle</label>
                        <Input
                          value={section.subtitle || ""}
                          onChange={(e) => updateSectionField(index, "subtitle", e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block mb-1 font-medium text-sm">Image URL</label>
                        <Input
                          value={section.image || ""}
                          onChange={(e) => updateSectionField(index, "image", e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  {section.type === "about" && (
                    <div className="mb-2">
                      <label className="block mb-1 font-medium text-sm">Content</label>
                      <Textarea
                        value={section.content || ""}
                        onChange={(e) => updateSectionField(index, "content", e.target.value)}
                        className="w-full min-h-[150px]"
                      />
                    </div>
                  )}

                  {section.type === "content" && (
                    <div className="mb-2">
                      <label className="block mb-1 font-medium text-sm">Text</label>
                      <Textarea
                        value={section.text || ""}
                        onChange={(e) => updateSectionField(index, "text", e.target.value)}
                        className="w-full min-h-[150px]"
                      />
                    </div>
                  )}

                  {section.type === "header" && (
                    <div className="mb-2">
                      <label className="block mb-1 font-medium text-sm">Title</label>
                      <Input
                        value={section.title || ""}
                        onChange={(e) => updateSectionField(index, "title", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  )}

                  {section.type === "contact" && (
                    <>
                      <div className="mb-2">
                        <label className="block mb-1 font-medium text-sm">Title</label>
                        <Input
                          value={section.title || ""}
                          onChange={(e) => updateSectionField(index, "title", e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block mb-1 font-medium text-sm">Subtitle</label>
                        <Input
                          value={section.subtitle || ""}
                          onChange={(e) => updateSectionField(index, "subtitle", e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="json">
            <Textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setContent(JSON.parse(e.target.value));
                } catch {
                  // Don't update if JSON is invalid
                }
              }}
              className="w-full min-h-[400px] font-mono text-sm"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setIsEditing(false);
          onClose?.();
        }}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}