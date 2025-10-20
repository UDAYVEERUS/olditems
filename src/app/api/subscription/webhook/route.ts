// src/app/api/subscription/webhook/route.ts
// Handle Razorpay webhooks for auto-renewal

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, transactions, products } from '@/db/schema';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(
      body,
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const payload = event.payload.subscription.entity || event.payload.payment.entity;

    // Handle different webhook events
    switch (event.event) {
      case 'subscription.charged':
        await handleSubscriptionCharged(payload);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload);
        break;

      case 'subscription.paused':
        await handleSubscriptionPaused(payload);
        break;

      case 'subscription.resumed':
        await handleSubscriptionResumed(payload);
        break;

      case 'subscription.completed':
        await handleSubscriptionCompleted(payload);
        break;

      case 'subscription.authenticated':
        // First payment successful
        await handleSubscriptionAuthenticated(payload);
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
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

// Handle successful subscription charge (renewal)
async function handleSubscriptionCharged(payload: any) {
  const subscriptionId = payload.id;

  // Find user with this subscription
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.subscriptionId, subscriptionId))
    .limit(1);

  if (!user) {
    console.error('User not found for subscription:', subscriptionId);
    return;
  }

  // Calculate next billing date
  const now = new Date();
  const nextBillingDate = new Date(now);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const subscriptionEndDate = new Date(nextBillingDate);

  // Update subscription
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
    amount: 10,
    currency: 'INR',
    status: 'SUCCESS',
    razorpaySubscriptionId: subscriptionId,
    billingPeriodStart: now,
    billingPeriodEnd: subscriptionEndDate,
  });

  console.log('Subscription renewed for user:', user.id);
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(payload: any) {
  const subscriptionId = payload.id;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.subscriptionId, subscriptionId))
    .limit(1);

  if (!user) return;

  // Update subscription status
  await db
    .update(users)
    .set({
      subscriptionStatus: 'CANCELLED',
    })
    .where(eq(users.id, user.id));

  // Hide all user's products
  await db
    .update(products)
    .set({ status: 'HIDDEN' })
    .where(eq(products.userId, user.id));

  console.log('Subscription cancelled for user:', user.id);
}

// Handle subscription pause
async function handleSubscriptionPaused(payload: any) {
  const subscriptionId = payload.id;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.subscriptionId, subscriptionId))
    .limit(1);

  if (!user) return;

  await db
    .update(users)
    .set({
      subscriptionStatus: 'PAST_DUE',
    })
    .where(eq(users.id, user.id));

  console.log('Subscription paused for user:', user.id);
}

// Handle subscription resume
async function handleSubscriptionResumed(payload: any) {
  const subscriptionId = payload.id;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.subscriptionId, subscriptionId))
    .limit(1);

  if (!user) return;

  await db
    .update(users)
    .set({
      subscriptionStatus: 'ACTIVE',
    })
    .where(eq(users.id, user.id));

  // Unhide all user's products
  await db
    .update(products)
    .set({ status: 'ACTIVE' })
    .where(eq(products.userId, user.id));

  console.log('Subscription resumed for user:', user.id);
}

// Handle subscription completion
async function handleSubscriptionCompleted(payload: any) {
  const subscriptionId = payload.id;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.subscriptionId, subscriptionId))
    .limit(1);

  if (!user) return;

  await db
    .update(users)
    .set({
      subscriptionStatus: 'CANCELLED',
    })
    .where(eq(users.id, user.id));

  console.log('Subscription completed for user:', user.id);
}

// Handle first authentication
async function handleSubscriptionAuthenticated(payload: any) {
  console.log('Subscription authenticated:', payload.id);
}