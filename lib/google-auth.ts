import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}

/**
 * Returns the base application URL
 */
export function getAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

/**
 * Returns the configured Google OAuth callback URL
 */
export function getGoogleCallbackUrl(): string {
  return `${getAppUrl()}/api/auth/google/callback`;
}

/**
 * Checks whether Google OAuth is properly configured with real credentials
 */
export function isGoogleAuthConfigured(): boolean {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) return false;
  if (clientId.includes('your_google_client_id') || clientSecret.includes('your_google_client_secret')) return false;

  return true;
}

/**
 * Creates the Google authorization redirect URL and a secure state token
 */
export function buildGoogleAuthUrl(redirectUrl: string = '/dashboard'): { authUrl: string; stateToken: string } {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }

  // Generate a random CSRF nonce and pack the target redirect path
  const nonce = crypto.randomBytes(16).toString('hex');
  const safeRedirect = redirectUrl.startsWith('/') ? redirectUrl : '/dashboard';
  const statePayload = JSON.stringify({ nonce, redirect: safeRedirect });
  const stateToken = Buffer.from(statePayload).toString('base64url');

  const redirectUri = getGoogleCallbackUrl();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state: stateToken,
    access_type: 'offline',
    prompt: 'select_account',
  });

  return {
    authUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    stateToken,
  };
}

/**
 * Parses and validates the state parameter from Google OAuth callback
 */
export function parseOAuthState(stateToken: string | null): { nonce: string; redirect: string } | null {
  if (!stateToken) return null;
  try {
    const decoded = Buffer.from(stateToken, 'base64url').toString('utf-8');
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.nonce === 'string' && typeof parsed.redirect === 'string') {
      return {
        nonce: parsed.nonce,
        redirect: parsed.redirect.startsWith('/') ? parsed.redirect : '/dashboard',
      };
    }
  } catch (err) {
    return null;
  }
  return null;
}

/**
 * Exchanges the Google authorization code for access and ID tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getGoogleCallbackUrl();

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials are not properly configured.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Failed to exchange authorization code for Google tokens.');
  }

  return data as GoogleTokenResponse;
}

/**
 * Fetches user profile from Google using the access token
 */
export async function getGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch Google user profile: ${errorBody}`);
  }

  const profile: GoogleUserProfile = await response.json();
  if (!profile.email) {
    throw new Error('No email address returned from Google account.');
  }

  return profile;
}

/**
 * Generates a clean, unique username for a new Google OAuth user
 */
export async function generateUniqueUsername(name: string, email: string): Promise<string> {
  // Try name first, or email prefix
  let base = (name || email.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 18);

  if (!base || base.length < 3) {
    base = (email.split('@')[0] || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 18);
  }

  if (base.length < 3) {
    base = `author_${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Check if base is already available
  let username = base;
  let exists = await prisma.user.findUnique({ where: { username } });

  if (!exists) {
    return username;
  }

  // If taken, try suffixing with random numbers
  for (let i = 0; i < 10; i++) {
    const suffix = Math.floor(100 + Math.random() * 900);
    const candidate = `${base.slice(0, 15)}_${suffix}`;
    exists = await prisma.user.findUnique({ where: { username: candidate } });
    if (!exists) {
      return candidate;
    }
  }

  // Fallback with timestamp slice
  return `${base.slice(0, 10)}_${Date.now().toString().slice(-5)}`;
}
