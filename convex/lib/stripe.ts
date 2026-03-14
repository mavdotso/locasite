import Stripe from "stripe";
import { convexEnv } from "./env";

if (!convexEnv.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

export const stripe = new Stripe(convexEnv.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});
