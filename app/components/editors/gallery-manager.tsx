"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload,
  Trash2,
  Plus,
  GripVertical,
  Image as ImageIcon,
  Eye,
  Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryManagerProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  maxImages?: number;
}

export function GalleryManager({ 
  value = [], 
  onChange, 
  className,
  maxImages = 20 
}: GalleryManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach((file) => {
      if (file && value.length < maxImages) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          onChange([...value, imageUrl]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
    setSelectedImages(new Set());
  };

  const removeSelectedImages = () => {
    const newImages = value.filter((_, i) => !selectedImages.has(i));
    onChange(newImages);
    setSelectedImages(new Set());
  };

  const toggleImageSelection = (index: number) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedImages(newSelected);
  };

  const selectAllImages = () => {
    if (selectedImages.size === value.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(value.map((_, i) => i)));
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...value];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    onChange(newImages);
    setDraggedIndex(null);
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className={cn("space-y-4 p-4 bg-white border rounded-lg shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Gallery Manager</h3>
        <span className="text-xs text-muted-foreground">
          {value.length} / {maxImages} images
        </span>
      </div>

      {/* Upload Section */}
      {canAddMore && (
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full h-20 border-dashed"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Upload Images ({maxImages - value.length} remaining)
              </p>
            </div>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Bulk Actions */}
      {value.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={selectAllImages}
              className="h-7 text-xs"
            >
              {selectedImages.size === value.length ? "Deselect All" : "Select All"}
            </Button>
            {selectedImages.size > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={removeSelectedImages}
                className="h-7 text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete ({selectedImages.size})
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Drag to reorder
          </p>
        </div>
      )}

      {/* Image Grid */}
      {value.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {value.map((image, index) => (
            <div
              key={index}
              className={cn(
                "relative group aspect-square border-2 rounded-lg overflow-hidden transition-all cursor-pointer",
                selectedImages.has(index) 
                  ? "border-blue-500 ring-2 ring-blue-200" 
                  : "border-muted hover:border-muted-foreground",
                draggedIndex === index && "opacity-50"
              )}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => toggleImageSelection(index)}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Selection Overlay */}
              {selectedImages.has(index) && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
              )}

              {/* Hover Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open image preview
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Drag Handle */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white drop-shadow-lg" />
              </div>

              {/* Image Index */}
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
          <p className="text-xs text-muted-foreground">Upload images to get started</p>
        </div>
      )}

      {/* Image Details */}
      {selectedImages.size === 1 && (
        <div className="space-y-2 p-3 bg-muted rounded">
          <Label className="text-xs font-medium">Image Details</Label>
          <div className="space-y-1">
            <p className="text-xs">Position: {Array.from(selectedImages)[0] + 1} of {value.length}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-6 text-xs">
                <Edit3 className="h-3 w-3 mr-1" />
                Edit Alt Text
              </Button>
              <Button size="sm" variant="outline" className="h-6 text-xs">
                Set as Featured
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}