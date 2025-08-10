import { Resend } from 'resend';
import { logger } from './logger';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

// Send email function
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
}) {
  if (!resend) {
    logger.warn('Email service not configured. Please set RESEND_API_KEY environment variable.');
    // In development, log the email content instead
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`📧 Email would be sent to: ${to}`, {
        metadata: { subject, hasHtml: !!html, hasText: !!text }
      });
      return { success: true, id: 'dev-mode-email' };
    }
    throw new Error('Email service not configured');
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject,
      html,
      text,
    });

    return { success: true, id: result.data?.id || 'unknown' };
  } catch (error) {
    logger.error('Failed to send email', error, { metadata: { to, subject } });
    throw new Error('Failed to send email');
  }
}

// Send verification email
export async function sendVerificationEmail(
  businessName: string,
  businessEmail: string,
  verificationUrl: string
) {
  const emailContent = getVerificationEmailTemplate(businessName, verificationUrl, businessEmail);
  
  return await sendEmail({
    to: businessEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });
}