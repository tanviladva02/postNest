import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return NextResponse.json({ error: 'Email/username and password are required.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set('pn_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
