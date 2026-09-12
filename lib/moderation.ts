import { prisma } from '@/lib/prisma';

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';

export interface QualityCheckItem {
  id: string;
  label: string;
  passed: boolean;
  score: number;
  message?: string;
}

export interface ModerationResult {
  passesAutoApproval: boolean;
  score: number; // 0 to 100
  recommendedStatus: PostStatus;
  externalLinksCount: number;
  wordCount: number;
  checks: QualityCheckItem[];
  errors: string[];
  warnings: string[];
}

export async function validatePostQuality(
  title: string,
  content: string,
  excerpt?: string,
  postIdToIgnore?: string
): Promise<ModerationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks: QualityCheckItem[] = [];

  const cleanTitle = (title || '').trim();
  const cleanExcerpt = (excerpt || '').trim();
  const plainText = (content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Title Quality (Weight: 20%)
  const titlePassed = cleanTitle.length >= 10 && cleanTitle.length <= 150;
  let titleMsg: string | undefined;
  if (cleanTitle.length < 10) {
    titleMsg = 'Title is too short. A descriptive title should be at least 10 characters.';
    errors.push(titleMsg);
  } else if (cleanTitle.length > 150) {
    titleMsg = 'Title is very long (over 150 characters). Consider condensing for better SEO.';
    warnings.push(titleMsg);
  }
  checks.push({
    id: 'title',
    label: 'Descriptive Title (10-150 characters)',
    passed: titlePassed,
    score: titlePassed ? 20 : (cleanTitle.length >= 5 ? 10 : 0),
    message: titleMsg,
  });

  // 2. Word Count & Depth (Weight: 30%)
  const words = plainText ? plainText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const wordCountPassed = wordCount >= 150;
  let wordCountMsg: string | undefined;
  if (wordCount < 150) {
    wordCountMsg = `Article is too short (${wordCount} words). High-quality articles must contain at least 150 words.`;
    errors.push(wordCountMsg);
  }
  checks.push({
    id: 'word_count',
    label: 'Substantial Content (At least 150 words)',
    passed: wordCountPassed,
    score: wordCount >= 300 ? 30 : (wordCount >= 150 ? 25 : Math.round((wordCount / 150) * 15)),
    message: wordCountMsg,
  });

  // 3. Subheadings & Structure (Weight: 20%)
  const hasSubheading = /<h[2-4][^>]*>|^(#{2,4}\s+.+)/gim.test(content || '');
  let headingMsg: string | undefined;
  if (!hasSubheading) {
    headingMsg = 'Add at least one section subheading (H2 or H3) to structure your article properly.';
    errors.push(headingMsg);
  }
  checks.push({
    id: 'subheadings',
    label: 'Structured Subheadings (H2/H3/H4)',
    passed: hasSubheading,
    score: hasSubheading ? 20 : 0,
    message: headingMsg,
  });

  // 4. Meta Excerpt Summary (Weight: 15%)
  const excerptPassed = cleanExcerpt.length >= 25;
  let excerptMsg: string | undefined;
  if (!excerptPassed) {
    excerptMsg = 'Short summary / meta excerpt must be at least 25 characters for Google search snippets.';
    errors.push(excerptMsg);
  }
  checks.push({
    id: 'excerpt',
    label: 'Meta Excerpt Summary (At least 25 characters)',
    passed: excerptPassed,
    score: excerptPassed ? 15 : 0,
    message: excerptMsg,
  });

  // 5. External Links Count & Anti-Spam (Weight: 15%)
  const urlRegex = /href=["'](https?:\/\/[^"']+)["']/gi;
  const matches = (content || '').match(urlRegex) || [];
  const externalLinksCount = matches.length;
  const linksPassed = externalLinksCount <= 5;
  let linkMsg: string | undefined;
  if (externalLinksCount > 5) {
    linkMsg = `Excessive external links (${externalLinksCount} found). Maximum allowed is 5 to maintain SEO integrity.`;
    errors.push(linkMsg);
  }
  checks.push({
    id: 'links',
    label: 'Balanced Link Count (Max 5 external links)',
    passed: linksPassed,
    score: linksPassed ? 15 : 0,
    message: linkMsg,
  });

  // 6. Duplicate Title Check
  if (cleanTitle.length >= 5) {
    const existingPost = await prisma.post.findFirst({
      where: {
        title: {
          equals: cleanTitle,
          mode: 'insensitive',
        },
        id: postIdToIgnore ? { not: postIdToIgnore } : undefined,
      },
      select: { id: true },
    });

    if (existingPost) {
      const dupMsg = 'An article with this exact title already exists on PostNest. Please use a unique title.';
      errors.push(dupMsg);
      checks.push({
        id: 'unique_title',
        label: 'Unique Title Check',
        passed: false,
        score: 0,
        message: dupMsg,
      });
    }
  }

  // Compute Total Quality Score
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const passesAutoApproval = errors.length === 0 && totalScore >= 70;
  const recommendedStatus: PostStatus = passesAutoApproval ? 'PUBLISHED' : 'DRAFT';

  return {
    passesAutoApproval,
    score: Math.min(100, Math.max(0, totalScore)),
    recommendedStatus,
    externalLinksCount,
    wordCount,
    checks,
    errors,
    warnings,
  };
}
