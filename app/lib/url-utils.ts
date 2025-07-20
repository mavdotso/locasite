/**
 * Converts a string to a URL-friendly format
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Removes consecutive hyphens
 * - Removes leading/trailing hyphens
 * - Limits length to specified max (default 30)
 */
export function toUrlFriendly(input: string, maxLength: number = 30): string {
  if (!input) return "";

  return input
    .toLowerCase()
    .normalize("NFD") // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .substring(0, maxLength)
    .replace(/-$/, ""); // Remove trailing hyphen after truncation
}
