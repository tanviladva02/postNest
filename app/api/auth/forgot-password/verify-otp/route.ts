import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getLatestActiveOtp, markOtpUsed, incrementOtpAttempts } from '@/lib/passwordReset';

const JWT_SECRET = process.env.JWT_SECRET || 'postnest_super_secret_fallback_key';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // Find the latest active OTP for this email
    const otpRecord = await getLatestActiveOtp(cleanEmail);

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No active verification code found. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await markOtpUsed(otpRecord.id);
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await markOtpUsed(otpRecord.id);
      return NextResponse.json(
        { error: 'Too many incorrect attempts. For security, please request a new verification code.' },
        { status: 400 }
      );
    }

    // Verify code match
    if (otpRecord.otp !== cleanOtp) {
      const updatedAttempts = await incrementOtpAttempts(otpRecord.id);
      const remaining = 5 - updatedAttempts;
      return NextResponse.json(
        { error: `Invalid verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code has been invalidated.'}` },
        { status: 400 }
      );
    }

    // OTP is valid! Generate signed reset token
    const resetToken = jwt.sign(
      {
        email: cleanEmail,
        otpId: otpRecord.id,
        purpose: 'password_reset',
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully.',
      resetToken,
    });
  } catch (error: any) {
    console.error('[Verify OTP Error]', error);
    return NextResponse.json(
      { error: 'Internal server error while verifying code.' },
      { status: 500 }
    );
  }
}
