"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { Menu, X } from "lucide-react";
import { HeaderContentUpdate } from "./types";
import { getBusinessCategoryTheme } from "../../core/business-category-themes";

interface MenuItem {
  label: string;
  link: string;
  enabled?: boolean;
}

interface HeaderSectionProps {
  type: string;
  logo: string;
  logoAlt: string;
  menuItems: MenuItem[];
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  editMode?: boolean;
  onUpdate?: (content: HeaderContentUpdate) => void;
  businessCategory?: string;
}

export function HeaderSection({
  type,
  logo,
  logoAlt,
  menuItems,
  showButton,
  buttonText,
  buttonLink,
  editMode,
  onUpdate,
  businessCategory,
}: HeaderSectionProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get theme based on business category
  const categoryTheme = getBusinessCategoryTheme(businessCategory);
  const themeColors = categoryTheme.colors;

  // Truncate logo text if it's too long
  const truncatedLogo =
    logo && !logo.startsWith("http") && !logo.startsWith("data:")
      ? logo.length > 20
        ? logo.substring(0, 20) + "..."
        : logo
      : logo;

  const handleContentEdit = (field: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({
        logo,
        logoAlt,
        menuItems,
        showButton,
        buttonText,
        buttonLink,
        [field]: value,
      });
    }
  };

  const handleMenuItemEdit = (
    index: number,
    field: "label" | "link",
    value: string,
  ) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index] = { ...updatedMenuItems[index], [field]: value };
    handleContentEdit("menuItems", updatedMenuItems);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editMode) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleContentEdit("logo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (type === "header-classic") {
    return (
      <header
        className="w-full py-4 px-6"
        style={{
          backgroundColor: themeColors.cardBackground,
          borderBottom: `1px solid ${themeColors.cardBorder}`,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo.startsWith("http") || logo.startsWith("data:") ? (
              editMode ? (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="relative group">
                    <Image
                      src={logo}
                      alt={logoAlt}
                      width={150}
                      height={50}
                      className="h-12 w-auto"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm">
                        Click to upload
                      </span>
                    </div>
                  </div>
                </label>
              ) : (
                <Link href="/">
                  <Image
                    src={logo}
                    alt={logoAlt}
                    width={150}
                    height={50}
                    className="h-12 w-auto"
                  />
                </Link>
              )
            ) : (
              <Link
                href="/"
                className="text-2xl font-bold text-foreground hover:text-primary transition-colors truncate max-w-[200px] block"
                title={logo}
              >
                {truncatedLogo}
              </Link>
            )}{" "}
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems
              .filter((item) => item.enabled !== false)
              .map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="text-foreground hover:text-primary transition-colors"
                  contentEditable={editMode}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleMenuItemEdit(
                      menuItems.indexOf(item),
                      "label",
                      e.currentTarget.textContent || "",
                    )
                  }
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          {/* CTA Button */}
          {showButton && buttonText && buttonLink && (
            <div className="hidden md:block">
              <Link
                href={buttonLink}
                className={cn(
                  "px-6 py-2 rounded-md font-medium",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "transition-colors",
                )}
              >
                <span
                  contentEditable={editMode}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleContentEdit(
                      "buttonText",
                      e.currentTarget.textContent || "",
                    )
                  }
                >
                  {buttonText}
                </span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-2 pt-4">
              {menuItems
                .filter((item) => item.enabled !== false)
                .map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="text-foreground hover:text-primary transition-colors px-4 py-2 hover:bg-muted rounded-md mx-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              {showButton && buttonText && buttonLink && (
                <div className="px-4 pt-2">
                  <Link
                    href={buttonLink}
                    className={cn(
                      "block text-center px-6 py-2 rounded-md font-medium",
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      "transition-colors",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {buttonText}
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>
    );
  }

  if (type === "header-centered") {
    return (
      <header className="w-full text-center py-4 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Logo */}
          <div className="mb-4">
            {logo.startsWith("http") || logo.startsWith("data:") ? (
              editMode ? (
                <label className="cursor-pointer inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="relative group inline-block">
                    <Image
                      src={logo}
                      alt={logoAlt}
                      width={150}
                      height={50}
                      className="h-12 w-auto mx-auto"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm">
                        Click to upload
                      </span>
                    </div>
                  </div>
                </label>
              ) : (
                <Link href="/" className="inline-block">
                  <Image
                    src={logo}
                    alt={logoAlt}
                    width={150}
                    height={50}
                    className="h-12 w-auto mx-auto"
                  />
                </Link>
              )
            ) : (
              <Link
                href="/"
                className="inline-block text-2xl font-bold text-foreground hover:text-primary transition-colors truncate max-w-[200px]"
                title={logo}
              >
                {truncatedLogo}
              </Link>
            )}
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center justify-center space-x-8">
            {menuItems
              .filter((item) => item.enabled !== false)
              .map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="text-foreground hover:text-primary transition-colors"
                  contentEditable={editMode}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleMenuItemEdit(
                      menuItems.indexOf(item),
                      "label",
                      e.currentTarget.textContent || "",
                    )
                  }
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden mt-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border">
              <div className="flex flex-col space-y-2 pt-4">
                {menuItems
                  .filter((item) => item.enabled !== false)
                  .map((item, index) => (
                    <Link
                      key={index}
                      href={item.link}
                      className="text-foreground hover:text-primary transition-colors px-4 py-2 hover:bg-muted rounded-md mx-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
              </div>
            </nav>
          )}
        </div>
      </header>
    );
  }

  // Minimal header (default)
  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          {logo.startsWith("http") || logo.startsWith("data:") ? (
            editMode ? (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <div className="relative group">
                  <Image
                    src={logo}
                    alt={logoAlt}
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">Click to upload</span>
                  </div>
                </div>
              </label>
            ) : (
              <Link href="/">
                <Image
                  src={logo}
                  alt={logoAlt}
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            )
          ) : (
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:text-primary transition-colors truncate max-w-[180px] block"
              title={logo}
            >
              {truncatedLogo}
            </Link>
          )}
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems
            .filter((item) => item.enabled !== false)
            .map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="text-foreground hover:text-primary transition-colors"
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleMenuItemEdit(
                    menuItems.indexOf(item),
                    "label",
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {item.label}
              </Link>
            ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 border-t border-border">
          <div className="flex flex-col space-y-4 pt-4">
            {menuItems
              .filter((item) => item.enabled !== false)
              .map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="text-foreground hover:text-primary transition-colors px-4 py-2 hover:bg-muted rounded-md mx-2"
                  onClick={() => setMobileMenuOpen(false)}
                  contentEditable={editMode}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleMenuItemEdit(
                      menuItems.indexOf(item),
                      "label",
                      e.currentTarget.textContent || "",
                    )
                  }
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </nav>
      )}
    </header>
  );
}
