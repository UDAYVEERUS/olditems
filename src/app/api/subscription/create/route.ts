// src/app/api/subscription/create/route.ts
// Create Razorpay subscription for user

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { createSubscription } from '@/lib/razorpay';
import { eq } from 'drizzle-orm';

// Razorpay Plan ID (create this in Razorpay dashboard first)
const RAZORPAY_PLAN_ID = process.env.RAZORPAY_PLAN_ID || 'plan_XXXXXXXXXXXX';

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

    // Create Razorpay subscription
    const subscription = await createSubscription(RAZORPAY_PLAN_ID);

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      // Return these for Razorpay checkout
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: 10, // ₹10
      currency: 'INR',
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}