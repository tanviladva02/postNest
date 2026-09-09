import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { checkUserPublishingLimits, incrementUserPublishUsage } from '@/lib/publishing-limits';
import { validatePostQuality } from '@/lib/moderation';

export async function POST(req: Request) {
  try {
    const apiKeyHeader = req.headers.get('X-PostNest-Api-Key');
    if (!apiKeyHeader || !apiKeyHeader.startsWith('pn_live_')) {
      return NextResponse.json(
        { error: 'Unauthorized. Missing or invalid X-PostNest-Api-Key header.' },
        { status: 401 }
      );
    }

    // Hash header key to match DB stored hash
    const keyHash = crypto.createHash('sha256').update(apiKeyHeader).digest('hex');

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: { user: true },
    });

    if (!apiKeyRecord || apiKeyRecord.revokedAt) {
      return NextResponse.json(
        { error: 'Forbidden. Invalid or revoked API Key.' },
        { status: 403 }
      );
    }

    const userId = apiKeyRecord.userId;

    // Check Plan Limits & API Access Permissions
    const limits = await checkUserPublishingLimits(userId);
    if (!limits.hasApiAccess) {
      return NextResponse.json(
        { error: 'Forbidden. Your current subscription plan does not include API access. Please upgrade to Premium.' },
        { status: 403 }
      );
    }

    if (!limits.allowed) {
      return NextResponse.json({ error: limits.reason }, { status: 429 });
    }

    const body = await req.json();
    const { title, excerpt, content, category, featuredImage } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category are required.' },
        { status: 400 }
      );
    }

    // Resolve Category
    const categoryRecord = await prisma.category.findFirst({
      where: {
        OR: [{ name: category }, { slug: category.toLowerCase().replace(/\s+/g, '-') }],
      },
    }) || await prisma.category.findFirst();

    if (!categoryRecord) {
      return NextResponse.json({ error: 'Invalid category specified.' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') + `-${Date.now().toString().slice(-4)}`;

    // Quality Moderation Check
    const modResult = await validatePostQuality(title, content);

    // Create Article
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || title,
        content,
        featuredImage: featuredImage || null,
        status: modResult.recommendedStatus,
        externalLinksCount: modResult.externalLinksCount,
        authorId: userId,
        categoryId: categoryRecord.id,
        publishedAt: modResult.recommendedStatus === 'PUBLISHED' ? new Date() : null,
      },
    });

    if (modResult.recommendedStatus === 'PUBLISHED') {
      await incrementUserPublishUsage(userId);
    }

    // Update API Key last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        status: newPost.status,
        url: `https://postnest.in/blog/${newPost.slug}`,
      },
    });
  } catch (error: any) {
    console.error('API Post route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
