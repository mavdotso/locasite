"use client";

import React from "react";
import { ContactContentUpdate, ContactCard, SocialLink } from "./types";
import { getBusinessCategoryTheme } from "../../core/business-category-themes";
import { cn } from "@/app/lib/utils";

interface ContactSectionProps {
  type: string;
  title: string;
  subtitle?: string;
  showForm?: boolean;
  showMap?: boolean;
  showInfo?: boolean;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  cards?: ContactCard[];
  socialLinks?: SocialLink[];
  editMode?: boolean;
  onUpdate?: (content: ContactContentUpdate) => void;
  businessCategory?: string;
  styleOverrides?: React.CSSProperties;
}

const iconMap: Record<string, string> = {
  "map-pin": "📍",
  phone: "📞",
  mail: "✉️",
  facebook: "📘",
  instagram: "📷",
  twitter: "🐦",
  linkedin: "💼",
};

export function ContactSection({
  type,
  title,
  subtitle,
  showForm,
  showMap,
  showInfo,
  address,
  phone,
  email,
  hours,
  cards,
  socialLinks,
  editMode,
  onUpdate,
  businessCategory,
  styleOverrides,
}: ContactSectionProps) {
  // Get theme based on business category
  const categoryTheme = getBusinessCategoryTheme(businessCategory);
  const themeColors = categoryTheme.colors;
  const contactStyles = categoryTheme.sectionStyles.contact;

  // Use theme values with fallbacks
  const finalAccentColor = themeColors.primary;

  const handleContentEdit = (field: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({
        title,
        subtitle,
        showForm,
        showMap,
        showInfo,
        address,
        phone,
        email,
        hours,
        cards,
        socialLinks,
        [field]: value,
      });
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "w-full py-3 font-semibold transition-all duration-300";

    switch (contactStyles.buttonStyle) {
      case "rounded":
        return cn(baseStyles, "rounded-lg");
      case "square":
        return cn(baseStyles, "rounded-none");
      case "pill":
        return cn(baseStyles, "rounded-full");
      default:
        return cn(baseStyles, "rounded-lg");
    }
  };

  const getFormStyles = () => {
    switch (contactStyles.formStyle) {
      case "minimal":
        return "space-y-4";
      case "bordered":
        return "space-y-4 p-6 border rounded-lg";
      case "floating":
        return "space-y-4 p-6 shadow-lg rounded-lg";
      default:
        return "space-y-4";
    }
  };

  // Contact form with map
  if (type === "contact-form-map") {
    return (
      <div
        className="py-16 md:py-24"
        style={styleOverrides}
      >
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: themeColors.textPrimary }}
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("title", e.currentTarget.textContent || "")
            }
          >
            {title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info & Form */}
            <div className="space-y-6">
              {showInfo && (
                <div className="space-y-4">
                  {address && (
                    <div className="flex items-start gap-3">
                      <span
                        className="text-2xl"
                        style={{ color: finalAccentColor }}
                      >
                        📍
                      </span>
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: themeColors.textPrimary }}
                        >
                          Address
                        </h3>
                        <p
                          style={{ color: themeColors.textSecondary }}
                          contentEditable={editMode}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleContentEdit(
                              "address",
                              e.currentTarget.textContent || "",
                            )
                          }
                        >
                          {address}
                        </p>
                      </div>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-start gap-3">
                      <span
                        className="text-2xl"
                        style={{ color: finalAccentColor }}
                      >
                        📞
                      </span>
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: themeColors.textPrimary }}
                        >
                          Phone
                        </h3>
                        <p
                          style={{ color: themeColors.textSecondary }}
                          contentEditable={editMode}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleContentEdit(
                              "phone",
                              e.currentTarget.textContent || "",
                            )
                          }
                        >
                          {phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-start gap-3">
                      <span
                        className="text-2xl"
                        style={{ color: finalAccentColor }}
                      >
                        ✉️
                      </span>
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: themeColors.textPrimary }}
                        >
                          Email
                        </h3>
                        <p
                          style={{ color: themeColors.textSecondary }}
                          contentEditable={editMode}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleContentEdit(
                              "email",
                              e.currentTarget.textContent || "",
                            )
                          }
                        >
                          {email}
                        </p>
                      </div>
                    </div>
                  )}
                  {hours && (
                    <div className="flex items-start gap-3">
                      <span
                        className="text-2xl"
                        style={{ color: finalAccentColor }}
                      >
                        🕐
                      </span>
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: themeColors.textPrimary }}
                        >
                          Hours
                        </h3>
                        <p
                          style={{ color: themeColors.textSecondary }}
                          contentEditable={editMode}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleContentEdit(
                              "hours",
                              e.currentTarget.textContent || "",
                            )
                          }
                        >
                          {hours}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showForm && (
                <form
                  className={getFormStyles()}
                  style={{
                    backgroundColor:
                      contactStyles.formStyle === "floating"
                        ? themeColors.cardBackground
                        : undefined,
                    borderColor:
                      contactStyles.formStyle === "bordered"
                        ? themeColors.cardBorder
                        : undefined,
                  }}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded-md"
                    style={{
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.cardBorder,
                      color: themeColors.textPrimary,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 rounded-md"
                    style={{
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.cardBorder,
                      color: themeColors.textPrimary,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-md"
                    style={{
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.cardBorder,
                      color: themeColors.textPrimary,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  />
                  <button
                    type="submit"
                    className={getButtonStyles()}
                    style={{
                      backgroundColor: finalAccentColor,
                      color: "#ffffff",
                    }}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Map */}
            {showMap && (
              <div
                className="h-[400px] rounded-lg flex items-center justify-center"
                style={{ backgroundColor: themeColors.cardBackground }}
              >
                <p style={{ color: themeColors.textSecondary }}>
                  Map will be displayed here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Contact cards
  if (type === "contact-cards" && cards) {
    return (
      <div
        className="py-16 md:py-24"
        style={styleOverrides}
      >
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: themeColors.textPrimary }}
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("title", e.currentTarget.textContent || "")
            }
          >
            {title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {cards.map((card, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg border hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: themeColors.cardBackground,
                  borderColor: themeColors.cardBorder,
                }}
              >
                <span
                  className="text-4xl mb-4 block"
                  style={{ color: finalAccentColor }}
                >
                  {iconMap[card.icon] || "📍"}
                </span>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: themeColors.textPrimary }}
                >
                  {card.title}
                </h3>
                <p style={{ color: themeColors.textSecondary }}>{card.info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Social links
  if (type === "contact-social" && socialLinks) {
    return (
      <div
        className="py-16 md:py-24"
        style={styleOverrides}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-12"
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
              className="text-lg mb-8"
              style={{ color: themeColors.textSecondary }}
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("subtitle", e.currentTarget.textContent || "")
              }
            >
              {subtitle}
            </p>
          )}
          <div className="flex justify-center gap-6">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl hover:scale-110 transition-transform"
                style={{ color: finalAccentColor }}
              >
                {iconMap[link.platform] || "🔗"}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
