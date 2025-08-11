/**
 * Utilities for subdomain generation and validation
 */

// Constants
const MIN_SUBDOMAIN_LENGTH = 3;
const MAX_SUBDOMAIN_LENGTH = 63;
const DEFAULT_MAX_SUGGESTIONS = 5;
const MAX_NUMBERED_ATTEMPTS = 20;

/**
 * Check if a subdomain is available
 * Returns the subdomain if available, or suggests alternatives
 */
export async function checkSubdomainAvailability(
  ctx: any,
  baseSubdomain: string
): Promise<{
  available: boolean;
  subdomain: string;
  suggestions?: string[];
}> {
  // Check if the base subdomain is available
  const existing = await ctx.db
    .query("domains")
    .withIndex("by_subdomain", (q: any) => q.eq(q.field("subdomain"), baseSubdomain))
    .first();

  if (!existing) {
    return {
      available: true,
      subdomain: baseSubdomain
    };
  }

  // Generate suggestions if not available
  const suggestions = await generateSubdomainSuggestions(ctx, baseSubdomain);
  
  return {
    available: false,
    subdomain: suggestions[0] || `${baseSubdomain}-${Date.now()}`,
    suggestions
  };
}

/**
 * Generate subdomain suggestions based on the base name
 */
async function generateSubdomainSuggestions(
  ctx: any,
  baseSubdomain: string,
  maxSuggestions: number = DEFAULT_MAX_SUGGESTIONS
): Promise<string[]> {
  const suggestions: string[] = [];
  const strategies = [
    // Strategy 1: Add location-based suffixes
    () => [`${baseSubdomain}-local`, `${baseSubdomain}-nearby`, `${baseSubdomain}-here`],
    
    // Strategy 2: Add descriptive suffixes
    () => [`${baseSubdomain}-pro`, `${baseSubdomain}-best`, `${baseSubdomain}-top`],
    
    // Strategy 3: Add service suffixes
    () => [`${baseSubdomain}-services`, `${baseSubdomain}-shop`, `${baseSubdomain}-store`],
    
    // Strategy 4: Add time-based suffixes
    () => [`${baseSubdomain}-now`, `${baseSubdomain}-today`, `${baseSubdomain}-24`],
    
    // Strategy 5: Use abbreviated versions or initials
    () => {
      const words = baseSubdomain.split('-');
      if (words.length > 1) {
        const initials = words.map(w => w[0]).join('');
        return [`${initials}-${words[words.length - 1]}`, `${words[0]}-${initials}`];
      }
      return [];
    },
    
    // Strategy 6: Add numeric suffixes smartly
    () => {
      const year = new Date().getFullYear();
      return [
        `${baseSubdomain}-${year}`,
        `${baseSubdomain}-${year % 100}`,
        `${baseSubdomain}-${Math.floor(Math.random() * 100)}`
      ];
    }
  ];

  // Try each strategy and check availability
  for (const strategy of strategies) {
    const candidates = strategy();
    
    for (const candidate of candidates) {
      if (suggestions.length >= maxSuggestions) {
        return suggestions;
      }
      
      // Check if this suggestion is available
      const existing = await ctx.db
        .query("domains")
        .withIndex("by_subdomain", (q: any) => q.eq(q.field("subdomain"), candidate))
        .first();
      
      if (!existing && candidate.length >= MIN_SUBDOMAIN_LENGTH && candidate.length <= MAX_SUBDOMAIN_LENGTH) {
        suggestions.push(candidate);
      }
    }
  }

  // If we still don't have enough suggestions, add numbered versions
  let counter = 1;
  while (suggestions.length < maxSuggestions && counter <= MAX_NUMBERED_ATTEMPTS) {
    const numbered = `${baseSubdomain}${counter}`;
    const existing = await ctx.db
      .query("domains")
      .withIndex("by_subdomain", (q: any) => q.eq(q.field("subdomain"), numbered))
      .first();
    
    if (!existing) {
      suggestions.push(numbered);
    }
    counter++;
  }

  return suggestions;
}

/**
 * Generate a unique subdomain efficiently
 * This replaces the while loop approach with a more efficient strategy
 */
export async function generateUniqueSubdomain(
  ctx: any,
  baseSubdomain: string
): Promise<string> {
  const result = await checkSubdomainAvailability(ctx, baseSubdomain);
  
  if (result.available) {
    return result.subdomain;
  }
  
  // Use the first available suggestion
  if (result.suggestions && result.suggestions.length > 0) {
    return result.suggestions[0];
  }
  
  // Fallback: use timestamp-based subdomain
  return `${baseSubdomain}-${Date.now()}`;
}

// Re-export validateSubdomain from validation.ts for consistency
export { validateSubdomain } from './validation';