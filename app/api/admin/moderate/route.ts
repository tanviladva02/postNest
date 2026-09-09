import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { incrementUserPublishUsage } from '@/lib/publishing-limits';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { postId, action } = await req.json();

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    if (action === 'APPROVE') {
      await prisma.post.update({
        where: { id: postId },
        data: { status: 'PUBLISHED', publishedAt: new Date() },
      });
      await incrementUserPublishUsage(post.authorId);
    } else if (action === 'REJECT') {
      await prisma.post.update({
        where: { id: postId },
        data: { status: 'REJECTED', rejectionReason: 'Violates quality or link moderation policy' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Moderation action failed' }, { status: 500 });
  }
}
