import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized user.' }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return NextResponse.json({ error: 'Missing required Razorpay payment verification details.' }, { status: 400 });
    }

    // 1. Verify HMAC Signature
    const isValidSignature = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid payment signature verification failed.' }, { status: 400 });
    }

    // 2. Fetch Plan
    const selectedPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!selectedPlan) {
      return NextResponse.json({ error: 'Selected plan not found.' }, { status: 404 });
    }

    // 3. Cancel existing active subscriptions for user
    await prisma.subscription.updateMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
      data: {
        status: 'CANCELLED',
      },
    });

    // 4. Create new Active Subscription (valid for 30 days)
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const newSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: selectedPlan.id,
        status: 'ACTIVE',
        startDate,
        endDate,
      },
    });

    // 5. Send confirmation notification to user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Plan Upgraded to ${selectedPlan.displayName}! 🚀`,
        message: `Thank you for your payment of ₹${selectedPlan.priceINR}. Your account now has ${selectedPlan.monthlyPostLimit} posts/month limit.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${selectedPlan.displayName}!`,
      subscriptionId: newSubscription.id,
      planName: selectedPlan.name,
    });
  } catch (error: any) {
    console.error('Razorpay Payment Verification Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
