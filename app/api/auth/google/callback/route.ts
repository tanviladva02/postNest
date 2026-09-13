import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import {
  exchangeCodeForTokens,
  getGoogleUserProfile,
  parseOAuthState,
  generateUniqueUsername,
} from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauthError = url.searchParams.get('error');

  // If user cancelled on Google consent screen
  if (oauthError) {
    console.warn('Google OAuth returned error:', oauthError);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(oauthError)}`, req.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/login?error=invalid_oauth_request', req.url));
  }

  // Verify CSRF State Token against Cookie
  const cookieStore = cookies();
  const savedState = cookieStore.get('pn_oauth_state')?.value;

  if (!savedState || savedState !== state) {
    console.error('OAuth state mismatch. Possible CSRF attack or expired session.');
    return NextResponse.redirect(new URL('/login?error=state_mismatch', req.url));
  }

  const parsedState = parseOAuthState(state);
  const destination = parsedState?.redirect || '/dashboard';

  try {
    // 1. Exchange code for Google access token
    const tokenData = await exchangeCodeForTokens(code);
    if (!tokenData.access_token) {
      throw new Error('Did not receive access token from Google.');
    }

    // 2. Fetch user profile from Google
    const profile = await getGoogleUserProfile(tokenData.access_token);
    const normalizedEmail = profile.email.toLowerCase().trim();

    // 3. Find existing user by Google ID or by Email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: profile.id },
          { email: normalizedEmail },
        ],
      },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { plan: true },
        },
      },
    });

    const isTester = normalizedEmail === 'tanviladva01@gmail.com';

    if (user) {
      // User exists - update googleId and profile image if missing
      const updateData: { googleId?: string; image?: string; role?: string } = {};

      if (!user.googleId) {
        updateData.googleId = profile.id;
      }
      if (!user.image && profile.picture) {
        updateData.image = profile.picture;
      }
      if (isTester && user.role !== 'ADMIN') {
        updateData.role = 'ADMIN';
        user.role = 'ADMIN';
      }

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
          include: {
            subscriptions: {
              where: { status: 'ACTIVE' },
              include: { plan: true },
            },
          },
        });
      }
    } else {
      // User does not exist - Register a new account
      const username = await generateUniqueUsername(profile.name, normalizedEmail);

      // Check user count for Early Bird Plan qualification (First 100 users)
      const totalUsersCount = await prisma.user.count();
      const isEarlyBirdQualified = totalUsersCount < 100;
      const targetPlanName = isEarlyBirdQualified ? 'EARLY_BIRD' : 'FREE';

      let assignedPlan = await prisma.plan.findUnique({ where: { name: targetPlanName } });
      if (!assignedPlan) {
        assignedPlan = await prisma.plan.findFirst({ where: { priceINR: 0 } });
      }

      user = await prisma.user.create({
        data: {
          name: profile.name || username,
          email: normalizedEmail,
          username,
          googleId: profile.id,
          image: profile.picture || null,
          role: isTester ? 'ADMIN' : 'USER',
          subscriptions: assignedPlan
            ? {
                create: {
                  planId: assignedPlan.id,
                  status: 'ACTIVE',
                },
              }
            : undefined,
          notifications: {
            create: {
              title: 'Welcome to PostNest! 🎉',
              message: 'Your account has been connected with Google. Start drafting your first article or setup your company profile.',
            },
          },
        },
        include: {
          subscriptions: {
            where: { status: 'ACTIVE' },
            include: { plan: true },
          },
        },
      });
    }

    // 4. Sign JWT session token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    });

    // 5. Construct redirect response with session cookie and clear state cookie
    const targetUrl = destination.startsWith('http')
      ? destination
      : new URL(destination, req.url).toString();

    const response = NextResponse.redirect(targetUrl);

    // Set 7-day session token cookie
    response.cookies.set('pn_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    // Clear the OAuth state cookie
    response.cookies.set('pn_oauth_state', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message || 'google_auth_failed')}`, req.url)
    );
  }
}
