import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { plans } = await req.json();

    for (const p of plans) {
      await prisma.plan.update({
        where: { id: p.id },
        data: {
          monthlyPostLimit: p.monthlyPostLimit,
          dailyPostLimit: p.dailyPostLimit,
          draftLimit: p.draftLimit !== undefined ? p.draftLimit : undefined,
          hasScheduling: p.hasScheduling !== undefined ? p.hasScheduling : undefined,
          hasBulkUpload: p.hasBulkUpload !== undefined ? p.hasBulkUpload : undefined,
          hasApiAccess: p.hasApiAccess !== undefined ? p.hasApiAccess : undefined,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed updating plans' }, { status: 500 });
  }
}
