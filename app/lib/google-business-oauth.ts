import { OAuth2Client } from "google-auth-library";

// Google Business Profile API OAuth configuration
export const GOOGLE_BUSINESS_SCOPES = [
  "https://www.googleapis.com/auth/business.manage",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export function createGoogleBusinessOAuthClient() {
  const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google-business/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("Google Business OAuth credentials not configured");
  }

  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

export function getGoogleBusinessAuthUrl(state: string) {
  const client = createGoogleBusinessOAuthClient();

  return client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_BUSINESS_SCOPES,
    state,
    prompt: "consent", // Force consent to ensure we get refresh token
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = createGoogleBusinessOAuthClient();
  const response = await client.getToken(code);

  if (!response || !response.tokens) {
    throw new Error("Failed to exchange code for tokens - no tokens received");
  }

  const { tokens } = response;

  if (!tokens.refresh_token) {
    throw new Error("No refresh token received");
  }

  return tokens;
}

export async function refreshAccessToken(refreshToken: string) {
  const client = createGoogleBusinessOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await client.refreshAccessToken();
  return credentials;
}

export async function getBusinessAccounts(accessToken: string) {
  const response = await fetch(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch business accounts: ${response.statusText}`,
    );
  }

  return response.json();
}

export async function getBusinessLocations(
  accessToken: string,
  accountId: string,
) {
  const response = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch business locations: ${response.statusText}`,
    );
  }

  return response.json();
}

export async function verifyBusinessOwnership(
  accessToken: string,
  locationId: string,
) {
  const response = await fetch(
    `https://mybusinessverifications.googleapis.com/v1/locations/${locationId}/verifications`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch verification status: ${response.statusText}`,
    );
  }

  return response.json();
}
