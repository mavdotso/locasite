/**
 * Utilities for subdomain generation and validation
 */

import { QueryCtx, MutationCtx } from "../_generated/server";

// Type for context that can be either Query or Mutation
type Ctx = QueryCtx | MutationCtx;

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
  ctx: Ctx,
  baseSubdomain: string
): Promise<{
  available: boolean;
  subdomain: string;
  suggestions?: string[];
}> {
  // Check if the base subdomain is available
  const existing = await ctx.db
    .query("domains")
    .withIndex("by_subdomain", (q) => q.eq("subdomain", baseSubdomain))
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
  ctx: Ctx,
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

  // Collect all candidates from all strategies first
  const allCandidates: string[] = [];
  for (const strategy of strategies) {
    const candidates = strategy()
      .filter(c => c.length >= MIN_SUBDOMAIN_LENGTH && c.length <= MAX_SUBDOMAIN_LENGTH);
    allCandidates.push(...candidates);
  }
  
  // Batch check availability for all candidates at once
  const availabilityPromises = allCandidates.map(async (candidate) => {
    const existing = await ctx.db
      .query("domains")
      .withIndex("by_subdomain", (q) => q.eq("subdomain", candidate))
      .first();
    return { candidate, available: !existing };
  });
  
  // Process results and collect available suggestions
  const results = await Promise.all(availabilityPromises);
  for (const { candidate, available } of results) {
    if (available && suggestions.length < maxSuggestions) {
      suggestions.push(candidate);
    }
    if (suggestions.length >= maxSuggestions) {
      return suggestions;
    }
  }

  // If we still don't have enough suggestions, add numbered versions
  if (suggestions.length < maxSuggestions) {
    const numberedCandidates: string[] = [];
    for (let counter = 1; counter <= MAX_NUMBERED_ATTEMPTS && numberedCandidates.length < (maxSuggestions - suggestions.length); counter++) {
      numberedCandidates.push(`${baseSubdomain}${counter}`);
    }
    
    // Batch check numbered candidates
    const numberedPromises = numberedCandidates.map(async (candidate) => {
      const existing = await ctx.db
        .query("domains")
        .withIndex("by_subdomain", (q) => q.eq("subdomain", candidate))
        .first();
      return { candidate, available: !existing };
    });
    
    const numberedResults = await Promise.all(numberedPromises);
    for (const { candidate, available } of numberedResults) {
      if (available && suggestions.length < maxSuggestions) {
        suggestions.push(candidate);
      }
    }
  }

  return suggestions;
}

/**
 * Generate a unique subdomain efficiently
 * This replaces the while loop approach with a more efficient strategy
 */
export async function generateUniqueSubdomain(
  ctx: Ctx,
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