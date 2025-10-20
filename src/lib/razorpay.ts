// src/lib/razorpay.ts
// Razorpay helper functions

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Create Razorpay subscription
export async function createSubscription(planId: string, customerId?: string) {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months (can be set to unlimited with 0)
      quantity: 1,
    });

    return subscription;
  } catch (error) {
    console.error('Create subscription error:', error);
    throw error;
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await razorpay.subscriptions.cancel(subscriptionId, true);
    return subscription;
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw error;
  }
}

// Verify Razorpay signature for webhook
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Verify signature error:', error);
    return false;
  }
}

// Verify payment signature (for frontend payment verification)
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Verify payment signature error:', error);
    return false;
  }
}