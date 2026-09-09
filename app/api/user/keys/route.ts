import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id, revokedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ keys });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
