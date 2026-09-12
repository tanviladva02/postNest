import { prisma } from '@/lib/prisma';

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  currentDailyCount: number;
  dailyLimit: number;
  currentMonthlyCount: number;
  monthlyLimit: number;
  currentDraftCount: number;
  draftLimit: number;
  hasScheduling: boolean;
  hasBulkUpload: boolean;
  hasApiAccess: boolean;
  planName: string;
  isUnlimited?: boolean;
}

export function isUnlimitedTestingEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === 'tanviladva01@gmail.com';
}

export async function checkUserPublishingLimits(userId: string): Promise<LimitCheckResult> {
  // 1. Fetch user to check for testing/exempt account
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, role: true },
  });

  const isUnlimited = isUnlimitedTestingEmail(user?.email);

  const todayStr = new Date().toISOString().split('T')[0];

  // 2. Query today's usage
  const todayUsage = await prisma.usage.findUnique({
    where: {
      userId_date: {
        userId,
        date: todayStr,
      },
    },
  });

  const currentDailyCount = todayUsage?.postsPublishedCount || 0;

  // 3. Query monthly published posts count (posts created/published within current month)
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const monthlyCount = await prisma.post.count({
    where: {
      authorId: userId,
      status: 'PUBLISHED',
      publishedAt: {
        gte: firstDayOfMonth,
      },
    },
  });

  // 4. Query current user drafts count
  const currentDraftCount = await prisma.post.count({
    where: {
      authorId: userId,
      status: 'DRAFT',
    },
  });

  // Bypass limits for unlimited testing account
  if (isUnlimited) {
    return {
      allowed: true,
      reason: undefined,
      currentDailyCount,
      dailyLimit: 0,
      currentMonthlyCount: monthlyCount,
      monthlyLimit: 0,
      currentDraftCount,
      draftLimit: 0,
      hasScheduling: true,
      hasBulkUpload: true,
      hasApiAccess: true,
      planName: 'Testing Account (Unlimited)',
      isUnlimited: true,
    };
  }

  // 5. Get active user subscription and plan details
  const activeSub = await prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: { plan: true },
    orderBy: { startDate: 'desc' },
  });

  // Default to user's assigned plan, or query EARLY_BIRD / FREE
  let plan = activeSub?.plan;
  if (!plan) {
    plan = (await prisma.plan.findUnique({ where: { name: 'EARLY_BIRD' } })) ||
      (await prisma.plan.findUnique({ where: { name: 'FREE' } })) || {
        id: 'fallback',
        name: 'FREE',
        displayName: 'Free Starter Plan',
        priceINR: 0,
        monthlyPostLimit: 15,
        dailyPostLimit: 1,
        draftLimit: 5,
        hasScheduling: false,
        hasBulkUpload: false,
        hasApiAccess: false,
        description: 'Free: Up to 1 post per day, with a maximum of 15 posts per month.',
        createdAt: new Date(),
      };
  }

  // 6. Evaluate Limit Rules
  let allowed = true;
  let reason: string | undefined = undefined;

  if (plan.monthlyPostLimit > 0 && monthlyCount >= plan.monthlyPostLimit) {
    allowed = false;
    reason = `You have reached your monthly publishing quota of ${plan.monthlyPostLimit} posts for the ${plan.displayName}. Upgrade your subscription to continue publishing.`;
  } else if (plan.dailyPostLimit > 0 && currentDailyCount >= plan.dailyPostLimit) {
    allowed = false;
    reason = `Daily limit reached! Your ${plan.displayName} allows maximum ${plan.dailyPostLimit} published posts per day. (Published today: ${currentDailyCount}/${plan.dailyPostLimit}).`;
  }

  return {
    allowed,
    reason,
    currentDailyCount,
    dailyLimit: plan.dailyPostLimit,
    currentMonthlyCount: monthlyCount,
    monthlyLimit: plan.monthlyPostLimit,
    currentDraftCount,
    draftLimit: plan.draftLimit,
    hasScheduling: plan.hasScheduling,
    hasBulkUpload: plan.hasBulkUpload,
    hasApiAccess: plan.hasApiAccess,
    planName: plan.displayName,
  };
}

export async function checkUserDraftLimit(userId: string, isExistingDraft = false): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await checkUserPublishingLimits(userId);

  if (limits.isUnlimited) return { allowed: true };

  // If user is editing an existing draft, it does not count as a new draft
  if (isExistingDraft) return { allowed: true };

  if (limits.draftLimit > 0 && limits.currentDraftCount >= limits.draftLimit) {
    return {
      allowed: false,
      reason: `Draft limit reached! Your ${limits.planName} allows maximum ${limits.draftLimit} drafts. (Current: ${limits.currentDraftCount}/${limits.draftLimit}). Please publish or delete existing drafts to create new ones, or upgrade your plan.`,
    };
  }

  return { allowed: true };
}

export async function checkUserSchedulingPermission(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await checkUserPublishingLimits(userId);

  if (limits.isUnlimited || limits.hasScheduling) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Post scheduling is exclusive to Standard and Premium plans. Upgrade your plan to schedule articles for automatic publishing.`,
  };
}

export const checkUserPlanLimits = checkUserPublishingLimits;

export async function incrementUserPublishUsage(userId: string) {
  const todayStr = new Date().toISOString().split('T')[0];

  await prisma.usage.upsert({
    where: {
      userId_date: {
        userId,
        date: todayStr,
      },
    },
    update: {
      postsPublishedCount: { increment: 1 },
    },
    create: {
      userId,
      date: todayStr,
      postsPublishedCount: 1,
    },
  });
}
