import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkUserPublishingLimits, incrementUserPublishUsage } from '@/lib/publishing-limits';
import { validatePostQuality } from '@/lib/moderation';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, slug, categoryId, companyId, featuredImage, excerpt, content, shouldPublish } = body;

    if (!title || !excerpt || !content || !categoryId) {
      return NextResponse.json({ error: 'Title, category, excerpt, and content are required.' }, { status: 400 });
    }

    let targetStatus: 'DRAFT' | 'PUBLISHED' | 'PENDING_REVIEW' = 'DRAFT';

    if (shouldPublish) {
      // 1. Check publishing limits
      const limits = await checkUserPublishingLimits(user.id);
      if (!limits.allowed) {
        return NextResponse.json({ error: limits.reason }, { status: 429 });
      }

      // 2. Moderation Quality Check
      const modResult = await validatePostQuality(title, content, id);
      targetStatus = modResult.recommendedStatus;
    }

    let post;
    const slugValue = slug.trim() || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

    if (id) {
      // Update existing post
      post = await prisma.post.update({
        where: { id },
        data: {
          title,
          slug: slugValue,
          categoryId,
          companyId: companyId || null,
          featuredImage: featuredImage || null,
          excerpt,
          content,
          status: targetStatus,
          publishedAt: targetStatus === 'PUBLISHED' ? new Date() : undefined,
        },
      });
    } else {
      // Create new post
      post = await prisma.post.create({
        data: {
          title,
          slug: `${slugValue}-${Date.now().toString().slice(-4)}`,
          categoryId,
          companyId: companyId || null,
          featuredImage: featuredImage || null,
          excerpt,
          content,
          status: targetStatus,
          authorId: user.id,
          publishedAt: targetStatus === 'PUBLISHED' ? new Date() : null,
        },
      });
    }

    if (targetStatus === 'PUBLISHED') {
      await incrementUserPublishUsage(user.id);
    }

    return NextResponse.json({ success: true, status: targetStatus, post });
  } catch (error: any) {
    console.error('Publish API error:', error);
    return NextResponse.json({ error: 'Failed to process post action.' }, { status: 500 });
  }
}
