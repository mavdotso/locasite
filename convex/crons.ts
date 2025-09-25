/**
 * Scheduled tasks and background jobs
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Clean up expired subdomain reservations every hour
crons.interval(
  "cleanup expired subdomain reservations",
  { hours: 1 },
  internal.subdomainMaintenance.cleanupExpiredReservations,
);

export default crons;