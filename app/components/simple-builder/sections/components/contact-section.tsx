"use client";

import React, { useState } from "react";
import { ContactContentUpdate, ContactCard, SocialLink } from "./types";
import { getBusinessCategoryTheme } from "../../core/business-category-themes";
import { cn } from "@/app/lib/utils";
import { GoogleMap } from "@/app/components/common/google-map";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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
  businessCategory?: string;
  accentColor?: string;
  editMode?: boolean;
  onContentUpdate?: (update: ContactContentUpdate) => void;
  styleOverrides?: React.CSSProperties;
  businessId?: string | Id<"businesses">;
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
  onContentUpdate,
  businessCategory,
  styleOverrides,
  businessId,
}: ContactSectionProps) {
  const categoryTheme = getBusinessCategoryTheme(businessCategory);
  const themeColors = categoryTheme.colors;
  const contactStyles = categoryTheme.sectionStyles.contact;

  const finalAccentColor = themeColors.primary;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const sendMessage = useMutation(api.contactMessages.send);

  const handleContentEdit = (field: string, value: unknown) => {
    if (onContentUpdate) {
      onContentUpdate({
        [field]: value,
      } as ContactContentUpdate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessId || editMode) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.message.trim()
      ) {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 5000);
        return;
      }

      await sendMessage({
        businessId: businessId as Id<"businesses">,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || undefined,
        message: formData.message.trim(),
      });

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });

      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (_error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
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
      <div className="py-16 md:py-24" style={styleOverrides}>
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
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded-md"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isSubmitting || editMode}
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
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isSubmitting || editMode}
                    style={{
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.cardBorder,
                      color: themeColors.textPrimary,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone (optional)"
                    className="w-full px-4 py-2 rounded-md"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={isSubmitting || editMode}
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
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    disabled={isSubmitting || editMode}
                    style={{
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.cardBorder,
                      color: themeColors.textPrimary,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  />
                  {submitStatus === "success" && (
                    <div className="p-3 rounded-md text-green-800 bg-green-100">
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="p-3 rounded-md text-red-800 bg-red-100">
                      Sorry, there was an error sending your message. Please try
                      again.
                    </div>
                  )}
                  <button
                    type="submit"
                    className={getButtonStyles()}
                    disabled={isSubmitting || editMode || !businessId}
                    style={{
                      backgroundColor: finalAccentColor,
                      color: "#ffffff",
                      opacity:
                        isSubmitting || editMode || !businessId ? 0.5 : 1,
                      cursor:
                        isSubmitting || editMode || !businessId
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Map */}
            {showMap && address && (
              <GoogleMap
                address={address}
                height="h-[400px]"
                className="shadow-lg"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Contact cards
  if (type === "contact-cards" && cards) {
    return (
      <div className="py-16 md:py-24" style={styleOverrides}>
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
      <div className="py-16 md:py-24" style={styleOverrides}>
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
