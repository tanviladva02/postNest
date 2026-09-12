import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { markOtpUsed, invalidateAllOtps } from '@/lib/passwordReset';

const JWT_SECRET = process.env.JWT_SECRET || 'postnest_super_secret_fallback_key';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resetToken, email, newPassword, confirmPassword } = body;

    if (!resetToken || !email || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required to reset your password.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match. Please verify and retype.' },
        { status: 400 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Password reset session has expired or is invalid. Please request a new verification code.' },
        { status: 401 }
      );
    }

    if (decoded.purpose !== 'password_reset' || decoded.email.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json(
        { error: 'Unauthorized or invalid password reset token.' },
        { status: 403 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password in DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    // Mark OTP record as used if otpId is provided
    if (decoded.otpId) {
      await markOtpUsed(decoded.otpId);
    }

    // Mark all pending OTPs for this email as used
    await invalidateAllOtps(cleanEmail);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('[Reset Password Error]', error);
    return NextResponse.json(
      { error: 'Internal server error while updating password. Please try again.' },
      { status: 500 }
    );
  }
}
