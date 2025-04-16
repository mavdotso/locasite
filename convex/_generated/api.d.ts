/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as businessClaims from "../businessClaims.js";
import type * as businesses from "../businesses.js";
import type * as domains from "../domains.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as pages from "../pages.js";
import type * as scrape from "../scrape.js";
import type * as storage from "../storage.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  businessClaims: typeof businessClaims;
  businesses: typeof businesses;
  domains: typeof domains;
  helpers: typeof helpers;
  http: typeof http;
  pages: typeof pages;
  scrape: typeof scrape;
  storage: typeof storage;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
