"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";
import { GalleryContentUpdate, GalleryImage, Comparison } from "./types";

interface GallerySectionProps {
  type: string;
  title?: string;
  images?: GalleryImage[];
  columns?: number;
  comparisons?: Comparison[];
  editMode?: boolean;
  onUpdate?: (content: GalleryContentUpdate) => void;
}

export function GallerySection({
  type,
  title,
  images,
  columns = 3,
  comparisons,
  editMode,
  onUpdate,
}: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const handleContentEdit = (field: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({
        title,
        images,
        columns,
        comparisons,
        [field]: value,
      });
    }
  };

  // Grid gallery
  if (type === "gallery-grid" && images) {
    return (
      <div className="container mx-auto px-4">
        {title && (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("title", e.currentTarget.textContent || "")
            }
          >
            {title}
          </h2>
        )}
        <div
          className={cn(
            "grid gap-4",
            columns === 2 && "md:grid-cols-2",
            columns === 3 && "md:grid-cols-3",
            columns === 4 && "md:grid-cols-4",
          )}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className="object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Masonry gallery
  if (type === "gallery-masonry" && images) {
    return (
      <div className="container mx-auto px-4">
        {title && (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("title", e.currentTarget.textContent || "")
            }
          >
            {title}
          </h2>
        )}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="mb-4 break-inside-avoid cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={300}
                className="w-full rounded-lg hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className="object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Before/After gallery
  if (type === "gallery-before-after" && comparisons) {
    return (
      <div className="container mx-auto px-4">
        {title && (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("title", e.currentTarget.textContent || "")
            }
          >
            {title}
          </h2>
        )}
        <div className="grid md:grid-cols-2 gap-8">
          {comparisons.map((comparison, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-semibold text-center">
                {comparison.title}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    Before
                  </div>
                  <Image
                    src={comparison.before.src}
                    alt={comparison.before.alt}
                    width={400}
                    height={300}
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    After
                  </div>
                  <Image
                    src={comparison.after.src}
                    alt={comparison.after.alt}
                    width={400}
                    height={300}
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
