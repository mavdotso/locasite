"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

interface EditableGalleryProps {
  images: string[];
  onAddImage?: () => void;
  onRemoveImage?: (index: number) => void;
  isEditing?: boolean;
  className?: string;
}

export default function EditableGallery({ 
  images, 
  onAddImage, 
  onRemoveImage,
  isEditing = false,
  className 
}: EditableGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    if (!isEditing) {
      setSelectedImage(index);
    }
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const newIndex = direction === 'prev' 
      ? (selectedImage - 1 + images.length) % images.length
      : (selectedImage + 1) % images.length;
    
    setSelectedImage(newIndex);
  };

  if (images.length === 0 && !isEditing) {
    return null;
  }

  return (
    <>
      <section className={cn("py-16 bg-muted/30", className)}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openLightbox(index)}
                onMouseEnter={() => setHoveredImage(index)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                
                {/* Hover overlay */}
                {!isEditing && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                )}
                
                {/* Remove button when editing */}
                {isEditing && hoveredImage === index && onRemoveImage && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {/* Add image button */}
            {isEditing && onAddImage && (
              <button
                onClick={onAddImage}
                className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <Plus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Add Image</span>
              </button>
            )}
          </div>
          
          {images.length === 0 && isEditing && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No images in gallery yet</p>
              {onAddImage && (
                <Button onClick={onAddImage} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Image
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          <div className="relative max-w-7xl max-h-[90vh] mx-4">
            <Image
              src={images[selectedImage]}
              alt={`Gallery image ${selectedImage + 1}`}
              width={1200}
              height={800}
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}