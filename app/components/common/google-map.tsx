"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface GoogleMapProps {
  address: string;
  height?: string;
  className?: string;
  zoom?: number;
  mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
}

export function GoogleMap({
  address,
  height = "h-96",
  className,
  zoom = 15,
  mapType = "roadmap",
}: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted",
          height,
          className,
        )}
      >
        <div className="text-center p-4">
          <p className="text-muted-foreground mb-2">
            Google Maps API key not configured
          </p>
          <p className="text-sm text-muted-foreground">
            Add your API key to the .env file
          </p>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted",
          height,
          className,
        )}
      >
        <p className="text-muted-foreground">No address provided</p>
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}&zoom=${zoom}&maptype=${mapType}`;

  return (
    <div className={cn("rounded-lg overflow-hidden", className)}>
      <iframe
        src={mapUrl}
        className={cn("w-full", height)}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing location of ${address}`}
      />
    </div>
  );
}
