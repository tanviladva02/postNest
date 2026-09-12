import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkUserPublishingLimits } from '@/lib/publishing-limits';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limits = await checkUserPublishingLimits(user.id);
  if (!limits.hasApiAccess) {
    return NextResponse.json(
      {
        error: 'Forbidden. REST API Access is exclusive to Premium and Custom Enterprise plans.',
        hasApiAccess: false,
        planName: limits.planName,
      },
      { status: 403 }
    );
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id, revokedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ keys, hasApiAccess: true });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limits = await checkUserPublishingLimits(user.id);
    if (!limits.hasApiAccess) {
      return NextResponse.json(
        {
          error: 'Forbidden. REST API Access is exclusive to Premium and Custom Enterprise plans. Please upgrade your subscription to generate API keys.',
          hasApiAccess: false,
        },
        { status: 403 }
      );
    }

    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Key name is required' }, { status: 400 });

    const randomBytes = crypto.randomBytes(16).toString('hex');
    const rawApiKey = `pn_live_${randomBytes}`;
    const prefix = `pn_live_${randomBytes.slice(0, 4)}`;
    const keyHash = crypto.createHash('sha256').update(rawApiKey).digest('hex');

    await prisma.apiKey.create({
      data: {
        userId: user.id,
        name,
        prefix,
        keyHash,
      },
    });

    return NextResponse.json({ success: true, apiKey: rawApiKey });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed generating API Key' }, { status: 500 });
  }
}
