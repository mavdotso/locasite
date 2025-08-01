/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiContentGenerator from "../aiContentGenerator.js";
import type * as applyBusinessTemplate from "../applyBusinessTemplate.js";
import type * as auth from "../auth.js";
import type * as businessClaims from "../businessClaims.js";
import type * as businessDomainSync from "../businessDomainSync.js";
import type * as businessEditData from "../businessEditData.js";
import type * as businessPublishing from "../businessPublishing.js";
import type * as businessSeo from "../businessSeo.js";
import type * as businesses from "../businesses.js";
import type * as businessesActions from "../businessesActions.js";
import type * as businessesWithDomain from "../businessesWithDomain.js";
import type * as contactMessages from "../contactMessages.js";
import type * as customDomains from "../customDomains.js";
import type * as dashboardData from "../dashboardData.js";
import type * as domains from "../domains.js";
import type * as emailVerification from "../emailVerification.js";
import type * as http from "../http.js";
import type * as lib_businessDescriptions from "../lib/businessDescriptions.js";
import type * as lib_businessThemePresets_restaurant from "../lib/businessThemePresets/restaurant.js";
import type * as lib_businessThemePresets from "../lib/businessThemePresets.js";
import type * as lib_env from "../lib/env.js";
import type * as lib_helpers from "../lib/helpers.js";
import type * as lib_imageStorage from "../lib/imageStorage.js";
import type * as lib_plans from "../lib/plans.js";
import type * as lib_rateLimiting from "../lib/rateLimiting.js";
import type * as lib_scrape from "../lib/scrape.js";
import type * as lib_stripe from "../lib/stripe.js";
import type * as lib_themePresets from "../lib/themePresets.js";
import type * as lib_themeSchema from "../lib/themeSchema.js";
import type * as lib_themeSuggestions from "../lib/themeSuggestions.js";
import type * as lib_types from "../lib/types.js";
import type * as mediaLibrary from "../mediaLibrary.js";
import type * as pages from "../pages.js";
import type * as pagesSimple from "../pagesSimple.js";
import type * as payments from "../payments.js";
import type * as regenerateAI from "../regenerateAI.js";
import type * as reviewFilter from "../reviewFilter.js";
import type * as router from "../router.js";
import type * as storage from "../storage.js";
import type * as storeBusinessImages from "../storeBusinessImages.js";
import type * as stripe from "../stripe.js";
import type * as subscriptions from "../subscriptions.js";
import type * as themes from "../themes.js";
import type * as uploadBusinessImages from "../uploadBusinessImages.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiContentGenerator: typeof aiContentGenerator;
  applyBusinessTemplate: typeof applyBusinessTemplate;
  auth: typeof auth;
  businessClaims: typeof businessClaims;
  businessDomainSync: typeof businessDomainSync;
  businessEditData: typeof businessEditData;
  businessPublishing: typeof businessPublishing;
  businessSeo: typeof businessSeo;
  businesses: typeof businesses;
  businessesActions: typeof businessesActions;
  businessesWithDomain: typeof businessesWithDomain;
  contactMessages: typeof contactMessages;
  customDomains: typeof customDomains;
  dashboardData: typeof dashboardData;
  domains: typeof domains;
  emailVerification: typeof emailVerification;
  http: typeof http;
  "lib/businessDescriptions": typeof lib_businessDescriptions;
  "lib/businessThemePresets/restaurant": typeof lib_businessThemePresets_restaurant;
  "lib/businessThemePresets": typeof lib_businessThemePresets;
  "lib/env": typeof lib_env;
  "lib/helpers": typeof lib_helpers;
  "lib/imageStorage": typeof lib_imageStorage;
  "lib/plans": typeof lib_plans;
  "lib/rateLimiting": typeof lib_rateLimiting;
  "lib/scrape": typeof lib_scrape;
  "lib/stripe": typeof lib_stripe;
  "lib/themePresets": typeof lib_themePresets;
  "lib/themeSchema": typeof lib_themeSchema;
  "lib/themeSuggestions": typeof lib_themeSuggestions;
  "lib/types": typeof lib_types;
  mediaLibrary: typeof mediaLibrary;
  pages: typeof pages;
  pagesSimple: typeof pagesSimple;
  payments: typeof payments;
  regenerateAI: typeof regenerateAI;
  reviewFilter: typeof reviewFilter;
  router: typeof router;
  storage: typeof storage;
  storeBusinessImages: typeof storeBusinessImages;
  stripe: typeof stripe;
  subscriptions: typeof subscriptions;
  themes: typeof themes;
  uploadBusinessImages: typeof uploadBusinessImages;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  rateLimiter: {
    lib: {
      checkRateLimit: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
      getValue: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          key?: string;
          name: string;
          sampleShards?: number;
        },
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          shard: number;
          ts: number;
          value: number;
        }
      >;
      rateLimit: FunctionReference<
        "mutation",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      resetRateLimit: FunctionReference<
        "mutation",
        "internal",
        { key?: string; name: string },
        null
      >;
    };
    time: {
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
    };
  };
};
