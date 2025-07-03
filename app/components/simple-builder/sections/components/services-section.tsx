"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { ServicesContentUpdate, Service, PricingTier } from "./types";

interface ServicesSectionProps {
  type: string;
  title: string;
  subtitle?: string;
  services?: Service[];
  pricingTiers?: PricingTier[];
  columns?: number;
  editMode?: boolean;
  onUpdate?: (content: ServicesContentUpdate) => void;
  backgroundColor?: string;
  accentColor?: string;
  cardStyle?: "minimal" | "bordered" | "elevated" | "gradient";
}

export function ServicesSection({
  type,
  title,
  subtitle,
  services,
  pricingTiers,
  columns = 3,
  editMode,
  onUpdate,
  backgroundColor = "transparent",
  accentColor = "#3b82f6",
  cardStyle = "bordered",
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

  const getCardStyles = () => {
    switch (cardStyle) {
      case "minimal":
        return "bg-transparent p-6";
      case "bordered":
        return "bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300";
      case "elevated":
        return "bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300";
      case "gradient":
        return "bg-gradient-to-br from-card to-muted rounded-xl p-6 border border-border/50";
      default:
        return "bg-card border border-border rounded-xl p-6";
    }
  };

  // Grid layout
  if (type === "services-grid" && services) {
    return (
      <section className="py-16 md:py-24" style={{ backgroundColor }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("title", e.currentTarget.textContent || "")
              }
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="text-lg text-muted-foreground"
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleContentEdit(
                    "subtitle",
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={cn(
              "grid gap-8",
              columns === 2 && "md:grid-cols-2",
              columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
              columns === 4 && "md:grid-cols-2 lg:grid-cols-4",
            )}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className={cn(
                  getCardStyles(),
                  "group cursor-pointer",
                  "animate-fadeInUp",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {service.icon && (
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <span className="text-2xl" style={{ color: accentColor }}>
                      {service.icon === "star"
                        ? "⭐"
                        : service.icon === "check"
                          ? "✓"
                          : service.icon === "heart"
                            ? "❤️"
                            : "⚙️"}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // List layout
  if (type === "services-list" && services) {
    return (
      <section className="py-16 md:py-24" style={{ backgroundColor }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("title", e.currentTarget.textContent || "")
              }
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="text-lg text-muted-foreground"
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleContentEdit(
                    "subtitle",
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-6 items-start p-6 rounded-xl",
                  "hover:shadow-lg transition-all duration-300",
                  "bg-card border border-border",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
                )}
              >
                {service.icon && (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <span className="text-3xl" style={{ color: accentColor }}>
                      {service.icon === "users"
                        ? "👥"
                        : service.icon === "settings"
                          ? "⚙️"
                          : "📋"}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
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
      </section>
    );
  }

  // Pricing table
  if (type === "services-pricing" && pricingTiers) {
    return (
      <section className="py-16 md:py-24" style={{ backgroundColor }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("title", e.currentTarget.textContent || "")
              }
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="text-lg text-muted-foreground"
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleContentEdit(
                    "subtitle",
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={cn(
                  "relative p-8 rounded-2xl transition-all duration-300",
                  index === 1
                    ? "border-2 border-primary shadow-2xl scale-105 bg-card"
                    : "border border-border bg-card hover:shadow-lg",
                )}
              >
                {index === 1 && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: index === 1 ? accentColor : undefined }}
                  >
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
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
                    "w-full py-3 rounded-lg font-semibold transition-all duration-300",
                    index === 1
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Carousel Services
  if (type === "services-carousel" && services) {
    return (
      <section className="py-16 md:py-24" style={{ backgroundColor }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("title", e.currentTarget.textContent || "")
              }
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="text-lg text-muted-foreground"
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleContentEdit(
                    "subtitle",
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="relative overflow-hidden">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={cn("flex-none w-80 snap-center", getCardStyles())}
                >
                  {service.icon && (
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <span className="text-2xl" style={{ color: accentColor }}>
                        {service.icon}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
