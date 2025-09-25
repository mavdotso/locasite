

import { QueryCtx, MutationCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

const MIN_SUBDOMAIN_LENGTH = 3;
const MAX_SUBDOMAIN_LENGTH = 63;
const DEFAULT_MAX_SUGGESTIONS = 5;
const MAX_NUMBERED_ATTEMPTS = 20;

export async function checkSubdomainAvailability(
  ctx: Ctx,
  baseSubdomain: string
): Promise<{
  available: boolean;
  subdomain: string;
  suggestions?: string[];
}> {
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

  const suggestions = await generateSubdomainSuggestions(ctx, baseSubdomain);
  
  return {
    available: false,
    subdomain: suggestions[0] || `${baseSubdomain}-${Date.now()}`,
    suggestions
  };
}

async function generateSubdomainSuggestions(
  ctx: Ctx,
  baseSubdomain: string,
  maxSuggestions: number = DEFAULT_MAX_SUGGESTIONS
): Promise<string[]> {
  const suggestions: string[] = [];
  const strategies = [

    () => [`${baseSubdomain}-local`, `${baseSubdomain}-nearby`, `${baseSubdomain}-here`],

    () => [`${baseSubdomain}-pro`, `${baseSubdomain}-best`, `${baseSubdomain}-top`],

    () => [`${baseSubdomain}-services`, `${baseSubdomain}-shop`, `${baseSubdomain}-store`],

    () => [`${baseSubdomain}-now`, `${baseSubdomain}-today`, `${baseSubdomain}-24`],

    () => {
      const words = baseSubdomain.split('-');
      if (words.length > 1) {
        const initials = words.map(w => w[0]).join('');
        return [`${initials}-${words[words.length - 1]}`, `${words[0]}-${initials}`];
      }
      return [];
    },

    () => {
      const year = new Date().getFullYear();
      return [
        `${baseSubdomain}-${year}`,
        `${baseSubdomain}-${year % 100}`,
        `${baseSubdomain}-${Math.floor(Math.random() * 100)}`
      ];
    }
  ];

  const allCandidates: string[] = [];
  for (const strategy of strategies) {
    const candidates = strategy()
      .filter(c => c.length >= MIN_SUBDOMAIN_LENGTH && c.length <= MAX_SUBDOMAIN_LENGTH);
    allCandidates.push(...candidates);
  }

  const availabilityPromises = allCandidates.map(async (candidate) => {
    const existing = await ctx.db
      .query("domains")
      .withIndex("by_subdomain", (q) => q.eq("subdomain", candidate))
      .first();
    return { candidate, available: !existing };
  });

  const results = await Promise.all(availabilityPromises);
  for (const { candidate, available } of results) {
    if (available && suggestions.length < maxSuggestions) {
      suggestions.push(candidate);
    }
    if (suggestions.length >= maxSuggestions) {
      return suggestions;
    }
  }

  if (suggestions.length < maxSuggestions) {
    const numberedCandidates: string[] = [];
    for (let counter = 1; counter <= MAX_NUMBERED_ATTEMPTS && numberedCandidates.length < (maxSuggestions - suggestions.length); counter++) {
      numberedCandidates.push(`${baseSubdomain}${counter}`);
    }

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

export async function generateUniqueSubdomain(
  ctx: Ctx,
  baseSubdomain: string
): Promise<string> {
  const result = await checkSubdomainAvailability(ctx, baseSubdomain);
  
  if (result.available) {
    return result.subdomain;
  }

  if (result.suggestions && result.suggestions.length > 0) {
    return result.suggestions[0];
  }

  return `${baseSubdomain}-${Date.now()}`;
}

export { validateSubdomain } from './validation';