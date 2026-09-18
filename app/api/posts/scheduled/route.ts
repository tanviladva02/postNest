import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { incrementUserPublishUsage } from '@/lib/publishing-limits';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const now = new Date();

    // Find all scheduled posts due for publication
    const duePosts = await prisma.post.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: now,
        },
      },
      take: 20,
    });

    let publishedCount = 0;

    for (const post of duePosts) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: now,
        },
      });

      await incrementUserPublishUsage(post.authorId);
      publishedCount++;
    }

    return NextResponse.json({
      success: true,
      processed: duePosts.length,
      publishedCount,
      timestamp: now.toISOString(),
    });
  } catch (error: any) {
    console.error('Scheduled posts processing error:', error);
    return NextResponse.json({ error: 'Failed to process scheduled posts' }, { status: 500 });
  }
}

export async function GET() {
  return POST(new Request('http://localhost/api/posts/scheduled', { method: 'POST' }));
}
