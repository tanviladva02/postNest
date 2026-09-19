import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendNewsletterBroadcastEmail } from '@/lib/email';

async function ensureAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  return user;
}

export async function POST(req: NextRequest) {
  try {
    const admin = await ensureAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { subject, previewText, contentHtml, testOnly, testEmail } = body;

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid email subject line.' },
        { status: 400 }
      );
    }

    if (!contentHtml || typeof contentHtml !== 'string' || !contentHtml.trim()) {
      return NextResponse.json(
        { error: 'Please provide newsletter HTML content.' },
        { status: 400 }
      );
    }

    // 1. Send Test Email Mode
    if (testOnly) {
      const targetEmail = testEmail && typeof testEmail === 'string' && testEmail.includes('@')
        ? testEmail.trim()
        : admin.email;

      const result = await sendNewsletterBroadcastEmail({
        toEmail: targetEmail,
        subject: `[TEST PREVIEW] ${subject.trim()}`,
        previewText: previewText?.trim(),
        bodyHtml: contentHtml,
      });

      if (result.success) {
        return NextResponse.json({
          message: `Test email successfully sent to ${targetEmail}`,
          targetEmail,
        });
      } else {
        return NextResponse.json(
          { error: `Failed to send test email: ${result.error || 'Unknown error'}` },
          { status: 500 }
        );
      }
    }

    // 2. Full Broadcast Mode
    const subscriberDb = (prisma as any).newsletterSubscriber;

    if (!subscriberDb) {
      return NextResponse.json(
        { error: 'Subscriber database model not ready.' },
        { status: 500 }
      );
    }

    // Retrieve active subscribers
    const activeSubscribers = await subscriberDb.findMany({
      where: { status: 'ACTIVE' },
      select: { email: true },
    });

    if (!activeSubscribers || activeSubscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found in database to broadcast to.' },
        { status: 400 }
      );
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send emails in sequence / batched promises to avoid SMTP throttling
    for (const sub of activeSubscribers) {
      try {
        const res = await sendNewsletterBroadcastEmail({
          toEmail: sub.email,
          subject: subject.trim(),
          previewText: previewText?.trim(),
          bodyHtml: contentHtml,
        });

        if (res.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      } catch (err) {
        console.error(`Error sending broadcast email to ${sub.email}:`, err);
        failedCount++;
      }
    }

    return NextResponse.json({
      message: `Newsletter broadcast completed! Sent to ${sentCount} subscriber(s).`,
      metrics: {
        totalTargeted: activeSubscribers.length,
        sentCount,
        failedCount,
      },
    });
  } catch (error: any) {
    console.error('Error executing newsletter broadcast:', error);
    return NextResponse.json(
      { error: 'Something went wrong while processing the newsletter broadcast.' },
      { status: 500 }
    );
  }
}
