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

/**
 * Validates if a subdomain is valid
 * - Must be 3-63 characters long
 * - Can only contain lowercase letters, numbers, and hyphens
 * - Cannot start or end with a hyphen
 * - Cannot contain consecutive hyphens
 */
export function isValidSubdomain(subdomain: string): boolean {
  if (!subdomain || subdomain.length < 3 || subdomain.length > 63) {
    return false;
  }
  
  const validPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return validPattern.test(subdomain) && !subdomain.includes("--");
}