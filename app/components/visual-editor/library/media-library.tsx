"use client";

import * as Sentry from "@sentry/nextjs";
import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Image as ImageIcon,
  File,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface MediaLibraryProps {
  businessId?: string;
  onSelect?: (url: string, mediaId: string) => void;
  trigger?: React.ReactNode;
  allowMultiple?: boolean;
  fileTypes?: string[];
}

interface MediaFile {
  _id: Id<"mediaLibrary">;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  folder?: string;
  alt?: string;
  tags: string[];
  usageCount: number;
  dimensions?: { width: number; height: number };
  createdAt: number;
}

export default function MediaLibrary({
  businessId,
  onSelect,
  trigger,
  allowMultiple = false,
  fileTypes = ["image/*"],
}: MediaLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convex hooks
  const mediaFiles = useQuery(api.mediaLibrary.getMediaFiles, {
    businessId: businessId as Id<"businesses"> | undefined,
    folder: selectedFolder === "all" ? undefined : selectedFolder,
  });

  const folders = useQuery(api.mediaLibrary.getFolders, {
    businessId: businessId as Id<"businesses"> | undefined,
  });

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadFile = useMutation(api.mediaLibrary.uploadFile);
  const trackUsage = useMutation(api.mediaLibrary.trackUsage);

  // Filter files based on search query and file types
  const filteredFiles =
    mediaFiles?.files?.filter((file) => {
      const matchesSearch =
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesFileType = fileTypes.some((type) => {
        if (type === "image/*") return file.fileType.startsWith("image/");
        if (type === "video/*") return file.fileType.startsWith("video/");
        if (type === "audio/*") return file.fileType.startsWith("audio/");
        return file.fileType === type;
      });

      return matchesSearch && matchesFileType;
    }) || [];

  const handleUpload = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Generate upload URL
        const uploadUrl = await generateUploadUrl({});

        // Upload file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) throw new Error("Failed to upload file");

        const { storageId } = await result.json();

        let dimensions: { width: number; height: number } | undefined;
        if (file.type.startsWith("image/")) {
          dimensions = await getImageDimensions(file);
        }

        // Store in media library
        await uploadFile({
          fileName: file.name,
          originalName: file.name,
          fileType: file.type,
          fileSize: file.size,
          storageId,
          businessId: businessId as Id<"businesses"> | undefined,
          folder: selectedFolder === "all" ? undefined : selectedFolder,
          dimensions,
        });
      }

      toast.success(`Uploaded ${files.length} file(s) successfully`);
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to upload files");
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

  const handleFileSelect = (mediaFile: MediaFile) => {
    if (allowMultiple) {
      setSelectedFiles((prev) =>
        prev.includes(mediaFile._id)
          ? prev.filter((id) => id !== mediaFile._id)
          : [...prev, mediaFile._id],
      );
    } else {
      if (onSelect) {
        // Only track usage for actual media library items, not Google-scraped images
        if (!mediaFile._id.startsWith("google-")) {
          trackUsage({ mediaId: mediaFile._id });
        }
        onSelect(mediaFile.url, mediaFile._id);
        setIsOpen(false);
      }
    }
  };

  const handleConfirmSelection = () => {
    if (allowMultiple && selectedFiles.length > 0 && onSelect) {
      const selectedUrls = filteredFiles
        .filter((file) => selectedFiles.includes(file._id))
        .map((file) => file.url);

      // Track usage for all selected files (except Google-scraped images)
      selectedFiles.forEach((mediaId) => {
        if (!mediaId.startsWith("google-")) {
          trackUsage({ mediaId: mediaId as Id<"mediaLibrary"> });
        }
      });

      onSelect(selectedUrls.join(","), selectedFiles.join(","));
      setIsOpen(false);
      setSelectedFiles([]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <ImageIcon className="h-4 w-4 mr-2" />
            Select Media
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-b">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Files</SelectItem>
                  {folders?.map((folder) => (
                    <SelectItem key={folder} value={folder}>
                      {folder === "google-business"
                        ? "Google Business Photos"
                        : folder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {allowMultiple && selectedFiles.length > 0 && (
              <div className="flex items-center gap-2">
                <Button onClick={handleConfirmSelection}>
                  Select {selectedFiles.length} file(s)
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* File Grid/List - with proper scrolling */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-4" />
              <p>No files found</p>
              <p className="text-sm">Upload some files to get started</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file._id}
                  className={`relative group cursor-pointer border rounded-lg overflow-hidden hover:border-primary transition-colors ${
                    selectedFiles.includes(file._id)
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => handleFileSelect(file)}
                >
                  {file.fileType.startsWith("image/") ? (
                    <div className="aspect-square">
                      <Image
                        src={file.url}
                        alt={file.alt || file.fileName}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-muted">
                      {renderFileIcon(file.fileType)}
                    </div>
                  )}

                  <div className="p-3">
                    <p className="text-sm font-medium truncate">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(file.fileSize)}
                    </p>
                    {file.folder === "google-business" && (
                      <p className="text-xs text-blue-600 mt-1">
                        Google Business
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {filteredFiles.map((file) => (
                <div
                  key={file._id}
                  className={`flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer ${
                    selectedFiles.includes(file._id) ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleFileSelect(file)}
                >
                  <div className="flex-shrink-0">
                    {file.fileType.startsWith("image/") ? (
                      <Image
                        src={file.url}
                        alt={file.alt || file.fileName}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                        {renderFileIcon(file.fileType)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.fileSize)} • {file.fileType}
                    </p>
                    {file.dimensions && (
                      <p className="text-xs text-muted-foreground">
                        {file.dimensions.width} × {file.dimensions.height}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {file.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-muted-foreground">
              {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}{" "}
              found
            </div>
            <Button
              size="default"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload Files
            </Button>
          </div>
        </DialogFooter>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={fileTypes.join(",")}
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}
