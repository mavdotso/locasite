"use client";

import React from "react";
import { SectionRenderer } from "../sections/section-renderer";
import { SimpleComponentData } from "../types/simple-builder";

interface SimplePageRendererProps {
  sections: SimpleComponentData[];
  businessData?: Record<string, unknown>;
  businessCategory?: string;
  editMode?: boolean;
  onUpdate?: (sectionId: string, newData: SimpleComponentData) => void;
}

export function SimplePageRenderer({
  sections,
  businessData,
  businessCategory,
  editMode = false,
  onUpdate,
}: SimplePageRendererProps) {
  return (
    <div className="simple-page-renderer">
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          data={section}
          businessData={businessData}
          businessCategory={businessCategory}
          editMode={editMode}
          onUpdate={(newData) => onUpdate?.(section.id, newData)}
        />
      ))}
    </div>
  );
}
