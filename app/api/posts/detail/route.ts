import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || (post.authorId !== user.id && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ post });
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing article ID' }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (post.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. You do not own this article.' }, { status: 403 });
    }

    // Delete post tags first if any, then post
    await prisma.postTag.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Article deleted successfully.' });
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Failed to delete article.' }, { status: 500 });
  }
}

