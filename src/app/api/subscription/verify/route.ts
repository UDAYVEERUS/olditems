import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, transactions } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { verifyPayment } from '@/lib/cashfree';
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
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    // Verify payment with Cashfree API
    const paymentData = await verifyPayment(orderId);

    // Check if payment is successful
    if (paymentData.order_status !== 'PAID') {
      return NextResponse.json(
        { error: 'Payment not completed' },
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
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    const nextBillingDate = new Date(subscriptionEndDate);

    // Update user subscription
    await db
      .update(users)
      .set({
        subscriptionStatus: 'ACTIVE',
        subscriptionId: orderId,
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
      cashfreeOrderId: orderId, // Changed from razorpay
      cashfreeTransactionId: paymentData.cf_payment_id,
      cashfreePaymentStatus: 'SUCCESS',
      billingPeriodStart: now,
      billingPeriodEnd: subscriptionEndDate,
    });

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