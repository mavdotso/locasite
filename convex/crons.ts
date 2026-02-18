

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "cleanup expired subdomain reservations",
  { hours: 1 },
  internal.subdomainMaintenance.cleanupExpiredReservations,
);

export default crons;