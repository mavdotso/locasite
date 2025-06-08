# Production Deployment Guide

This guide covers deploying Locasite to production with full Google Business Profile verification.

## Pre-Deployment Checklist

### 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

**Critical variables for business verification:**
- `GOOGLE_BUSINESS_CLIENT_ID` - OAuth client ID for Business Profile API
- `GOOGLE_BUSINESS_CLIENT_SECRET` - OAuth client secret (keep secure!)
- `NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID` - Public client ID for frontend
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `CONVEX_DEPLOYMENT` - Your Convex deployment URL
- `AUTH_SECRET` - Random secret for authentication

### 2. Google Cloud Setup

1. **Enable APIs:**
   - Google My Business API
   - Google Business Profile API
   - Google OAuth2 API

2. **Create OAuth Credentials:**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID for "Web application"
   - Add your production domain to authorized origins
   - Add callback URL: `https://yourdomain.com/api/auth/google-business/callback`

3. **Configure OAuth Consent Screen:**
   - Add required scopes: `business.manage`, `openid`, `email`, `profile`
   - Submit for verification if external users will use it
   - Add test users during development

### 3. Convex Deployment

```bash
# Deploy Convex functions
npx convex deploy --prod

# Set production environment variables in Convex dashboard
npx convex env set AUTH_SECRET your-secret-here --prod
npx convex env set OPENAI_API_KEY your-key-here --prod
```

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Make sure `NEXT_PUBLIC_APP_URL` matches your Vercel domain

3. **Custom Domain:**
   - Add your custom domain in Vercel dashboard
   - Update Google OAuth redirect URIs to match
   - Update `NEXT_PUBLIC_APP_URL` environment variable

### Netlify

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18.x

2. **Environment Variables:**
   - Add all variables in Netlify dashboard
   - Ensure `NEXT_PUBLIC_APP_URL` matches your Netlify domain

### Railway

1. **Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

2. **Environment Variables:**
   - Set variables using Railway dashboard or CLI
   - Ensure proper domain configuration

## SSL/HTTPS Configuration

**Important:** Google OAuth requires HTTPS in production.

- Vercel/Netlify provide automatic SSL
- For custom deployments, ensure SSL certificates are configured
- Update all OAuth redirect URIs to use `https://`

## Domain Configuration

### Multi-tenant Subdomain Setup

1. **DNS Configuration:**
   ```
   # Add CNAME records for wildcard subdomains
   *.yourdomain.com CNAME yourdomain.vercel.app
   ```

2. **Vercel Domain Configuration:**
   - Add `yourdomain.com` as custom domain
   - Add `*.yourdomain.com` as wildcard domain
   - Wait for DNS propagation

### OAuth Redirect URIs

Update Google OAuth configuration with:
- `https://yourdomain.com/api/auth/google-business/callback`
- `https://app.yourdomain.com/api/auth/google-business/callback` (if using app subdomain)

## Post-Deployment Testing

### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] User authentication works
- [ ] Business site creation works
- [ ] Dashboard is accessible

### 2. Business Claiming Flow
- [ ] Navigate to a business page
- [ ] Click "Claim This Business"
- [ ] Sign in flow works
- [ ] Claim form submission works
- [ ] Verification page loads

### 3. Google Verification
- [ ] "Verify with Google" button works
- [ ] Redirects to Google OAuth consent screen
- [ ] Shows correct app name and permissions
- [ ] Callback URL works
- [ ] Verification completes successfully
- [ ] Error handling works for failed verifications

### 4. Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals are green
- [ ] Mobile responsiveness works
- [ ] Error monitoring captures issues

## Monitoring and Maintenance

### 1. Error Monitoring
Add Sentry or similar:
```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  {
    // Your Next.js config
  },
  {
    silent: true,
    org: "your-org",
    project: "locasite",
  }
);
```

### 2. Analytics
- Set up Google Analytics 4
- Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to environment variables
- Monitor business verification success rates

### 3. API Quotas
Monitor Google Business Profile API usage:
- Default: 10,000 requests/day
- Request quota increases if needed
- Set up alerts for quota usage

### 4. Database Backups
- Convex handles automatic backups
- Consider additional backup strategies for critical data
- Test restoration procedures

## Security Considerations

### 1. Environment Variables
- Never commit secrets to git
- Use different secrets for staging/production
- Rotate secrets regularly

### 2. OAuth Security
- Validate state parameters to prevent CSRF
- Use secure random state generation
- Implement proper token validation

### 3. Rate Limiting
Consider adding rate limiting for:
- Business claim submissions
- OAuth callback endpoints
- API routes

### 4. Content Security Policy
Add CSP headers for additional security:
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
```

## Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch:**
   - Check Google Console authorized redirect URIs
   - Ensure exact URL match including protocol and trailing slashes

2. **Environment Variables Not Loading:**
   - Check variable names match exactly
   - Restart deployment after changes
   - Use deployment platform's variable interface

3. **Google API Quota Exceeded:**
   - Monitor usage in Google Console
   - Request quota increase
   - Implement caching for API responses

4. **SSL Certificate Issues:**
   - Ensure domain is properly configured
   - Check DNS propagation
   - Use SSL checker tools

5. **Business Verification Fails:**
   - User must be business owner/manager on Google
   - Business must be verified on Google Business Profile
   - Check API permissions and scopes

## Support Resources

- [Google Business Profile API Docs](https://developers.google.com/my-business)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Convex Production Guide](https://docs.convex.dev/production)
- [Vercel Domain Configuration](https://vercel.com/docs/concepts/projects/custom-domains)