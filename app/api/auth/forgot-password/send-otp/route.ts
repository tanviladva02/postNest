import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetOtpEmail } from '@/lib/email';
import { getRecentActiveOtp, invalidateAllOtps, createResetOtp } from '@/lib/passwordReset';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists with this email
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please check or register a new account.' },
        { status: 404 }
      );
    }

    // Rate-limit check: Has an active OTP been generated in the last 45 seconds?
    const recentOtp = await getRecentActiveOtp(cleanEmail, 45);

    if (recentOtp) {
      return NextResponse.json(
        { error: 'A verification code was recently sent. Please wait 45 seconds before requesting another code.' },
        { status: 429 }
      );
    }

    // Invalidate any previous unused OTPs for this email
    await invalidateAllOtps(cleanEmail);

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save in database
    await createResetOtp(cleanEmail, otpCode, expiresAt);

    // Send email
    const emailResult = await sendPasswordResetOtpEmail({
      toEmail: cleanEmail,
      userName: user.name,
      otpCode,
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully to your email.',
      email: cleanEmail,
      isFallbackDev: emailResult.method === 'console_logged',
    });
  } catch (error: any) {
    console.error('[Forgot Password Error]', error);
    return NextResponse.json(
      { error: 'Internal server error while processing password reset. Please try again.' },
      { status: 500 }
    );
  }
}
