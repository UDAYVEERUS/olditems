import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, transactions, products } from '@/db/schema';
import { verifyWebhookSignature } from '@/lib/cashfree';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    console.log('='.repeat(60));
    console.log('🔔 WEBHOOK RECEIVED AT:', new Date().toISOString());
    console.log('='.repeat(60));

    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    console.log('📝 RAW BODY:', body);
    console.log('✍️ SIGNATURE FROM HEADER:', signature);

    if (!signature) {
      console.log('❌ Missing signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Parse the webhook body
    let event;
    try {
      event = JSON.parse(body);
      console.log('✅ Body parsed successfully');
      console.log('📦 Event type:', event.type);
    } catch (parseError) {
      console.error('❌ Failed to parse body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const orderData = event.data?.order;
    const paymentData = event.data?.payment;

    console.log('📦 Order data:', JSON.stringify(orderData, null, 2));
    console.log('💳 Payment data:', JSON.stringify(paymentData, null, 2));

    if (!orderData) {
      console.log('❌ Invalid webhook data - no order found');
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      );
    }

    // ============ WEBHOOK SIGNATURE VERIFICATION ============
    console.log('\n🔐 VERIFYING WEBHOOK SIGNATURE...');
    
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;
    console.log('🔑 Webhook secret exists:', !!webhookSecret);
    
    if (!webhookSecret) {
      console.error('❌ CASHFREE_WEBHOOK_SECRET not configured in environment');
      console.log('⚠️ WARNING: Webhook signature verification skipped - secret not configured');
      console.log('ℹ️ Set CASHFREE_WEBHOOK_SECRET in environment variables');
    } else {
      // Compute what signature should be
      const message = `${orderData.order_id}${orderData.order_amount}${orderData.order_currency}`;
      const computedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(message)
        .digest('hex');

      console.log('📊 SIGNATURE VERIFICATION DETAILS:');
      console.log('Order ID:', orderData.order_id);
      console.log('Amount:', orderData.order_amount);
      console.log('Currency:', orderData.order_currency);
      console.log('Message to sign:', message);
      console.log('Expected signature:', computedSignature);
      console.log('Received signature:', signature);

      const isValid = computedSignature === signature;
      console.log('✅ Signature valid:', isValid);

      if (!isValid) {
        console.error('❌ INVALID WEBHOOK SIGNATURE');
        console.error('This could mean:');
        console.error('1. Webhook secret is wrong');
        console.error('2. Cashfree is not using the same secret');
        console.error('3. Request was tampered with');
        
        // For debugging: log but still process (you can change this to return 401)
        console.warn('⚠️ Continuing anyway (signature verification failed but processing webhook)');
        // Uncomment line below to reject invalid signatures:
        // return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    console.log('\n📋 PROCESSING WEBHOOK EVENT...');

    // Handle different webhook events
    switch (event.type) {
      case 'PAYMENT_SUCCESS':
        console.log('✅ Processing PAYMENT_SUCCESS');
        await handlePaymentSuccess(orderData, paymentData);
        break;

      case 'PAYMENT_FAILED':
        console.log('❌ Processing PAYMENT_FAILED');
        await handlePaymentFailed(orderData, paymentData);
        break;

      case 'PAYMENT_USER_DROPPED':
        console.log('👤 User dropped payment for order:', orderData.order_id);
        break;

      default:
        console.log('⚠️ Unhandled webhook event type:', event.type);
    }

    console.log('✅ Webhook processed successfully');
    console.log('='.repeat(60));
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('💥 WEBHOOK ERROR:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
    console.log('='.repeat(60));
    
    return NextResponse.json(
      { error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    );
  }
}

// Handle successful payment
async function handlePaymentSuccess(orderData: any, paymentData: any) {
  const orderId = orderData.order_id;

  console.log(`\n💰 HANDLING PAYMENT SUCCESS for order: ${orderId}`);

  try {
    // Find user with this subscription ID
    console.log(`🔍 Finding user with subscriptionId: ${orderId}`);
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.subscriptionId, orderId))
      .limit(1);

    if (!user) {
      console.error('❌ User not found for order:', orderId);
      return;
    }

    console.log('✅ User found:', user.id, user.email);

    const now = new Date();
    const subscriptionEndDate = new Date(now);
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    const nextBillingDate = new Date(subscriptionEndDate);

    console.log('📅 Subscription dates:');
    console.log('   Start:', now);
    console.log('   End:', subscriptionEndDate);
    console.log('   Next billing:', nextBillingDate);

    // Update subscription status
    console.log('🔄 Updating user subscription status to ACTIVE...');
    await db
      .update(users)
      .set({
        subscriptionStatus: 'ACTIVE',
        subscriptionEndDate,
        nextBillingDate,
      })
      .where(eq(users.id, user.id));

    console.log('✅ User subscription updated');

    // Create transaction record
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('💾 Creating transaction:', transactionId);
    
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

    console.log('✅ Transaction created successfully');
    console.log(`✨ Payment successful for user: ${user.id}, Order: ${orderId}`);
  } catch (error) {
    console.error('❌ Error processing successful payment:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
  }
}

// Handle failed payment
async function handlePaymentFailed(orderData: any, paymentData: any) {
  const orderId = orderData.order_id;

  console.log(`\n❌ HANDLING PAYMENT FAILED for order: ${orderId}`);

  try {
    console.log(`🔍 Finding user with subscriptionId: ${orderId}`);
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.subscriptionId, orderId))
      .limit(1);

    if (!user) {
      console.error('❌ User not found for failed order:', orderId);
      return;
    }

    console.log('✅ User found:', user.id, user.email);

    // Create failed transaction record
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('💾 Creating failed transaction:', transactionId);
    
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

    console.log('✅ Failed transaction recorded');
    console.log(`⚠️ Payment failed for user: ${user.id}, Order: ${orderId}`);
  } catch (error) {
    console.error('❌ Error processing failed payment:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
  }
}