# Google Business Profile Verification Setup Guide

This guide walks you through setting up real Google Business Profile verification for Locasite.

## Prerequisites

1. A Google Cloud Project
2. Access to Google Cloud Console
3. A verified domain for OAuth redirect URIs

## Step 1: Enable Google Business Profile API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Google My Business API" or "Business Profile API"
5. Click on it and press "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in required fields (app name, support email, etc.)
   - Add your domain to authorized domains
   - Add the scope: `https://www.googleapis.com/auth/business.manage`
   - Save and continue

4. For the OAuth client:
   - Application type: "Web application"
   - Name: "Locasite Business Verification"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google-business/callback`
     - `https://yourdomain.com/api/auth/google-business/callback`
   - Click "Create"

5. Save the Client ID and Client Secret

## Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Existing Google OAuth (for authentication)
AUTH_GOOGLE_ID=your-auth-client-id
AUTH_GOOGLE_SECRET=your-auth-client-secret

# New Google Business Profile OAuth (for verification)
GOOGLE_BUSINESS_CLIENT_ID=your-business-client-id
GOOGLE_BUSINESS_CLIENT_SECRET=your-business-client-secret
NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID=your-business-client-id

# Make sure these are set
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

## Step 4: OAuth Consent Screen Configuration

1. Go to "APIs & Services" > "OAuth consent screen"
2. Add test users if in development
3. For production, submit for verification
4. Required scopes:
   - `https://www.googleapis.com/auth/business.manage`
   - `openid`
   - `email`
   - `profile`

## Step 5: Testing the Integration

1. Start your development server
2. Navigate to a business claiming page
3. Click "Claim This Business"
4. Sign in if required
5. Click "Verify with Google Business Profile"
6. You should be redirected to Google's OAuth consent screen
7. Authorize access to your business listings
8. You'll be redirected back and the verification will complete

## Important Notes

### API Quotas and Limits
- The Google Business Profile API has quotas
- Default is 10,000 requests per day
- Can be increased by requesting quota increase

### Verification Requirements
- User must be an owner or manager of the business on Google
- Business must be verified on Google Business Profile
- User must grant access to business.manage scope

### Security Considerations
- Never expose your client secret in client-side code
- Use state parameter to prevent CSRF attacks
- Validate all tokens server-side
- Store access tokens securely (encrypted in database)

### Error Handling
Common errors and solutions:
- `403 Forbidden`: User doesn't have access to the business
- `404 Not Found`: Business doesn't exist or place ID is wrong
- `401 Unauthorized`: Token expired or invalid

## Production Checklist

- [ ] Enable Google Business Profile API in production project
- [ ] Create production OAuth credentials
- [ ] Update authorized domains and redirect URIs
- [ ] Submit OAuth consent screen for verification
- [ ] Implement token refresh logic
- [ ] Add error monitoring for API failures
- [ ] Set up alerts for quota usage
- [ ] Test with real business accounts
- [ ] Implement fallback verification methods

## Support Resources

- [Google Business Profile API Documentation](https://developers.google.com/my-business)
- [OAuth 2.0 for Web Apps](https://developers.google.com/identity/protocols/oauth2/web-server)
- [API Explorer](https://developers.google.com/apis-explorer/#p/mybusiness/v4/)