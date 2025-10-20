# Razorpay Setup Guide

## Step 1: Create Razorpay Account

1. Go to https://razorpay.com
2. Click "Sign Up" (use your business email)
3. Complete KYC verification (required for live payments)
4. For testing, you can use Test Mode

## Step 2: Get API Keys

1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Keys** (for development)
4. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (click eye icon to reveal)

## Step 3: Create Subscription Plan

1. Go to **Subscriptions** → **Plans**
2. Click **Create New Plan**
3. Fill details:
   - **Plan Name**: Monthly Subscription
   - **Billing Amount**: ₹10
   - **Billing Interval**: 1 month
   - **Description**: Marketplace listing subscription
4. Click **Create Plan**
5. Copy **Plan ID** (starts with `plan_`)

## Step 4: Setup Webhook

1. Go to **Settings** → **Webhooks**
2. Click **Add New Webhook**
3. Enter details:
   - **Webhook URL**: `https://yourdomain.com/api/subscription/webhook`
   - **Active Events**: Select all subscription events:
     - subscription.charged
     - subscription.cancelled
     - subscription.paused
     - subscription.resumed
     - subscription.completed
     - subscription.authenticated
4. Copy **Webhook Secret**

## Step 5: Add to .env File

```bash
# Razorpay Credentials
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_key_secret_here"
RAZORPAY_PLAN_ID="plan_xxxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"

# For Production (after going live)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxx"
```

## Step 6: Test Payment Flow

### Test Mode Credentials

Use these test cards in Test Mode:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`

**Other Test Cards:**
- Mastercard: `5555 5555 5555 4444`
- Visa: `4012 8888 8888 1881`

### Test UPI:
- UPI ID: `success@razorpay`

## Step 7: Testing Webhooks Locally

For local testing, use **ngrok** to expose your localhost:

```bash
# Install ngrok
npm install -g ngrok

# Run your Next.js app
npm run dev

# In another terminal, expose port 3000
ngrok http 3000

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Add webhook in Razorpay: https://abc123.ngrok.io/api/subscription/webhook
```

## Step 8: Go Live Checklist

Before switching to production:

1. ✅ Complete KYC verification on Razorpay
2. ✅ Generate Live API Keys
3. ✅ Create Live Plan
4. ✅ Update webhook URL to production domain
5. ✅ Update `.env` with live credentials
6. ✅ Test end-to-end flow in Test Mode first

## Important Notes

### Subscription Flow:
1. User clicks "Subscribe"
2. Razorpay subscription created
3. Razorpay checkout opens
4. User pays ₹10
5. Payment success → webhook fires
6. Backend activates subscription
7. User can list products

### Auto-Renewal:
- Razorpay automatically charges every 30 days
- Webhook `subscription.charged` fires on renewal
- Backend extends subscription by 30 days
- If payment fails, status changes to `PAST_DUE`

### Handling Failed Payments:
- Razorpay retries failed payments automatically
- After 3 failed attempts, subscription becomes `CANCELLED`
- User's products get hidden
- User must resubscribe to continue

## Pricing & Fees

**Razorpay Transaction Fees:**
- 2% + ₹0 (for transactions below ₹2000)
- For ₹10 transaction: You receive ~₹9.80

**Example Calculation:**
- User pays: ₹10
- Razorpay fee: ₹0.20
- You receive: ₹9.80

## Security Best Practices

1. **Never expose Key Secret** in frontend code
2. **Always verify webhook signatures** before processing
3. **Use HTTPS** for webhook URLs in production
4. **Store webhook secret** securely in environment variables
5. **Log all webhook events** for debugging

## Troubleshooting

### Error: "Invalid API Key"
- Check RAZORPAY_KEY_ID in .env
- Ensure using Test key in development
- Restart server after changing .env

### Error: "Plan not found"
- Verify RAZORPAY_PLAN_ID matches dashboard
- Ensure plan is in Test/Live mode matching your keys

### Webhook not firing locally
- Use ngrok to expose localhost
- Check webhook URL in Razorpay dashboard
- Verify webhook secret matches .env

### Payment successful but subscription not activated
- Check webhook logs in Razorpay dashboard
- Verify signature validation in webhook handler
- Check server logs for errors

## Support

- Razorpay Docs: https://razorpay.com/docs/subscriptions/
- Support: support@razorpay.com
- Dashboard: https://dashboard.razorpay.com