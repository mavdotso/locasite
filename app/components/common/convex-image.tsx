"use client";

import Image from "next/image";
import { useState, memo } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ConvexImageProps {
  src: string;
  alt: string;
  businessId?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  sizes?: string;
  quality?: number;
}

export const ConvexImage = memo(function ConvexImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  onLoad,
  onError,
  style,
  sizes,
  quality,
}: ConvexImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Show placeholder for broken/missing images
  if (hasError || !src) {
    return (
      <div
        className={cn(
          "bg-gray-100 dark:bg-gray-800 flex items-center justify-center w-full h-full",
          className
        )}
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600">
          <ImageOff className="w-8 h-8" />
          <span className="text-xs">Image not available</span>
        </div>
      </div>
    );
  }

  // Render the image
  if (fill) {
    return (
      <>
        {isLoading && (
          <div
            className={cn(
              "animate-pulse bg-gray-200 dark:bg-gray-700 absolute inset-0",
              className
            )}
            aria-label="Loading image"
          />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          style={style}
          sizes={sizes}
          quality={quality}
        />
      </>
    );
  }

  const placeholderWidth = width || 800;
  const placeholderHeight = height || 600;

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={cn(
            "animate-pulse bg-gray-200 dark:bg-gray-700 absolute inset-0",
            className
          )}
          aria-label="Loading image"
          data-width={placeholderWidth}
          data-height={placeholderHeight}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={placeholderWidth}
        height={placeholderHeight}
        className={className}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        style={style}
        sizes={sizes}
        quality={quality}
      />
    </div>
  );
});
