import { prisma } from '@/lib/prisma';

export type PostStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';

export interface ModerationResult {
  passesAutoApproval: boolean;
  recommendedStatus: PostStatus;
  externalLinksCount: number;
  flags: string[];
}


export async function validatePostQuality(title: string, content: string, postIdToIgnore?: string): Promise<ModerationResult> {
  const flags: string[] = [];
  let externalLinksCount = 0;

  // 1. Link Count & Spam Check
  const urlRegex = /href=["'](https?:\/\/[^"']+)["']/gi;
  const matches = content.match(urlRegex) || [];
  externalLinksCount = matches.length;

  if (externalLinksCount > 5) {
    flags.push(`Excessive external links detected (${externalLinksCount} links found). Requires admin review.`);
  }

  // 2. Minimum Length & Quality Checks
  const plainText = content.replace(/<[^>]+>/g, '').trim();
  if (plainText.length < 100) {
    flags.push('Article body content is very short (less than 100 characters).');
  }

  if (title.trim().length < 5) {
    flags.push('Title is too short (minimum 5 characters).');
  }

  // 3. Duplicate Title Check
  const existingPost = await prisma.post.findFirst({
    where: {
      title: {
        equals: title.trim(),
      },
      id: postIdToIgnore ? { not: postIdToIgnore } : undefined,
    },
  });

  if (existingPost) {
    flags.push('An article with the exact same title already exists on PostNest.');
  }

  const passesAutoApproval = flags.length === 0;
  const recommendedStatus: PostStatus = passesAutoApproval ? 'PUBLISHED' : 'PENDING_REVIEW';

  return {
    passesAutoApproval,
    recommendedStatus,
    externalLinksCount,
    flags,
  };
}
