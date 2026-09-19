import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { getCurrentUser } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'postnest_super_secret_fallback_key';

// In-memory atomic registry of consumed nonces (TTL: 15 minutes)
// Automatically purges expired nonces periodically
const consumedNonces = new Map<string, number>();

function purgeExpiredNonces() {
  const now = Date.now();
  for (const [nonce, expiresAt] of consumedNonces.entries()) {
    if (now > expiresAt) {
      consumedNonces.delete(nonce);
    }
  }
}

// Interval to cleanup old consumed nonces every 5 minutes
setInterval(purgeExpiredNonces, 5 * 60 * 1000);

export interface CsrfPayload {
  userId: string;
  nonce: string;
  timestamp: number;
  action: string;
}

/**
 * Generates a signed, single-use Anti-CSRF token for an authenticated user.
 */
export function generateCsrfToken(userId: string, action: string = 'web-publish'): string {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();

  const payload: CsrfPayload = {
    userId,
    nonce,
    timestamp,
    action,
  };

  // Sign with JWT_SECRET (valid for 10 minutes)
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' });
}

export interface CsrfValidationResult {
  valid: boolean;
  error?: string;
  statusCode?: number;
}

/**
 * Validates and atomically consumes a single-use Anti-CSRF token.
 * Prevents Replay Attacks: Once consumed, the same token CANNOT be used again!
 */
export function verifyAndConsumeCsrfToken(
  tokenString: string,
  expectedUserId: string,
  expectedAction: string = 'web-publish'
): CsrfValidationResult {
  if (!tokenString || typeof tokenString !== 'string') {
    return {
      valid: false,
      statusCode: 403,
      error: 'Security Error: Missing Anti-CSRF request token. Programmatic script execution blocked on web editor routes. Please use official API Keys at /api/v1/posts.',
    };
  }

  try {
    const payload = jwt.verify(tokenString, JWT_SECRET) as CsrfPayload;

    if (!payload || !payload.userId || !payload.nonce) {
      return {
        valid: false,
        statusCode: 403,
        error: 'Security Error: Invalid Anti-CSRF token signature.',
      };
    }

    if (payload.userId !== expectedUserId) {
      return {
        valid: false,
        statusCode: 403,
        error: 'Security Error: Token user mismatch. This session token belongs to a different account.',
      };
    }

    if (payload.action !== expectedAction) {
      return {
        valid: false,
        statusCode: 403,
        error: 'Security Error: Token action mismatch.',
      };
    }

    // Check if token has been replayed (already consumed)
    if (consumedNonces.has(payload.nonce)) {
      return {
        valid: false,
        statusCode: 403,
        error: 'Replay Attack Blocked: This single-use request token has already been executed once. Replaying copied DevTools requests in terminal/scripts is strictly blocked. Please refresh the editor for a new token.',
      };
    }

    // Atomically mark nonce as consumed (valid for 15 minutes before memory cleanup)
    const expiresAt = Date.now() + 15 * 60 * 1000;
    consumedNonces.set(payload.nonce, expiresAt);

    return { valid: true };
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return {
        valid: false,
        statusCode: 403,
        error: 'Security Error: Anti-CSRF request token has expired (10 minute limit). Please refresh your browser editor.',
      };
    }

    return {
      valid: false,
      statusCode: 403,
      error: 'Security Error: Anti-CSRF token verification failed.',
    };
  }
}

/**
 * Validates Origin and Referer headers against allowed domains.
 * Blocks Cross-Origin attacks and external malicious site requests.
 */
export function validateSameOrigin(req: Request): CsrfValidationResult {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.postnest.in';

  // Allowed origins list
  const allowedOrigins = [
    appUrl.toLowerCase(),
    'https://www.postnest.in',
    'https://postnest.in',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  if (host) {
    allowedOrigins.push(`http://${host}`.toLowerCase());
    allowedOrigins.push(`https://${host}`.toLowerCase());
  }

  if (origin) {
    const cleanOrigin = origin.toLowerCase().trim();
    const isAllowed = allowedOrigins.some((allowed) => cleanOrigin === allowed || cleanOrigin.startsWith(allowed));
    if (!isAllowed) {
      return {
        valid: false,
        statusCode: 403,
        error: `Cross-Origin Request Blocked: Origin "${origin}" is not authorized to execute web APIs.`,
      };
    }
  }

  if (referer) {
    const cleanReferer = referer.toLowerCase().trim();
    const isAllowed = allowedOrigins.some((allowed) => cleanReferer.startsWith(allowed));
    if (!isAllowed) {
      return {
        valid: false,
        statusCode: 403,
        error: `Cross-Origin Request Blocked: Referer "${referer}" is not authorized to execute web APIs.`,
      };
    }
  }

  return { valid: true };
}
