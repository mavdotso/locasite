import { Resend } from 'resend';
import { logger } from './logger';
import { validateEmail } from './validation';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Helper function to mask email addresses for logging
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'invalid-email';
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.length > 2 
    ? localPart.substring(0, 2) + '***' 
    : '***';
  return `${maskedLocal}@${domain}`;
}

// Email template for verification
const getVerificationEmailTemplate = (businessName: string, verificationUrl: string, businessEmail: string) => {
  return {
    subject: `Verify your ownership of ${businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Business Ownership</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f7f7f7;
            }
            .container {
              background-color: white;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #2563eb;
              margin-bottom: 24px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 24px 0;
            }
            .button:hover {
              background-color: #1d4ed8;
            }
            .footer {
              margin-top: 32px;
              padding-top: 24px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
            }
            .link {
              word-break: break-all;
              color: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verify Your Business Ownership</h1>
            
            <p>Hello,</p>
            
            <p>You've requested to claim ownership of <strong>${businessName}</strong> on our platform.</p>
            
            <p>To complete the verification process and gain full control of your business listing, please click the button below:</p>
            
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p class="link">${verificationUrl}</p>
            
            <p>This verification link will expire in 24 hours for security reasons.</p>
            
            <div class="footer">
              <p><strong>Why am I receiving this?</strong></p>
              <p>Someone requested to claim the business "${businessName}" using the email address ${businessEmail}. If this wasn't you, you can safely ignore this email.</p>
              <p>This link will expire and no changes will be made to the business listing.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Verify Your Business Ownership

Hello,

You've requested to claim ownership of ${businessName} on our platform.

To complete the verification process and gain full control of your business listing, please visit:

${verificationUrl}

This verification link will expire in 24 hours for security reasons.

Why am I receiving this?
Someone requested to claim the business "${businessName}" using the email address ${businessEmail}. If this wasn't you, you can safely ignore this email. This link will expire and no changes will be made to the business listing.
    `
  };
};

// Send email function with validation
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ success: boolean; id: string; error?: string }> {
  // Validate email address
  const emailValidation = validateEmail(to);
  if (!emailValidation.valid) {
    logger.warn(`Invalid email address: ${maskEmail(to)}`, { metadata: { error: emailValidation.error } });
    return { success: false, id: '', error: emailValidation.error };
  }
  
  // Validate subject
  if (!subject || subject.trim().length === 0) {
    return { success: false, id: '', error: 'Email subject is required' };
  }
  
  // Validate content
  if (!html && !text) {
    return { success: false, id: '', error: 'Email content is required' };
  }
  
  if (!resend) {
    logger.warn('Email service not configured. Please set RESEND_API_KEY environment variable.');
    // In development, log the email content instead
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`📧 Email would be sent to: ${maskEmail(to)}`, {
        metadata: { subject, hasHtml: !!html, hasText: !!text }
      });
      return { success: true, id: 'dev-mode-email' };
    }
    return { success: false, id: '', error: 'Email service not configured' };
  }

  // Get from email from environment or use default for development
  const fromEmail = process.env.RESEND_FROM_EMAIL || 
    (process.env.NODE_ENV === 'development' ? 'onboarding@resend.dev' : undefined);
    
  if (!fromEmail) {
    logger.error('RESEND_FROM_EMAIL environment variable not set', new Error('Missing configuration'), {});
    return { success: false, id: '', error: 'Email configuration error' };
  }

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: to.trim().toLowerCase(),
      subject: subject.trim(),
      html,
      text,
    });

    // Check if the response contains an error (non-throwing errors)
    if (result.error || !result.data) {
      logger.error('Email send failed with provider error', 
        new Error(result.error?.message || 'Unknown provider error'), 
        { 
          metadata: { 
            to: maskEmail(to), 
            subject,
            errorName: result.error?.name,
            errorMessage: result.error?.message 
          } 
        }
      );
      // Return generic error message to avoid leaking provider details
      return { 
        success: false, 
        id: '', 
        error: 'Failed to send email. Please try again later.' 
      };
    }

    logger.info(`Email sent successfully to ${maskEmail(to)}`, { 
      metadata: { emailId: result.data.id, subject } 
    });
    
    return { success: true, id: result.data.id || 'unknown' };
  } catch (error) {
    // Log detailed error internally
    logger.error('Failed to send email - exception thrown', error as Error, { 
      metadata: { 
        to: maskEmail(to), 
        subject,
        errorDetails: error instanceof Error ? error.stack : String(error)
      } 
    });
    // Return generic error message to avoid leaking sensitive details
    return { 
      success: false, 
      id: '', 
      error: 'Failed to send email. Please try again later.' 
    };
  }
}

// Send verification email with validation
export async function sendVerificationEmail(
  businessName: string,
  businessEmail: string,
  verificationUrl: string
): Promise<{ success: boolean; id: string; error?: string }> {
  // Validate inputs
  if (!businessName || businessName.trim().length === 0) {
    return { success: false, id: '', error: 'Business name is required for verification email' };
  }
  
  // Validate verification URL
  let canonicalUrl: URL;
  try {
    canonicalUrl = new URL(verificationUrl);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
    
    if (!appUrl) {
      return { success: false, id: '', error: 'App URL not configured' };
    }
    
    const expectedHost = new URL(appUrl).host;
    if (canonicalUrl.host !== expectedHost) {
      return { success: false, id: '', error: `Invalid verification URL - host mismatch` };
    }
    
    // Enforce HTTPS in production, allow HTTP only in development
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    
    if (isProduction && canonicalUrl.protocol !== 'https:') {
      return { success: false, id: '', error: 'Verification URL must use HTTPS in production' };
    }
    
    if (canonicalUrl.protocol !== 'https:' && canonicalUrl.protocol !== 'http:') {
      return { success: false, id: '', error: 'Invalid verification URL protocol' };
    }
    
    // Allow HTTP only in development/test environments
    if (canonicalUrl.protocol === 'http:' && !isDevelopment) {
      return { success: false, id: '', error: 'HTTP protocol is only allowed in development' };
    }
  } catch (error) {
    return { success: false, id: '', error: 'Invalid verification URL format' };
  }
  
  // Use the canonical URL string from the validated URL object
  const canonicalUrlString = canonicalUrl.toString();
  const emailContent = getVerificationEmailTemplate(businessName, canonicalUrlString, businessEmail);
  
  return await sendEmail({
    to: businessEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });
}