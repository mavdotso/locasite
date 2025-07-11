"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface SeoSettingsProps {
  businessId: Id<"businesses">;
}

export function SeoSettings({ businessId }: SeoSettingsProps) {
  const seoSettings = useQuery(api.businessSeo.getSeoSettings, { businessId });
  const updateSeoSettings = useMutation(api.businessSeo.updateSeoSettings);
  const uploadFavicon = useMutation(api.businessSeo.uploadFavicon);
  const uploadOgImage = useMutation(api.businessSeo.uploadOgImage);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [] as string[],
    keywordInput: "",
  });

  const faviconInputRef = useRef<HTMLInputElement>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when settings load
  useState(() => {
    if (seoSettings) {
      setFormData({
        seoTitle: seoSettings.seoTitle || "",
        seoDescription: seoSettings.seoDescription || "",
        seoKeywords: seoSettings.seoKeywords || [],
        keywordInput: "",
      });
    }
  });

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(png|ico|svg\+xml)$/)) {
      toast.error("Please upload a PNG, ICO, or SVG file");
      return;
    }

    // Validate file size (max 1MB for favicon)
    if (file.size > 1024 * 1024) {
      toast.error("Favicon must be less than 1MB");
      return;
    }

    setIsLoading(true);
    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();

      // Update business with new favicon
      await uploadFavicon({ businessId, storageId });

      toast.success("Favicon uploaded successfully");
    } catch (error) {
      console.error("Error uploading favicon:", error);
      toast.error("Failed to upload favicon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOgImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast.error("Please upload a JPEG, PNG, or WebP file");
      return;
    }

    // Validate file size (max 5MB for OG image)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsLoading(true);
    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();

      // Update business with new OG image
      await uploadOgImage({ businessId, storageId });

      toast.success("OG image uploaded successfully");
    } catch (error) {
      console.error("Error uploading OG image:", error);
      toast.error("Failed to upload OG image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKeyword = () => {
    const keyword = formData.keywordInput.trim();
    if (keyword && !formData.seoKeywords.includes(keyword)) {
      setFormData({
        ...formData,
        seoKeywords: [...formData.seoKeywords, keyword],
        keywordInput: "",
      });
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      seoKeywords: formData.seoKeywords.filter((k) => k !== keyword),
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSeoSettings({
        businessId,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        seoKeywords:
          formData.seoKeywords.length > 0 ? formData.seoKeywords : undefined,
      });

      toast.success("SEO settings updated successfully");
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      toast.error("Failed to update SEO settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>
            Customize how your business appears in search results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo-title">SEO Title</Label>
            <Input
              id="seo-title"
              placeholder="Enter a custom title for search engines"
              value={formData.seoTitle}
              onChange={(e) =>
                setFormData({ ...formData, seoTitle: e.target.value })
              }
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              {formData.seoTitle.length}/60 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-description">SEO Description</Label>
            <Textarea
              id="seo-description"
              placeholder="Enter a custom description for search engines"
              value={formData.seoDescription}
              onChange={(e) =>
                setFormData({ ...formData, seoDescription: e.target.value })
              }
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {formData.seoDescription.length}/160 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-keywords">SEO Keywords</Label>
            <div className="flex gap-2">
              <Input
                id="seo-keywords"
                placeholder="Add a keyword"
                value={formData.keywordInput}
                onChange={(e) =>
                  setFormData({ ...formData, keywordInput: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddKeyword}
                disabled={!formData.keywordInput.trim()}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.seoKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-secondary rounded-md"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>
            Customize your business favicon and social media preview
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Favicon</Label>
            <div className="flex items-center gap-4">
              {seoSettings?.favicon && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={seoSettings.favicon}
                    alt="Current favicon"
                    className="w-8 h-8 rounded border"
                  />
                </>
              )}
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/png,image/x-icon,image/svg+xml"
                onChange={handleFaviconUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => faviconInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Favicon
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: 32x32px PNG, ICO, or SVG
            </p>
          </div>

          <div className="space-y-2">
            <Label>Social Media Preview Image</Label>
            <div className="space-y-2">
              {seoSettings?.ogImage && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={seoSettings.ogImage}
                    alt="Current OG image"
                    className="w-full max-w-sm rounded border"
                  />
                </>
              )}
              <input
                ref={ogImageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleOgImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => ogImageInputRef.current?.click()}
                disabled={isLoading}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Preview Image
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: 1200x630px JPEG or PNG
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          Save SEO Settings
        </Button>
      </div>
    </div>
  );
}
