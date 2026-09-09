import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkUserPublishingLimits } from '@/lib/publishing-limits';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const limits = await checkUserPublishingLimits(user.id);
    if (!limits.hasBulkUpload) {
      return NextResponse.json(
        { error: 'Forbidden. Bulk upload is a Standard and Premium plan feature. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const { posts } = await req.json();
    if (!posts || !Array.isArray(posts)) {
      return NextResponse.json({ error: 'Invalid post array provided.' }, { status: 400 });
    }

    const defaultCategory = await prisma.category.findFirst() || { id: 'fallback' };
    let importedCount = 0;

    for (const item of posts) {
      const title = item.Title || item.title;
      const content = item.Content || item.content;
      const excerpt = item.Description || item.description || title;
      const rawSlug = item.Slug || item.slug || title;

      if (!title || !content) continue;

      const slug = rawSlug.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') + `-${Date.now().toString().slice(-4)}`;

      await prisma.post.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          featuredImage: item.FeaturedImage || item.featuredImage || null,
          status: 'DRAFT',
          authorId: user.id,
          categoryId: defaultCategory.id,
        },
      });
      importedCount++;
    }

    return NextResponse.json({ success: true, importedCount });
  } catch (error: any) {
    return NextResponse.json({ error: 'Bulk upload failed.' }, { status: 500 });
  }
}
