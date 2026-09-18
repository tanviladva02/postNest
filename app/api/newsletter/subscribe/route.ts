import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const subscriberDb = (prisma as any).newsletterSubscriber;

    if (!subscriberDb) {
      return NextResponse.json(
        { error: 'Subscriber database model is initializing.' },
        { status: 500 }
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await subscriberDb.findUnique({
      where: { email: cleanEmail },
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'UNSUBSCRIBED') {
        // Reactivate
        await subscriberDb.update({
          where: { email: cleanEmail },
          data: { status: 'ACTIVE' },
        });
        return NextResponse.json({
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
          subscriber: cleanEmail,
        });
      }

      return NextResponse.json({
        message: 'You are already subscribed to the PostNest newsletter digest!',
        subscriber: cleanEmail,
      });
    }

    // Create new subscriber
    const subscriber = await subscriberDb.create({
      data: {
        email: cleanEmail,
        source: source || 'HOMEPAGE',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(
      {
        message: 'Thank you for subscribing to PostNest Digest! You will receive our weekly developer & tech updates.',
        subscriber: subscriber.email,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in newsletter subscription:', error);
    return NextResponse.json(
      { error: 'Something went wrong while subscribing. Please try again.' },
      { status: 500 }
    );
  }
}
