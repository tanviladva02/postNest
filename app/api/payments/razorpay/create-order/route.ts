import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to upgrade.' }, { status: 401 });
    }

    const body = await req.json();
    const { planName } = body; // 'STANDARD' or 'PREMIUM'

    if (!planName || !['STANDARD', 'PREMIUM'].includes(planName.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 });
    }

    const targetPlan = await prisma.plan.findUnique({
      where: { name: planName.toUpperCase() },
    });

    if (!targetPlan) {
      return NextResponse.json({ error: 'Selected plan is not available.' }, { status: 404 });
    }

    if (targetPlan.priceINR <= 0) {
      return NextResponse.json({ error: 'This plan does not require online payment.' }, { status: 400 });
    }

    const razorpay = getRazorpayInstance();

    // Razorpay requires amount in smallest currency sub-unit (paise for INR: 1 INR = 100 paise)
    const amountInPaise = targetPlan.priceINR * 100;

    const receiptId = `rcpt_${user.id.slice(0, 8)}_${Date.now().toString().slice(-6)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        userId: user.id,
        userEmail: user.email,
        planId: targetPlan.id,
        planName: targetPlan.name,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      planId: targetPlan.id,
      planName: targetPlan.name,
      displayName: targetPlan.displayName,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate Razorpay payment order.' },
      { status: 500 }
    );
  }
}
