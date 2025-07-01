"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { ServicesContentUpdate, Service, PricingTier } from "./types";

interface ServicesSectionProps {
  type: string;
  title: string;
  services?: Service[];
  pricingTiers?: PricingTier[];
  editMode?: boolean;
  onUpdate?: (content: ServicesContentUpdate) => void;
}

export function ServicesSection({
  type,
  title,
  services,
  pricingTiers,
  editMode,
  onUpdate,
}: ServicesSectionProps) {
  const handleContentEdit = (field: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({
        title,
        services,
        pricingTiers,
        [field]: value,
      });
    }
  };

  // Grid layout
  if (type === "services-grid" && services) {
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
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-card border border-border"
            >
              {service.icon && (
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // List layout
  if (type === "services-list" && services) {
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
        <div className="max-w-4xl mx-auto space-y-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex gap-6 p-6 rounded-lg bg-card border border-border"
            >
              {service.icon && (
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">⚙️</span>
                </div>
              )}
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                {service.features && (
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-primary">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Pricing table
  if (type === "services-pricing" && pricingTiers) {
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
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                "p-8 rounded-lg border",
                index === 1
                  ? "border-primary shadow-lg scale-105"
                  : "border-border",
              )}
            >
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold mb-4 text-primary">
                {tier.price}
              </div>
              <p className="text-muted-foreground mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={cn(
                  "w-full py-3 rounded-md font-medium transition-colors",
                  index === 1
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
