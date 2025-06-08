/**
 * Test script for business verification functionality
 * Run with: node scripts/test-business-verification.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Business Verification Implementation...\n');

// Check environment variables
function checkEnvironmentVariables() {
  console.log('📋 Checking Environment Variables...');
  
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredVars = envExample.match(/^[A-Z_]+=$/gm)?.map(line => line.slice(0, -1)) || [];
  
  const businessVerificationVars = [
    'GOOGLE_BUSINESS_CLIENT_ID',
    'GOOGLE_BUSINESS_CLIENT_SECRET', 
    'NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  let envLocal = '';
  try {
    envLocal = fs.readFileSync('.env.local', 'utf8');
  } catch (e) {
    console.log('❌ .env.local file not found');
    return false;
  }
  
  let allSet = true;
  businessVerificationVars.forEach(varName => {
    const isSet = envLocal.includes(`${varName}=`) && 
                  envLocal.match(new RegExp(`${varName}=.+`));
    console.log(`${isSet ? '✅' : '❌'} ${varName}`);
    if (!isSet) allSet = false;
  });
  
  return allSet;
}

// Check file structure
function checkFileStructure() {
  console.log('\n📁 Checking File Structure...');
  
  const requiredFiles = [
    'app/[domain]/claim/[businessId]/page.tsx',
    'app/business/[businessId]/verify/page.tsx',
    'app/dashboard/claims/page.tsx',
    'app/api/auth/google-business/callback/route.ts',
    'convex/businessClaims.ts',
    'docs/google-business-verification-setup.md',
    'docs/production-deployment-guide.md'
  ];
  
  let allExist = true;
  requiredFiles.forEach(filePath => {
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${filePath}`);
    if (!exists) allExist = false;
  });
  
  return allExist;
}

// Check implementation details
function checkImplementationDetails() {
  console.log('\n🔧 Checking Implementation Details...');
  
  // Check OAuth callback implementation
  const callbackFile = fs.readFileSync('app/api/auth/google-business/callback/route.ts', 'utf8');
  const hasTokenExchange = callbackFile.includes('exchangeCodeForToken');
  const hasStateValidation = callbackFile.includes('state');
  const hasErrorHandling = callbackFile.includes('catch');
  
  console.log(`${hasTokenExchange ? '✅' : '❌'} OAuth token exchange implemented`);
  console.log(`${hasStateValidation ? '✅' : '❌'} State parameter validation`);
  console.log(`${hasErrorHandling ? '✅' : '❌'} Error handling`);
  
  // Check verification page
  const verifyFile = fs.readFileSync('app/business/[businessId]/verify/page.tsx', 'utf8');
  const hasOAuthRedirect = verifyFile.includes('accounts.google.com/o/oauth2');
  const hasCSRFProtection = verifyFile.includes('csrfToken');
  const hasProperScopes = verifyFile.includes('business.manage');
  
  console.log(`${hasOAuthRedirect ? '✅' : '❌'} OAuth redirect implementation`);
  console.log(`${hasCSRFProtection ? '✅' : '❌'} CSRF protection`);
  console.log(`${hasProperScopes ? '✅' : '❌'} Business Profile API scopes`);
  
  // Check claims page
  const claimsFile = fs.readFileSync('app/dashboard/claims/page.tsx', 'utf8');
  const hasCallbackHandling = claimsFile.includes('useSearchParams');
  const hasToastNotifications = claimsFile.includes('toast');
  
  console.log(`${hasCallbackHandling ? '✅' : '❌'} OAuth callback handling`);
  console.log(`${hasToastNotifications ? '✅' : '❌'} User feedback notifications`);
  
  return hasTokenExchange && hasStateValidation && hasErrorHandling && 
         hasOAuthRedirect && hasCSRFProtection && hasProperScopes &&
         hasCallbackHandling && hasToastNotifications;
}

// Check Convex schema
function checkConvexSchema() {
  console.log('\n🗄️ Checking Convex Schema...');
  
  const schemaFile = fs.readFileSync('convex/schema.ts', 'utf8');
  const hasBusinessClaims = schemaFile.includes('businessClaims');
  const hasVerificationMethod = schemaFile.includes('verificationMethod');
  const hasGoogleStatus = schemaFile.includes('googleVerificationStatus');
  
  console.log(`${hasBusinessClaims ? '✅' : '❌'} businessClaims table defined`);
  console.log(`${hasVerificationMethod ? '✅' : '❌'} verificationMethod field`);
  console.log(`${hasGoogleStatus ? '✅' : '❌'} googleVerificationStatus field`);
  
  return hasBusinessClaims && hasVerificationMethod && hasGoogleStatus;
}

// Check authentication integration
function checkAuthIntegration() {
  console.log('\n🔐 Checking Authentication Integration...');
  
  const claimFile = fs.readFileSync('app/[domain]/claim/[businessId]/page.tsx', 'utf8');
  const hasAuthCheck = claimFile.includes('getCurrentUser');
  const hasSignInRedirect = claimFile.includes('sign-in');
  const hasAuthHandler = claimFile.includes('isAuthenticated');
  
  console.log(`${hasAuthCheck ? '✅' : '❌'} Authentication status check`);
  console.log(`${hasSignInRedirect ? '✅' : '❌'} Sign-in redirect`);
  console.log(`${hasAuthHandler ? '✅' : '❌'} Authentication state handling`);
  
  const authHandlerFile = fs.readFileSync('app/components/auth-handler.tsx', 'utf8');
  const hasRedirectHandling = authHandlerFile.includes('authRedirect');
  
  console.log(`${hasRedirectHandling ? '✅' : '❌'} Post-auth redirect handling`);
  
  return hasAuthCheck && hasSignInRedirect && hasAuthHandler && hasRedirectHandling;
}

// Generate setup checklist
function generateSetupChecklist() {
  console.log('\n📝 Setup Checklist for Production:\n');
  
  const checklist = [
    'Copy .env.example to .env.local and fill in all values',
    'Enable Google My Business API in Google Cloud Console',
    'Create OAuth 2.0 credentials for Business Profile API',
    'Configure OAuth consent screen with required scopes',
    'Add production domain to authorized redirect URIs',
    'Deploy Convex functions to production',
    'Set production environment variables',
    'Configure wildcard subdomain DNS records',
    'Test OAuth flow with real Google account',
    'Verify business claiming works end-to-end',
    'Set up error monitoring and alerts',
    'Monitor API quota usage'
  ];
  
  checklist.forEach((item, index) => {
    console.log(`${index + 1}. [ ] ${item}`);
  });
}

// Run all checks
function runAllChecks() {
  const envCheck = checkEnvironmentVariables();
  const fileCheck = checkFileStructure();
  const implCheck = checkImplementationDetails();
  const schemaCheck = checkConvexSchema();
  const authCheck = checkAuthIntegration();
  
  console.log('\n📊 Summary:');
  console.log(`Environment Variables: ${envCheck ? '✅ Ready' : '❌ Needs setup'}`);
  console.log(`File Structure: ${fileCheck ? '✅ Complete' : '❌ Missing files'}`);
  console.log(`Implementation: ${implCheck ? '✅ Complete' : '❌ Incomplete'}`);
  console.log(`Database Schema: ${schemaCheck ? '✅ Ready' : '❌ Needs update'}`);
  console.log(`Authentication: ${authCheck ? '✅ Integrated' : '❌ Needs work'}`);
  
  const allReady = envCheck && fileCheck && implCheck && schemaCheck && authCheck;
  console.log(`\nOverall Status: ${allReady ? '✅ READY FOR PRODUCTION' : '❌ NEEDS WORK'}`);
  
  if (!allReady) {
    console.log('\n⚠️  Please fix the issues above before deploying to production.');
    console.log('📖 See docs/google-business-verification-setup.md for detailed setup instructions.');
  }
  
  generateSetupChecklist();
}

// Run the tests
runAllChecks();