import { prisma } from '@/lib/prisma';

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  currentDailyCount: number;
  dailyLimit: number;
  currentMonthlyCount: number;
  monthlyLimit: number;
  planName: string;
  hasBulkUpload: boolean;
  hasApiAccess: boolean;
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

  // Bypass limits for unlimited testing account
  if (isUnlimited) {
    return {
      allowed: true,
      reason: undefined,
      currentDailyCount,
      dailyLimit: 0,
      currentMonthlyCount: monthlyCount,
      monthlyLimit: 0,
      planName: 'Testing Account (Unlimited)',
      hasBulkUpload: true,
      hasApiAccess: true,
      isUnlimited: true,
    };
  }

  // 4. Get active user subscription and plan details
  const activeSub = await prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: { plan: true },
    orderBy: { startDate: 'desc' },
  });

  // Default to EARLY_BIRD or FREE plan if no subscription attached
  let plan = activeSub?.plan;
  if (!plan) {
    plan = await prisma.plan.findUnique({ where: { name: 'EARLY_BIRD' } }) ||
           await prisma.plan.findUnique({ where: { name: 'FREE' } }) || {
             id: 'fallback',
             name: 'FREE',
             displayName: 'Free Starter Plan',
             priceINR: 0,
             monthlyPostLimit: 15,
             dailyPostLimit: 2,
             hasBulkUpload: false,
             hasApiAccess: false,
             description: 'Default free plan',
             createdAt: new Date(),
           };
  }

  // 4. Evaluate Limit Rules
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
    planName: plan.displayName,
    hasBulkUpload: plan.hasBulkUpload,
    hasApiAccess: plan.hasApiAccess,
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
