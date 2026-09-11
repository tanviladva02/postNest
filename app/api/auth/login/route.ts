import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return NextResponse.json({ error: 'Email/username and password are required.' }, { status: 400 });
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });

    const isTester = emailOrUsername.toLowerCase() === 'tanviladva01@gmail.com';

    // Auto-create test account if attempting login for the first time
    if (!user && isTester) {
      const passwordHash = await hashPassword(password);
      const premiumPlan = await prisma.plan.findUnique({ where: { name: 'PREMIUM' } }) ||
        await prisma.plan.findUnique({ where: { name: 'FREE' } });
      user = await prisma.user.create({
        data: {
          name: 'Tanvi Ladva',
          email: 'tanviladva01@gmail.com',
          username: 'tanviladva01',
          passwordHash,
          role: 'ADMIN',
          subscriptions: premiumPlan ? {
            create: {
              planId: premiumPlan.id,
              status: 'ACTIVE',
            },
          } : undefined,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Elevate tester to ADMIN
    if (isTester && user.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
      user.role = 'ADMIN';
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role as 'USER' | 'ADMIN' });

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
