import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, transactions, products } from '@/db/schema';
import { verifyWebhookSignature } from '@/lib/cashfree';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Parse the webhook body
    const event = JSON.parse(body);
    const orderData = event.data?.order;
    const paymentData = event.data?.payment;

    if (!orderData) {
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      );
    }

    // ============ FIXED: Proper signature verification ============
    const isValid = verifyWebhookSignature(
      orderData.order_id,
      orderData.order_amount,
      orderData.order_currency,
      signature,
      process.env.CASHFREE_WEBHOOK_SECRET!
    );

    if (!isValid) {
      console.error('Invalid webhook signature for order:', orderData.order_id);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Handle different webhook events
    switch (event.type) {
      case 'PAYMENT_SUCCESS':
        await handlePaymentSuccess(orderData, paymentData);
        break;

      case 'PAYMENT_FAILED':
        await handlePaymentFailed(orderData, paymentData);
        break;

      case 'PAYMENT_USER_DROPPED':
        console.log('User dropped payment for order:', orderData.order_id);
        break;

      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle successful payment
async function handlePaymentSuccess(orderData: any, paymentData: any) {
  const orderId = orderData.order_id;

  try {
    // Find user with this subscription ID
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.subscriptionId, orderId))
      .limit(1);

    if (!user) {
      console.error('User not found for order:', orderId);
      return;
    }

    const now = new Date();
    const subscriptionEndDate = new Date(now);
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    const nextBillingDate = new Date(subscriptionEndDate);

    // Update subscription status
    await db
      .update(users)
      .set({
        subscriptionStatus: 'ACTIVE',
        subscriptionEndDate,
        nextBillingDate,
      })
      .where(eq(users.id, user.id));

    // Create transaction record
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(transactions).values({
      id: transactionId,
      userId: user.id,
      type: 'SUBSCRIPTION_RENEWAL',
      amount: orderData.order_amount,
      currency: orderData.order_currency,
      status: 'SUCCESS',
      cashfreeOrderId: orderId,
      cashfreeTransactionId: paymentData?.cf_payment_id,
      cashfreePaymentStatus: 'SUCCESS',
      billingPeriodStart: now,
      billingPeriodEnd: subscriptionEndDate,
    });

    console.log('✅ Payment successful for user:', user.id, 'Order:', orderId);
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(orderData: any, paymentData: any) {
  const orderId = orderData.order_id;

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.subscriptionId, orderId))
      .limit(1);

    if (!user) {
      console.error('User not found for failed order:', orderId);
      return;
    }

    // Create failed transaction record
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(transactions).values({
      id: transactionId,
      userId: user.id,
      type: 'SUBSCRIPTION_PAYMENT',
      amount: orderData.order_amount,
      currency: orderData.order_currency,
      status: 'FAILED',
      cashfreeOrderId: orderId,
      cashfreeTransactionId: paymentData?.cf_payment_id,
      cashfreePaymentStatus: 'FAILED',
      billingPeriodStart: new Date(),
      billingPeriodEnd: new Date(),
    });

    console.log('❌ Payment failed for user:', user.id, 'Order:', orderId);
  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}