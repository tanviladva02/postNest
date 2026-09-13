import { NextResponse } from 'next/server';
import { buildGoogleAuthUrl, isGoogleAuthConfigured } from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const redirectParam = searchParams.get('redirect') || '/dashboard';

    // Verify Google keys are present
    if (!isGoogleAuthConfigured()) {
      return NextResponse.redirect(
        new URL('/login?error=google_not_configured', req.url)
      );
    }

    const { authUrl, stateToken } = buildGoogleAuthUrl(redirectParam, req.url);

    const response = NextResponse.redirect(authUrl);

    // Set secure short-lived state cookie for CSRF validation (10 minutes)
    response.cookies.set('pn_oauth_state', stateToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error initiating Google OAuth:', error);
    return NextResponse.redirect(
      new URL('/login?error=oauth_init_failed', req.url)
    );
  }
}
