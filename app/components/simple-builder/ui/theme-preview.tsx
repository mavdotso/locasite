"use client";

import React, { useState } from "react";
import { SectionRenderer } from "../sections/section-renderer";
import { SimpleComponentData } from "../types/simple-builder";
import { businessCategoryThemes } from "../core/business-category-themes";

const sampleSections: SimpleComponentData[] = [
  {
    id: "hero-1",
    type: "hero-section",
    content: {
      title: "Welcome to Our Business",
      subtitle: "Experience excellence with our professional services",
      ctaText: "Get Started",
      ctaLink: "#contact",
      secondaryCtaText: "Learn More",
      secondaryCtaLink: "#about",
    },
    style: {},
  },
  {
    id: "services-1",
    type: "services-grid",
    content: {
      title: "Our Services",
      subtitle: "Discover what we can do for you",
      services: [
        {
          title: "Premium Service",
          description: "Top-quality service tailored to your needs",
          icon: "star",
          features: ["Feature 1", "Feature 2", "Feature 3"],
        },
        {
          title: "Professional Support",
          description: "Expert assistance whenever you need it",
          icon: "check",
          features: ["24/7 Support", "Expert Team", "Quick Response"],
        },
        {
          title: "Custom Solutions",
          description: "Personalized solutions for your business",
          icon: "heart",
          features: ["Tailored Approach", "Flexible Options", "Scalable"],
        },
      ],
    },
    style: {},
  },
  {
    id: "gallery-1",
    type: "gallery-grid",
    content: {
      title: "Our Work",
      subtitle: "See what we've accomplished",
      images: [
        {
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
          alt: "Work 1",
          caption: "Project 1",
        },
        {
          url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
          alt: "Work 2",
          caption: "Project 2",
        },
        {
          url: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
          alt: "Work 3",
          caption: "Project 3",
        },
      ],
    },
    style: {},
  },
];

export function ThemePreview() {
  const [selectedCategory, setSelectedCategory] = useState("restaurant");
  const categories = Object.keys(businessCategoryThemes);

  return (
    <div className="min-h-screen bg-background">
      {/* Category Selector */}
      <div className="sticky top-0 z-50 bg-background border-b border-border p-4">
        <div className="container mx-auto">
          <h2 className="text-lg font-semibold mb-3">
            Select Business Category:
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {businessCategoryThemes[category].name}
              </button>
            ))}
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            Current theme:{" "}
            <span className="font-medium">
              {businessCategoryThemes[selectedCategory].description}
            </span>
          </div>
        </div>
      </div>

      {/* Preview Sections */}
      <div className="pt-8">
        {sampleSections.map((section) => (
          <SectionRenderer
            key={section.id}
            data={section}
            businessCategory={selectedCategory}
            editMode={false}
          />
        ))}
      </div>
    </div>
  );
}
