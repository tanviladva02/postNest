import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, username, password, companyName, companyCategory, companyWebsite, companyLogo, companyDescription } = body;

    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: 'Name, email, username, and password are required.' }, { status: 400 });
    }

    // Check existing email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email or username already exists.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // Check user count to determine Early Bird benefit (First 100 users get 30 posts/month Early Bird Plan)
    const totalUsersCount = await prisma.user.count();
    const isEarlyBirdQualified = totalUsersCount < 100;

    let targetPlanName = isEarlyBirdQualified ? 'EARLY_BIRD' : 'FREE';
    let assignedPlan = await prisma.plan.findUnique({ where: { name: targetPlanName } });

    if (!assignedPlan) {
      assignedPlan = await prisma.plan.findFirst({ where: { priceINR: 0 } });
    }

    const isTester = email.toLowerCase() === 'tanviladva01@gmail.com';

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
        passwordHash,
        role: isTester ? 'ADMIN' : 'USER',
        subscriptions: assignedPlan ? {
          create: {
            planId: assignedPlan.id,
            status: 'ACTIVE',
          }
        } : undefined,
      },
    });

    // If company details provided, create company profile
    if (companyName) {
      const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await prisma.company.create({
        data: {
          userId: newUser.id,
          companyName,
          slug: `${companySlug}-${Date.now().toString().slice(-4)}`,
          category: companyCategory || 'Business',
          website: companyWebsite || null,
          logo: companyLogo || null,
          description: companyDescription || null,
          isVerified: false,
        },
      });
    }

    // Generate token and set HTTP cookie
    const token = signToken({ userId: newUser.id, email: newUser.email, role: newUser.role as 'USER' | 'ADMIN' });

    const response = NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    response.cookies.set('pn_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
  }
}
