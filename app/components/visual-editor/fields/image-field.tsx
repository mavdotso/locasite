"use client";

import React, { useState, useRef } from "react";
import { ImageField as ImageFieldType } from "../types";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

interface ImageFieldProps {
  field: ImageFieldType;
  value: string;
  onChange: (value: string) => void;
  businessId: string;
}

export default function ImageField({ field, value, onChange, businessId }: ImageFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const storeFile = useMutation(api.storage.storeFile);

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
      
      // Store file and get URL
      const url = await storeFile({
        storageId,
        businessId: businessId as Id<"businesses">,
        fileType: file.type,
      });
      
      onChange(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
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
                Click to upload image
              </p>
            </div>
          )}
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