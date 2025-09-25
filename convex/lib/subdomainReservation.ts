

import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { ConvexError } from "convex/values";

const RESERVATION_EXPIRY_MS = 5 * 60 * 1000;

export async function tryReserveSubdomain(
  ctx: MutationCtx,
  subdomain: string,
  temporary: boolean = true
): Promise<Id<"subdomainReservations"> | null> {

  const existing = await ctx.db
    .query("subdomainReservations")
    .withIndex("by_subdomain", q => q.eq("subdomain", subdomain))
    .first();

  if (existing) {

    if (
      existing.status === "reserved" &&
      existing.expiresAt &&
      existing.expiresAt < Date.now()
    ) {

      await ctx.db.delete(existing._id);
    } else {

      return null;
    }
  }

  try {
    const reservationId = await ctx.db.insert("subdomainReservations", {
      subdomain,
      createdAt: Date.now(),
      status: temporary ? "reserved" : "active",
      expiresAt: temporary ? Date.now() + RESERVATION_EXPIRY_MS : undefined,
    });
    return reservationId;
  } catch (error) {

    console.error("Failed to reserve subdomain:", error);
    return null;
  }
}

export async function confirmReservation(
  ctx: MutationCtx,
  reservationId: Id<"subdomainReservations">,
  domainId: Id<"domains">
): Promise<void> {
  const reservation = await ctx.db.get(reservationId);
  if (!reservation) {
    throw new ConvexError("Reservation not found");
  }

  await ctx.db.patch(reservationId, {
    status: "active",
    domainId,
    expiresAt: undefined,
  });
}

export async function releaseReservation(
  ctx: MutationCtx,
  reservationId: Id<"subdomainReservations">
): Promise<void> {
  try {
    await ctx.db.delete(reservationId);
  } catch (error) {
    console.error("Failed to release reservation:", error);
  }
}

export async function isSubdomainAvailable(
  ctx: QueryCtx | MutationCtx,
  subdomain: string
): Promise<boolean> {
  const reservation = await ctx.db
    .query("subdomainReservations")
    .withIndex("by_subdomain", q => q.eq("subdomain", subdomain))
    .first();

  if (!reservation) {
    return true;
  }

  if (
    reservation.status === "reserved" &&
    reservation.expiresAt &&
    reservation.expiresAt < Date.now()
  ) {
    return true;
  }

  return false;
}

export async function cleanupExpiredReservations(
  ctx: MutationCtx
): Promise<number> {
  const now = Date.now();
  const expired = await ctx.db
    .query("subdomainReservations")
    .withIndex("by_expires", q =>
      q.gte("expiresAt", 1).lt("expiresAt", now)
    )
    .filter(q => q.eq(q.field("status"), "reserved"))
    .collect();

  let cleaned = 0;
  for (const reservation of expired) {
    await ctx.db.delete(reservation._id);
    cleaned++;
  }

  return cleaned;
}

export async function generateAndReserveUniqueSubdomain(
  ctx: MutationCtx,
  baseSubdomain: string,
  maxAttempts: number = 10
): Promise<{ subdomain: string; reservationId: Id<"subdomainReservations"> } | null> {

  const subdomain = baseSubdomain
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  let reservationId = await tryReserveSubdomain(ctx, subdomain);
  if (reservationId) {
    return { subdomain, reservationId };
  }

  for (let i = 1; i <= maxAttempts; i++) {
    const candidate = `${subdomain}-${i}`;
    reservationId = await tryReserveSubdomain(ctx, candidate);
    if (reservationId) {
      return { subdomain: candidate, reservationId };
    }
  }

  const timestampSubdomain = `${subdomain}-${Date.now()}`;
  reservationId = await tryReserveSubdomain(ctx, timestampSubdomain);
  if (reservationId) {
    return { subdomain: timestampSubdomain, reservationId };
  }

  return null;
}