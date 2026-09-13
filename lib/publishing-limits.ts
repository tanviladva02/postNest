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
  cycleStartDate?: Date;
  nextResetDate?: Date;
}

export function isUnlimitedTestingEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === 'tanviladva01@gmail.com';
}

export async function checkUserPublishingLimits(userId: string): Promise<LimitCheckResult> {
  // 1. Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, role: true, createdAt: true },
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

  // 3. Query current user drafts count
  const currentDraftCount = await prisma.post.count({
    where: {
      authorId: userId,
      status: 'DRAFT',
    },
  });

  // 4. Fetch active subscription & plan details
  const activeSub = await prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: { plan: true },
    orderBy: { startDate: 'desc' },
  });

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

  // 5. Calculate Rolling 30-Day Billing Cycle Start & Reset Dates
  const now = new Date();
  let cycleStartDate: Date;
  let nextResetDate: Date;

  if (activeSub && activeSub.startDate) {
    // Paid plan: Cycle starts on the date the user purchased/upgraded
    cycleStartDate = new Date(activeSub.startDate);
    if (activeSub.endDate) {
      nextResetDate = new Date(activeSub.endDate);
    } else {
      nextResetDate = new Date(cycleStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  } else {
    // Free / Early Bird plan: 30-day rolling cycle calculated from user's signup date
    const signupDate = user?.createdAt ? new Date(user.createdAt) : new Date();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const elapsedPeriods = Math.floor(Math.max(0, now.getTime() - signupDate.getTime()) / thirtyDaysMs);
    
    cycleStartDate = new Date(signupDate.getTime() + elapsedPeriods * thirtyDaysMs);
    nextResetDate = new Date(cycleStartDate.getTime() + thirtyDaysMs);
  }

  // 6. Query published posts count within CURRENT ROLLING BILLING CYCLE
  const monthlyCount = await prisma.post.count({
    where: {
      authorId: userId,
      status: 'PUBLISHED',
      publishedAt: {
        gte: cycleStartDate,
      },
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
      cycleStartDate,
      nextResetDate,
    };
  }

  // 7. Evaluate Limit Rules
  let allowed = true;
  let reason: string | undefined = undefined;

  const resetFormatted = nextResetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  if (plan.monthlyPostLimit > 0 && monthlyCount >= plan.monthlyPostLimit) {
    allowed = false;
    reason = `You have reached your limit of ${plan.monthlyPostLimit} published posts for your current 30-day billing cycle (used: ${monthlyCount}/${plan.monthlyPostLimit}). Your quota resets on ${resetFormatted}, or you can upgrade your plan to publish immediately.`;
  } else if (plan.dailyPostLimit > 0 && currentDailyCount >= plan.dailyPostLimit) {
    allowed = false;
    reason = `Daily limit reached! Your ${plan.displayName} allows maximum ${plan.dailyPostLimit} published posts per day (used today: ${currentDailyCount}/${plan.dailyPostLimit}).`;
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
    cycleStartDate,
    nextResetDate,
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
