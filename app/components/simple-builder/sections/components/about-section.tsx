"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";
import { AboutContentUpdate } from "./types";

interface AboutSectionProps {
  type: string;
  title: string;
  content?: string;
  image?: string;
  imagePosition?: "left" | "right";
  column1?: string;
  column2?: string;
  timeline?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  editMode?: boolean;
  onUpdate?: (content: AboutContentUpdate) => void;
}

export function AboutSection({
  type,
  title,
  content,
  image,
  imagePosition = "right",
  column1,
  column2,
  timeline,
  editMode,
  onUpdate,
}: AboutSectionProps) {
  const handleContentEdit = (field: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({
        title,
        content,
        image,
        imagePosition,
        column1,
        column2,
        timeline,
        [field]: value,
      });
    }
  };

  // Text with side image
  if (type === "about-section") {
    return (
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "grid md:grid-cols-2 gap-8 items-center",
            imagePosition === "left" && "md:flex-row-reverse",
          )}
        >
          <div className={imagePosition === "left" ? "md:order-2" : ""}>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("title", e.currentTarget.textContent || "")
              }
            >
              {title}
            </h2>
            <p
              className="text-lg text-muted-foreground leading-relaxed"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("content", e.currentTarget.textContent || "")
              }
            >
              {content}
            </p>
          </div>
          <div
            className={cn(
              "relative h-[300px] md:h-[400px]",
              imagePosition === "left" ? "md:order-1" : "",
            )}
          >
            {image && (
              <Image
                src={image}
                alt="About us"
                fill
                className="object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Two column text
  if (type === "about-columns") {
    return (
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-8"
          contentEditable={editMode}
          suppressContentEditableWarning
          onBlur={(e) =>
            handleContentEdit("title", e.currentTarget.textContent || "")
          }
        >
          {title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <p
              className="text-lg text-muted-foreground leading-relaxed"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("column1", e.currentTarget.textContent || "")
              }
            >
              {column1}
            </p>
          </div>
          <div>
            <p
              className="text-lg text-muted-foreground leading-relaxed"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("column2", e.currentTarget.textContent || "")
              }
            >
              {column2}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Timeline
  if (type === "about-timeline" && timeline) {
    return (
      <div className="container mx-auto px-4">
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
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

            {timeline.map((item, index) => (
              <div key={index} className="relative flex items-start mb-8">
                {/* Timeline dot */}
                <div className="absolute left-8 w-4 h-4 bg-primary rounded-full -translate-x-1/2" />

                <div className="ml-16">
                  <div className="text-sm font-medium text-primary mb-1">
                    {item.year}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
