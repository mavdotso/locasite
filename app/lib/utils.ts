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
  // Normalize CSS hex escapes (e.g., \75 -> u, \72 -> r, \6c -> l)
  // so that obfuscated sequences like \75\72\6c( are caught as url(
  const normalized = trimmed.replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
  // Block dangerous characters and url( in the normalized value
  const dangerous = /[;{}<>\\]|url\s*\(/i;
  if (dangerous.test(normalized)) return "";
  return trimmed;
}
