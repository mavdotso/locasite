"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface ConvexImageProps {
  src: string;
  alt: string;
  businessId?: Id<"businesses"> | string;
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

export function ConvexImage({
  src,
  alt,
  businessId,
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
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(false);
  const uploadImage = useAction(
    api.uploadBusinessImages.uploadGoogleMapsImages,
  );

  useEffect(() => {
    if (src && src.includes("maps.googleapis.com") && businessId) {
      setIsLoading(true);

      // Upload the image to Convex
      uploadImage({
        businessId: businessId as Id<"businesses">,
        imageUrls: [src],
      })
        .then((result) => {
          if (result.storedUrls && result.storedUrls[0]) {
            setImageSrc(result.storedUrls[0]);
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setImageSrc(src);
    }
  }, [src, businessId, uploadImage]);

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={className}
        style={{
          ...style,
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
        }}
      >
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Render the image
  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onLoad={onLoad}
        onError={onError}
        style={style}
        sizes={sizes}
        quality={quality}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      onLoad={onLoad}
      onError={onError}
      style={style}
      sizes={sizes}
      quality={quality}
    />
  );
}
