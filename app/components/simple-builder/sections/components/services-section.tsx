"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { ServicesContentUpdate, Service, PricingTier } from "./types";
import { getBusinessCategoryTheme } from "../../core/business-category-themes";

interface ServicesSectionProps {
  type: string;
  title: string;
  subtitle?: string;
  services?: Service[];
  pricingTiers?: PricingTier[];
  columns?: number;
  editMode?: boolean;
  onUpdate?: (content: ServicesContentUpdate) => void;
  accentColor?: string;
  cardStyle?: "minimal" | "bordered" | "elevated" | "gradient";
  businessCategory?: string;
  styleOverrides?: React.CSSProperties;
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
  accentColor = "#3b82f6",
  cardStyle = "bordered",
  businessCategory,
  styleOverrides,
}: ServicesSectionProps) {
  // Get theme based on business category
  const categoryTheme = getBusinessCategoryTheme(businessCategory);
  const themeColors = categoryTheme.colors;
  const servicesStyles = categoryTheme.sectionStyles.services;

  // Use theme values with fallbacks
  const finalAccentColor = accentColor || themeColors.primary;
  const finalCardStyle = cardStyle || servicesStyles.cardStyle;

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
    const baseStyles = "transition-all duration-300 p-6 rounded-xl";
    const hoverEffects = {
      scale: "hover:scale-105",
      shadow: "hover:shadow-xl",
      glow: "hover:shadow-lg",
      tilt: "hover:transform hover:rotate-1",
    };

    const hoverEffect =
      hoverEffects[servicesStyles.hoverEffect] || hoverEffects.shadow;

    switch (finalCardStyle) {
      case "minimal":
        return cn("bg-transparent", baseStyles, hoverEffect);
      case "bordered":
        return cn("border-2", baseStyles, hoverEffect);
      case "elevated":
        return cn("shadow-lg", baseStyles, hoverEffect);
      case "gradient":
        return cn("border", baseStyles, hoverEffect);
      default:
        return cn("border", baseStyles);
    }
  };

  const getCardInlineStyles = () => {
    switch (finalCardStyle) {
      case "minimal":
        return {};
      case "bordered":
        return {
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.cardBorder,
        };
      case "elevated":
        return {
          backgroundColor: themeColors.cardBackground,
          boxShadow:
            servicesStyles.hoverEffect === "glow"
              ? `0 10px 15px -3px ${themeColors.primary}20`
              : undefined,
        };
      case "gradient":
        return {
          background: `linear-gradient(to bottom right, ${themeColors.cardBackground}, ${themeColors.background})`,
          borderColor: `${themeColors.cardBorder}80`,
        };
      default:
        return {
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.cardBorder,
        };
    }
  };

  const getIconStyles = () => {
    const baseStyles =
      "w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300";

    switch (servicesStyles.iconStyle) {
      case "circle":
        return cn(baseStyles, "rounded-full");
      case "square":
        return cn(baseStyles, "rounded-lg");
      case "rounded":
        return cn(baseStyles, "rounded-2xl");
      default:
        return cn(baseStyles, "rounded-lg");
    }
  };

  // Grid layout
  if (type === "services-grid" && services) {
    return (
      <div
        className="py-16 md:py-24"
        style={styleOverrides}
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: themeColors.textPrimary }}
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
                className="text-lg"
                style={{ color: themeColors.textSecondary }}
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
                style={{
                  animationDelay: `${index * 100}ms`,
                  ...getCardInlineStyles(),
                }}
              >
                {service.icon && (
                  <div
                    className={getIconStyles()}
                    style={{ backgroundColor: themeColors.iconBackground }}
                  >
                    <span
                      className="text-2xl"
                      style={{ color: finalAccentColor }}
                    >
                      {service.icon === "star"
                        ? "⭐"
                        : service.icon === "check"
                          ? "✓"
                          : service.icon === "heart"
                            ? "❤️"
                            : categoryTheme.decorativeElements.icon || "⚙️"}
                    </span>
                  </div>
                )}
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: themeColors.textPrimary }}
                >
                  {service.title}
                </h3>
                <p
                  className="mb-4"
                  style={{ color: themeColors.textSecondary }}
                >
                  {service.description}
                </p>
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span
                          className="mr-2"
                          style={{ color: finalAccentColor }}
                        >
                          ✓
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: themeColors.textSecondary }}
                        >
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
      </div>
    );
  }

  // List layout
  if (type === "services-list" && services) {
    return (
      <div
        className="py-16 md:py-24"
        style={styleOverrides}
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: themeColors.textPrimary }}
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
                className="text-lg"
                style={{ color: themeColors.textSecondary }}
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
                  "border",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
                )}
                style={{
                  backgroundColor: themeColors.cardBackground,
                  borderColor: themeColors.cardBorder,
                }}
              >
                {service.icon && (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: themeColors.iconBackground }}
                  >
                    <span
                      className="text-3xl"
                      style={{ color: finalAccentColor }}
                    >
                      {service.icon === "users"
                        ? "👥"
                        : service.icon === "settings"
                          ? "⚙️"
                          : categoryTheme.decorativeElements.icon || "📋"}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: themeColors.textPrimary }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="mb-4"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {service.description}
                  </p>
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span style={{ color: finalAccentColor }}>✓</span>
                          <span style={{ color: themeColors.textSecondary }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Pricing table
  if (type === "services-pricing" && pricingTiers) {
    return (
      <div
        className="py-16 md:py-24"
        style={styleOverrides}
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: themeColors.textPrimary }}
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
                className="text-lg"
                style={{ color: themeColors.textSecondary }}
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
                    ? "border-2 shadow-2xl scale-105"
                    : "border hover:shadow-lg",
                )}
                style={{
                  backgroundColor: themeColors.cardBackground,
                  borderColor:
                    index === 1 ? finalAccentColor : themeColors.cardBorder,
                }}
              >
                {index === 1 && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: finalAccentColor }}
                  >
                    Most Popular
                  </div>
                )}
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: themeColors.textPrimary }}
                >
                  {tier.name}
                </h3>
                <div className="mb-4">
                  <span
                    className="text-4xl font-bold"
                    style={{
                      color:
                        index === 1
                          ? finalAccentColor
                          : themeColors.textPrimary,
                    }}
                  >
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span style={{ color: themeColors.textSecondary }}>
                      /month
                    </span>
                  )}
                </div>
                <p
                  className="mb-6"
                  style={{ color: themeColors.textSecondary }}
                >
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        className="mt-0.5"
                        style={{ color: finalAccentColor }}
                      >
                        ✓
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: themeColors.textSecondary }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    "w-full py-3 rounded-lg font-semibold transition-all duration-300",
                    index === 1
                      ? "shadow-lg hover:shadow-xl"
                      : "hover:opacity-90",
                  )}
                  style={{
                    backgroundColor:
                      index === 1 ? finalAccentColor : themeColors.secondary,
                    color: "#ffffff",
                  }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Carousel Services
  if (type === "services-carousel" && services) {
    return (
      <div
        className="py-16 md:py-24"
        style={styleOverrides}
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: themeColors.textPrimary }}
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
                className="text-lg"
                style={{ color: themeColors.textSecondary }}
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
                  style={getCardInlineStyles()}
                >
                  {service.icon && (
                    <div
                      className={getIconStyles()}
                      style={{ backgroundColor: themeColors.iconBackground }}
                    >
                      <span
                        className="text-2xl"
                        style={{ color: finalAccentColor }}
                      >
                        {categoryTheme.decorativeElements.icon || service.icon}
                      </span>
                    </div>
                  )}
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: themeColors.textPrimary }}
                  >
                    {service.title}
                  </h3>
                  <p style={{ color: themeColors.textSecondary }}>
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
