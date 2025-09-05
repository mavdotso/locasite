"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { sendVerificationEmail as sendVerificationEmailUtil } from "./lib/email";
import { logger } from "./lib/logger";

// Internal action to send verification email
export const internal_sendVerificationEmail = internalAction({
  args: {
    businessName: v.string(),
    businessEmail: v.string(),
    verificationUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const emailResult = await sendVerificationEmailUtil(
      args.businessName,
      args.businessEmail,
      args.verificationUrl
    );
    
    if (emailResult.success) {
      logger.emailOperation('verification', args.businessEmail, true);
    } else {
      logger.emailOperation(
        'verification',
        args.businessEmail,
        false,
        new Error(emailResult.error || 'Unknown error')
      );
    }
    
    return emailResult;
  },
});

// Internal action to generate cryptographically secure token
export const internal_generateToken = internalAction({
  args: {},
  handler: async (): Promise<string> => {
    const { randomBytes } = await import("crypto");
    return randomBytes(32).toString("hex");
  },
});