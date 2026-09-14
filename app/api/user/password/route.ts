import { NextResponse } from 'next/server';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    const hasExistingPassword = Boolean(user.passwordHash);

    // Validation for new password
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation password do not match' },
        { status: 400 }
      );
    }

    // If user already has a password, verify current password
    if (hasExistingPassword) {
      if (!currentPassword || typeof currentPassword !== 'string') {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        );
      }

      const isValidCurrentPassword = await verifyPassword(currentPassword, user.passwordHash!);
      if (!isValidCurrentPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
    }

    // Hash new password and update user
    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    const successMessage = hasExistingPassword
      ? 'Password changed successfully'
      : 'Password set successfully! You can now log in with either Google or your email and password.';

    return NextResponse.json({
      success: true,
      message: successMessage,
      hasPassword: true,
    });
  } catch (error: any) {
    console.error('Error setting or changing password:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}
