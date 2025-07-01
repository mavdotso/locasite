"use client";

import React from "react";
import { ContactContentUpdate, ContactCard, SocialLink } from "./types";

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
}: ContactSectionProps) {
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

  // Contact form with map
  if (type === "contact-form-map") {
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
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info & Form */}
          <div className="space-y-6">
            {showInfo && (
              <div className="space-y-4">
                {address && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p
                        className="text-muted-foreground"
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
                    <span className="text-2xl">📞</span>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p
                        className="text-muted-foreground"
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
                    <span className="text-2xl">✉️</span>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p
                        className="text-muted-foreground"
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
                    <span className="text-2xl">🕐</span>
                    <div>
                      <h3 className="font-semibold mb-1">Hours</h3>
                      <p
                        className="text-muted-foreground"
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
              <form className="space-y-4 mt-8">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-border rounded-md"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border border-border rounded-md"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-md"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Map */}
          {showMap && (
            <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Map will be displayed here
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Contact cards
  if (type === "contact-cards" && cards) {
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
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-card border border-border"
            >
              <div className="text-4xl mb-4">{iconMap[card.icon] || "📌"}</div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-muted-foreground">{card.info}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Social focus
  if (type === "contact-social" && socialLinks) {
    return (
      <div className="container mx-auto px-4 text-center">
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
        {subtitle && (
          <p
            className="text-lg text-muted-foreground mb-8"
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("subtitle", e.currentTarget.textContent || "")
            }
          >
            {subtitle}
          </p>
        )}
        <div className="flex justify-center gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
            >
              <span className="text-2xl">{iconMap[link.platform] || "🔗"}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
