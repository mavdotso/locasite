

import { internalMutation } from "./_generated/server";

export const cleanupExpiredReservations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const { cleanupExpiredReservations } = await import("./lib/subdomainReservation");
    const cleaned = await cleanupExpiredReservations(ctx);

    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} expired subdomain reservations`);
    }

    return { cleaned };
  },
});