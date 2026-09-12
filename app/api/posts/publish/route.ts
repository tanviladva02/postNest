import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  checkUserPublishingLimits,
  checkUserDraftLimit,
  checkUserSchedulingPermission,
  incrementUserPublishUsage,
} from '@/lib/publishing-limits';
import { validatePostQuality, PostStatus } from '@/lib/moderation';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized session. Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      title,
      slug,
      categoryId,
      companyId,
      featuredImage,
      excerpt,
      content,
      shouldPublish,
      scheduledAt,
      action,
    } = body;

    // Fast-path: Real-time Quality Check inspection only
    if (action === 'check-quality') {
      const modResult = await validatePostQuality(title || '', content || '', excerpt || '', id || undefined);
      return NextResponse.json({ success: true, qualityReport: modResult });
    }

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: 'Title, category, and blog content are required.' }, { status: 400 });
    }

    let targetStatus: PostStatus = 'DRAFT';
    let scheduleDate: Date | null = null;

    if (scheduledAt) {
      // 1. Check Scheduling Permission
      const schedPerm = await checkUserSchedulingPermission(user.id);
      if (!schedPerm.allowed) {
        return NextResponse.json({ error: schedPerm.reason }, { status: 403 });
      }

      scheduleDate = new Date(scheduledAt);
      if (isNaN(scheduleDate.getTime()) || scheduleDate.getTime() <= Date.now() + 60000) {
        return NextResponse.json(
          { error: 'Scheduled publish time must be at least 2 minutes in the future.' },
          { status: 400 }
        );
      }

      // 2. Validate Post Quality for Scheduled Posts
      const isTester = user.email?.toLowerCase() === 'tanviladva01@gmail.com';
      if (!isTester) {
        const modResult = await validatePostQuality(title, content, excerpt, id);
        if (!modResult.passesAutoApproval) {
          return NextResponse.json(
            {
              error: 'Quality check failed. Please resolve the quality issues before scheduling.',
              qualityReport: modResult,
            },
            { status: 422 }
          );
        }
      }

      targetStatus = 'SCHEDULED';
    } else if (shouldPublish) {
      // 1. Check Publishing Limits (Daily & Monthly quotas)
      const limits = await checkUserPublishingLimits(user.id);
      if (!limits.allowed) {
        return NextResponse.json({ error: limits.reason }, { status: 429 });
      }

      // 2. Moderation Quality Check (bypass for testing account)
      const isTester = user.email?.toLowerCase() === 'tanviladva01@gmail.com';
      if (!isTester) {
        const modResult = await validatePostQuality(title, content, excerpt, id);
        if (!modResult.passesAutoApproval) {
          return NextResponse.json(
            {
              error: 'Quality check failed. Please resolve the quality issues before publishing.',
              qualityReport: modResult,
            },
            { status: 422 }
          );
        }
        targetStatus = modResult.recommendedStatus;
      } else {
        targetStatus = 'PUBLISHED';
      }
    } else {
      // Saving as Draft: Check Draft Limits
      const draftCheck = await checkUserDraftLimit(user.id, Boolean(id));
      if (!draftCheck.allowed) {
        return NextResponse.json({ error: draftCheck.reason }, { status: 429 });
      }
      targetStatus = 'DRAFT';
    }

    let post;
    const slugValue = (slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') || `post-${Date.now().toString().slice(-6)}`;

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
          excerpt: excerpt || title.slice(0, 150),
          content,
          status: targetStatus,
          scheduledAt: targetStatus === 'SCHEDULED' ? scheduleDate : null,
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
          excerpt: excerpt || title.slice(0, 150),
          content,
          status: targetStatus,
          scheduledAt: targetStatus === 'SCHEDULED' ? scheduleDate : null,
          authorId: user.id,
          publishedAt: targetStatus === 'PUBLISHED' ? new Date() : null,
        },
      });
    }

    if (targetStatus === 'PUBLISHED') {
      await incrementUserPublishUsage(user.id);
    }

    return NextResponse.json({
      success: true,
      status: targetStatus,
      post,
      message:
        targetStatus === 'PUBLISHED'
          ? 'Article published successfully!'
          : targetStatus === 'SCHEDULED'
          ? `Article scheduled successfully for ${scheduleDate?.toLocaleString()}!`
          : 'Draft saved successfully!',
    });
  } catch (error: any) {
    console.error('Publish API error:', error);
    return NextResponse.json({ error: 'Failed to process post action.' }, { status: 500 });
  }
}
