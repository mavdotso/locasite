/**
 * Migration to populate subdomain reservations from existing domains
 */

import { internalMutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export const populateSubdomainReservations = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all existing domains
    const domains = await ctx.db.query("domains").collect();

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const domain of domains) {
      try {
        // Check if reservation already exists
        const existingReservation = await ctx.db
          .query("subdomainReservations")
          .withIndex("by_subdomain", q => q.eq("subdomain", domain.subdomain))
          .first();

        if (existingReservation) {
          // Update existing reservation to link to domain if not already linked
          if (!existingReservation.domainId) {
            await ctx.db.patch(existingReservation._id, {
              domainId: domain._id,
              status: "active",
              expiresAt: undefined,
            });
            console.log(`Updated reservation for subdomain: ${domain.subdomain}`);
          }
          skipped++;
          continue;
        }

        // Create new reservation
        await ctx.db.insert("subdomainReservations", {
          subdomain: domain.subdomain,
          domainId: domain._id,
          createdAt: domain.createdAt || Date.now(),
          status: "active",
        });

        created++;
        console.log(`Created reservation for subdomain: ${domain.subdomain}`);
      } catch (error) {
        const errorMsg = `Failed to create reservation for domain ${domain._id} (${domain.subdomain}): ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const result = {
      totalDomains: domains.length,
      reservationsCreated: created,
      reservationsSkipped: skipped,
      errors: errors.length,
      errorDetails: errors,
    };

    console.log("Migration completed:", result);
    return result;
  },
});

// Cleanup orphaned reservations (reservations without domains)
export const cleanupOrphanedReservations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const reservations = await ctx.db
      .query("subdomainReservations")
      .filter(q => q.eq(q.field("status"), "active"))
      .collect();

    let cleaned = 0;
    const errors: string[] = [];

    for (const reservation of reservations) {
      if (!reservation.domainId) {
        continue; // Skip reservations without domain links
      }

      try {
        // Check if the linked domain still exists
        const domain = await ctx.db.get(reservation.domainId);

        if (!domain) {
          // Domain no longer exists, remove the reservation
          await ctx.db.delete(reservation._id);
          cleaned++;
          console.log(`Removed orphaned reservation: ${reservation.subdomain}`);
        }
      } catch (error) {
        const errorMsg = `Failed to check reservation ${reservation._id}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const result = {
      totalReservations: reservations.length,
      orphanedRemoved: cleaned,
      errors: errors.length,
      errorDetails: errors,
    };

    console.log("Cleanup completed:", result);
    return result;
  },
});

// Run both migration and cleanup
export const runFullMigration = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting full subdomain reservation migration...");

    // Populate reservations from existing domains
    const domains = await ctx.db.query("domains").collect();
    let created = 0;
    let skipped = 0;
    const populateErrors: string[] = [];

    for (const domain of domains) {
      try {
        const existingReservation = await ctx.db
          .query("subdomainReservations")
          .withIndex("by_subdomain", q => q.eq("subdomain", domain.subdomain))
          .first();

        if (existingReservation) {
          if (!existingReservation.domainId) {
            await ctx.db.patch(existingReservation._id, {
              domainId: domain._id,
              status: "active",
              expiresAt: undefined,
            });
          }
          skipped++;
          continue;
        }

        await ctx.db.insert("subdomainReservations", {
          subdomain: domain.subdomain,
          domainId: domain._id,
          createdAt: domain.createdAt || Date.now(),
          status: "active",
        });
        created++;
      } catch (error) {
        populateErrors.push(`Domain ${domain._id}: ${error}`);
      }
    }

    // Clean up orphaned reservations
    const reservations = await ctx.db
      .query("subdomainReservations")
      .filter(q => q.eq(q.field("status"), "active"))
      .collect();

    let cleaned = 0;
    const cleanupErrors: string[] = [];

    for (const reservation of reservations) {
      if (!reservation.domainId) continue;

      try {
        const domain = await ctx.db.get(reservation.domainId);
        if (!domain) {
          await ctx.db.delete(reservation._id);
          cleaned++;
        }
      } catch (error) {
        cleanupErrors.push(`Reservation ${reservation._id}: ${error}`);
      }
    }

    const result = {
      populate: {
        totalDomains: domains.length,
        reservationsCreated: created,
        reservationsSkipped: skipped,
        errors: populateErrors.length,
      },
      cleanup: {
        totalReservations: reservations.length,
        orphanedRemoved: cleaned,
        errors: cleanupErrors.length,
      },
      success: populateErrors.length === 0 && cleanupErrors.length === 0,
    };

    console.log("Migration completed:", result);
    return result;
  },
});