// src/app/api/subscription/verify/route.ts
// Verify payment and activate subscription

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, transactions } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = body;

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, currentUser.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate subscription dates
    const now = new Date();
    const subscriptionEndDate = new Date(now);
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // +30 days

    const nextBillingDate = new Date(subscriptionEndDate);

    // Update user subscription status
    await db
      .update(users)
      .set({
        subscriptionStatus: 'ACTIVE',
        subscriptionId: razorpay_subscription_id,
        subscriptionStartDate: now,
        subscriptionEndDate,
        nextBillingDate,
      })
      .where(eq(users.id, user.id));

    // Create transaction record
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(transactions).values({
      id: transactionId,
      userId: user.id,
      type: 'SUBSCRIPTION_PAYMENT',
      amount: 10,
      currency: 'INR',
      status: 'SUCCESS',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySubscriptionId: razorpay_subscription_id,
      razorpaySignature: razorpay_signature,
      billingPeriodStart: now,
      billingPeriodEnd: subscriptionEndDate,
    });

    // Send payment receipt email (don't wait)
    // Import at top: import { sendPaymentReceiptEmail } from '@/lib/resend';
    // sendPaymentReceiptEmail(user.email, user.name, 10, razorpay_payment_id, now)
    //   .catch(err => console.error('Receipt email error:', err));

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully!',
      subscriptionEndDate,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}