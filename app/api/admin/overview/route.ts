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
    const planFilter = searchParams.get('plan') || 'ALL'; // ALL, FREE, STANDARD, PREMIUM
    const postStatus = searchParams.get('status') || 'ALL'; // ALL, PUBLISHED, PENDING_REVIEW, DRAFT
    const search = searchParams.get('search')?.trim() || '';

    // 1. Fetch Counts & Metrics
    const [
      totalUsers,
      totalPosts,
      publishedPosts,
      pendingPosts,
      totalCompanies,
      totalMessages,
      unreadMessages,
      standardSubsCount,
      premiumSubsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.company.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.subscription.count({ where: { plan: { name: 'STANDARD' }, status: 'ACTIVE' } }),
      prisma.subscription.count({ where: { plan: { name: 'PREMIUM' }, status: 'ACTIVE' } }),
    ]);

    // 2. Fetch Users with active subscription plan details
    const usersRaw = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { plan: true },
          take: 1,
        },
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedUsers = usersRaw.map((u) => {
      const activeSub = u.subscriptions[0];
      const planName = activeSub ? activeSub.plan.name : 'FREE';
      const planDisplayName = activeSub ? activeSub.plan.displayName : 'Free / Early Bird';

      return {
        id: u.id,
        name: u.name || u.username || 'Anonymous User',
        email: u.email,
        username: u.username,
        role: u.role,
        planName,
        planDisplayName,
        postCount: u._count.posts,
        createdAt: u.createdAt,
      };
    });

    // Apply plan filtering if requested
    const filteredUsers = formattedUsers.filter((u) => {
      if (planFilter === 'ALL') return true;
      if (planFilter === 'FREE') return u.planName === 'FREE';
      if (planFilter === 'STANDARD') return u.planName === 'STANDARD';
      if (planFilter === 'PREMIUM') return u.planName === 'PREMIUM';
      return true;
    });

    // 3. Fetch Uploaded Posts / Blogs with Author, Category, and Live URL details
    const postWhere: any = {};

    if (postStatus !== 'ALL') {
      postWhere.status = postStatus;
    }

    if (search) {
      postWhere.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { author: { name: { contains: search, mode: 'insensitive' } } },
        { author: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const postsRaw = await prisma.post.findMany({
      where: postWhere,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        status: true,
        views: true,
        createdAt: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Show up to top 100 recent posts
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.postnest.in';

    const formattedPosts = postsRaw.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      status: post.status,
      views: post.views,
      createdAt: post.createdAt,
      publishedAt: post.publishedAt,
      liveUrl: `${baseUrl}/blog/${post.slug}`,
      relativeUrl: `/blog/${post.slug}`,
      authorName: post.author.name || post.author.username || 'Unknown Author',
      authorEmail: post.author.email,
      categoryName: post.category.name,
      companyName: post.company?.companyName || null,
    }));

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalPosts,
        publishedPosts,
        pendingPosts,
        totalCompanies,
        totalMessages,
        unreadMessages,
        standardSubs: standardSubsCount,
        premiumSubs: premiumSubsCount,
        freeSubs: totalUsers - (standardSubsCount + premiumSubsCount),
        estRevenue: standardSubsCount * 299 + premiumSubsCount * 599,
      },
      users: filteredUsers,
      allUsers: formattedUsers,
      posts: formattedPosts,
    });
  } catch (error: any) {
    console.error('Error fetching admin overview details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin overview details.' },
      { status: 500 }
    );
  }
}
