import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { createSubscription } from '@/lib/cashfree';
import { eq } from 'drizzle-orm';

export async function POST() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
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

    // Check if user already has active subscription
    const now = new Date();
    if (
      user.subscriptionStatus === 'ACTIVE' &&
      user.subscriptionEndDate &&
      new Date(user.subscriptionEndDate) > now
    ) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${user.id}`;

    // Create Cashfree payment order
    const subscription = await createSubscription({
      customerId: user.id,
      email: user.email,
      phone: user.phone || '9999999999',
      amount: 10,
      orderId,
      customerName: user.name,
    });

    return NextResponse.json({
      success: true,
      orderId: subscription.orderId,
      paymentLink: subscription.paymentLink,
      sessionId: subscription.sessionId,
      amount: 10,
      currency: 'INR',
      userName: user.name,
      userEmail: user.email,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}