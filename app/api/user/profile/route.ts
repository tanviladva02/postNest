import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        mobileNumber: user.mobileNumber || '',
        bio: user.bio || '',
        image: user.image || '',
        role: user.role,
        isGoogleUser: Boolean(user.googleId),
        hasPassword: Boolean(user.passwordHash),
      },
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, username, mobileNumber, bio, image } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long and contain only letters, numbers, hyphens, or underscores' },
        { status: 400 }
      );
    }

    // Check if username is taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: cleanUsername,
        NOT: { id: user.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken by another user' },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        username: cleanUsername,
        mobileNumber: mobileNumber ? String(mobileNumber).trim() : null,
        bio: bio ? String(bio).trim() : null,
        image: image ? String(image).trim() : user.image,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        mobileNumber: updatedUser.mobileNumber || '',
        bio: updatedUser.bio || '',
        image: updatedUser.image || '',
        isGoogleUser: Boolean(updatedUser.googleId),
        hasPassword: Boolean(updatedUser.passwordHash),
      },
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
