import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['UNREAD', 'READ', 'RESOLVED', 'ARCHIVED'] as const;
type MessageStatus = (typeof VALID_STATUSES)[number];

// Helper: Ensure request is from an authenticated admin
async function ensureAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  return user;
}

/**
 * GET: List contact inquiries with optional filtering, search, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const admin = await ensureAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();

    const where: any = {};

    if (status && status !== 'ALL' && (VALID_STATUSES as readonly string[]).includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [messages, totalCount, unreadCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    ]);

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      unreadCount,
    });
  } catch (error: any) {
    console.error('[Admin Messages GET Error]:', error);
    return NextResponse.json({ error: 'Failed to retrieve inquiries.' }, { status: 500 });
  }
}

/**
 * PATCH: Update message status (UNREAD, READ, RESOLVED, ARCHIVED)
 */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await ensureAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Message ID is required.' }, { status: 400 });
    }

    if (!status || !(VALID_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `Inquiry marked as ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('[Admin Messages PATCH Error]:', error);
    return NextResponse.json({ error: 'Failed to update message status.' }, { status: 500 });
  }
}

/**
 * DELETE: Permanently delete an inquiry
 */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await ensureAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required.' }, { status: 400 });
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully.',
    });
  } catch (error: any) {
    console.error('[Admin Messages DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete message.' }, { status: 500 });
  }
}
