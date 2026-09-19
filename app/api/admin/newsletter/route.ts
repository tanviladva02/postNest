import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function ensureAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await ensureAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const status = searchParams.get('status');

    const subscriberDb = (prisma as any).newsletterSubscriber;

    if (!subscriberDb) {
      return NextResponse.json(
        { error: 'Subscriber database model not ready.' },
        { status: 500 }
      );
    }

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [totalCount, activeCount, unsubscribedCount, subscribers] = await Promise.all([
      subscriberDb.count(),
      subscriberDb.count({ where: { status: 'ACTIVE' } }),
      subscriberDb.count({ where: { status: 'UNSUBSCRIBED' } }),
      subscriberDb.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    // Fetch top recent published posts so admin can easily pick articles for newsletter templates
    const recentPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      metrics: {
        totalCount,
        activeCount,
        unsubscribedCount,
      },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil((status === 'ALL' || !status ? totalCount : (status === 'ACTIVE' ? activeCount : unsubscribedCount)) / limit),
      },
      subscribers,
      recentPosts,
    });
  } catch (error: any) {
    console.error('Error fetching admin newsletter stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter statistics.' },
      { status: 500 }
    );
  }
}
