import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitize a CSS value to prevent injection attacks when interpolating
 * user-controlled values into a `<style>` tag.
 *
 * Allows hex colors (#fff, #aabbcc), oklch/rgb/hsl functional notation,
 * bare CSS keywords (alphanumeric + hyphens), and quoted font-family names.
 * Strips anything containing characters that could break out of a CSS
 * declaration: ; { } < > and url(.
 */
export function sanitizeCssValue(value: string): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  // Block dangerous characters: ; { } < > and url(
  if (/[;{}<>]/.test(trimmed) || /url\s*\(/i.test(trimmed)) return "";
  return trimmed;
}
