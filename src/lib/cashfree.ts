// import crypto from 'crypto';

// const BASE_URL = process.env.NODE_ENV === 'production'
//   ? 'https://api.cashfree.com/pg'
//   : 'https://sandbox.cashfree.com/pg';

// interface CreateOrderParams {
//   customerId: string;
//   email: string;
//   phone: string;
//   amount: number;
//   orderId: string;
//   customerName: string;
// }

// // Generate idempotency key (prevent duplicate requests)
// function generateIdempotencyKey(): string {
//   return crypto.randomBytes(16).toString('hex');
// }

// // Create payment order for initial subscription
// export async function createPaymentOrder(params: CreateOrderParams) {
//   try {
//     const response = await fetch(`${BASE_URL}/orders`, {
//       method: 'POST',
//       headers: {
//         'X-Client-Id': process.env.CASHFREE_APP_ID!,
//         'X-Client-Secret': process.env.CASHFREE_SECRET_KEY!,
//         'X-Idempotency-Key': generateIdempotencyKey(),
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         order_id: params.orderId,
//         order_amount: params.amount,
//         order_currency: 'INR',
//         customer_details: {
//           customer_id: params.customerId,
//           customer_email: params.email,
//           customer_phone: params.phone,
//           customer_name: params.customerName,
//         },
//         order_meta: {
//           return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/verify`,
//           notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscription/webhook`,
//         },
//         order_tags: {
//           subscription_type: 'monthly',
//         },
//       }),
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || 'Failed to create order');
//     return data;
//   } catch (error) {
//     console.error('Create payment order error:', error);
//     throw error;
//   }
// }

// // Set up subscription with Cashfree
// export async function createSubscription(params: CreateOrderParams) {
//   try {
//     // First, create a payment order
//     const orderData = await createPaymentOrder(params);
    
//     return {
//       orderId: orderData.order_id,
//       paymentLink: orderData.payment_link_url, // Use this to redirect user
//       sessionId: orderData.cf_order_id, // Cashfree internal ID
//     };
//   } catch (error) {
//     console.error('Create subscription error:', error);
//     throw error;
//   }
// }

// // ============ FIXED: Webhook signature verification ============
// // Cashfree uses: SHA-256(order_id + order_amount + order_currency + secret_key)
// export function verifyWebhookSignature(
//   orderId: string,
//   orderAmount: number,
//   orderCurrency: string,
//   signature: string,
//   secret: string
// ): boolean {
//   try {
//     // Construct the exact string that was signed
//     const message = `${orderId}${orderAmount}${orderCurrency}`;
    
//     // Compute the expected signature
//     const computedSignature = crypto
//       .createHmac('sha256', secret)
//       .update(message)
//       .digest('hex');

//     // Compare signatures
//     const isValid = computedSignature === signature;
    
//     if (!isValid) {
//       console.error('Webhook signature mismatch');
//       console.error(`Expected: ${computedSignature}`);
//       console.error(`Got: ${signature}`);
//     }

//     return isValid;
//   } catch (error) {
//     console.error('Verify webhook signature error:', error);
//     return false;
//   }
// }

// // Verify payment after completion
// export async function verifyPayment(orderId: string) {
//   try {
//     const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
//       method: 'GET',
//       headers: {
//         'X-Client-Id': process.env.CASHFREE_APP_ID!,
//         'X-Client-Secret': process.env.CASHFREE_SECRET_KEY!,
//       },
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message);
//     return data;
//   } catch (error) {
//     console.error('Verify payment error:', error);
//     throw error;
//   }
// }

// // Refund payment
// export async function refundPayment(
//   orderId: string,
//   refundAmount: number,
//   refundNote: string
// ) {
//   try {
//     const response = await fetch(`${BASE_URL}/orders/${orderId}/refunds`, {
//       method: 'POST',
//       headers: {
//         'X-Client-Id': process.env.CASHFREE_APP_ID!,
//         'X-Client-Secret': process.env.CASHFREE_SECRET_KEY!,
//         'X-Idempotency-Key': generateIdempotencyKey(),
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         refund_amount: refundAmount,
//         refund_note: refundNote,
//       }),
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message);
//     return data;
//   } catch (error) { 
//     console.error('Refund payment error:', error);
//     throw error;
//   }
// }