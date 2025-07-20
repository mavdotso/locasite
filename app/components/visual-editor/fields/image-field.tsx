"use client";

import React, { useState, useRef } from "react";
import { ImageField as ImageFieldType } from "@/app/types/visual-editor";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import MediaLibrary from "../library/media-library";

interface ImageFieldProps {
  field: ImageFieldType;
  value: string;
  onChange: (value: string) => void;
  businessId: Id<"businesses">;
}

export default function ImageField({
  field,
  value,
  onChange,
  businessId,
}: ImageFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadFile = useMutation(api.mediaLibrary.uploadFile);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);

      // Generate upload URL
      const uploadUrl = await generateUploadUrl({});

      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Failed to upload image");

      const { storageId } = await result.json();

      let dimensions: { width: number; height: number } | undefined;
      if (file.type.startsWith("image/")) {
        dimensions = await getImageDimensions(file);
      }

      // Store file in media library and get URL
      const { url } = await uploadFile({
        fileName: file.name,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storageId,
        businessId: businessId as Id<"businesses">,
        dimensions,
      });

      onChange(url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const getImageDimensions = (
    file: File,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  const handleMediaSelect = (url: string) => {
    onChange(url);
  };

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {value ? (
        <div className="relative group">
          <Image
            src={value}
            alt={field.label}
            width={400}
            height={128}
            className="w-full h-32 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload New
            </Button>

            <MediaLibrary
              businessId={businessId}
              onSelect={handleMediaSelect}
              fileTypes={[field.accept || "image/*"]}
              trigger={
                <Button variant="outline" className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Choose from Library
                </Button>
              }
            />
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop files here or click to upload
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={field.accept || "image/*"}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
