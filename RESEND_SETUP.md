# Resend Email Setup Guide

## Step 1: Create Resend Account

1. Go to https://resend.com
2. Click "Start Building for Free"
3. Sign up with GitHub or email
4. Verify your email

## Step 2: Get API Key

1. Login to Resend Dashboard
2. Go to **API Keys**
3. Click "Create API Key"
4. Name: "Marketplace Production"
5. Copy the API key (starts with `re_`)
6. Add to `.env`:
   ```
   RESEND_API_KEY="re_xxxxxxxxxxxxx"
   ```

## Step 3: Add Domain (Production)

### For Production (Custom Domain):
1. Go to **Domains**
2. Click "Add Domain"
3. Enter your domain: `yourdomain.com`
4. Add DNS records (they'll show you what to add)
5. Wait for verification (5-10 minutes)
6. Once verified, set FROM email:
   ```
   RESEND_FROM_EMAIL="Marketplace <noreply@yourdomain.com>"
   ```

### For Testing (Free):
- Use Resend's test domain
- FROM: `onboarding@resend.dev`
- Can only send to your verified email
- Perfect for development!

## Step 4: Verify Your Email (Testing)

1. Go to **Settings** → **Emails**
2. Add your email address
3. Click verification link in email
4. Now you can receive test emails!

## Step 5: Update .env

```bash
# Resend
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="Marketplace <noreply@yourdomain.com>"

# Or for testing:
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

## Step 6: Email Templates Included

We've created 5 email templates:

1. **Welcome Email** - After signup
2. **Password Reset** - Forgot password
3. **Subscription Reminder** - 3 days before expiry
4. **Subscription Expired** - When payment fails
5. **Payment Receipt** - After successful payment

## Pricing

### Free Tier:
- **100 emails/day**
- **3,000 emails/month**
- Perfect for starting out!

### Paid Tier:
- $20/month
- **50,000 emails/month**
- $1 per additional 1,000 emails

### Cost Example:
```
100 users = FREE
1,000 users = FREE
5,000 users = $20/month
10,000 users = $20/month
```

Much cheaper than SendGrid or Mailgun! 💰

## Testing Emails

### Test in Development:
```typescript
import { sendWelcomeEmail } from '@/lib/resend';

// Send test email
await sendWelcomeEmail('your-email@example.com', 'Test User');
```

### Check Email Logs:
1. Go to Resend Dashboard
2. Click "Logs"
3. See all sent emails
4. Check delivery status

## Email Types Usage:

### 1. Welcome Email (Optional)
```typescript
// Uncomment in signup API
sendWelcomeEmail(email, name);
```

### 2. Password Reset (Next step to build)
```typescript
sendPasswordResetEmail(email, name, resetToken);
```

### 3. Subscription Reminder (Cron job)
```typescript
// Run daily cron
sendSubscriptionReminderEmail(email, name, 3);
```

### 4. Subscription Expired (Webhook)
```typescript
// When subscription cancelled
sendSubscriptionExpiredEmail(email, name);
```

### 5. Payment Receipt (After payment)
```typescript
// Uncomment in verify payment API
sendPaymentReceiptEmail(email, name, 10, txnId, date);
```

## Security Best Practices

1. **Never expose API key** in frontend
2. **Use environment variables**
3. **Validate email addresses** before sending
4. **Rate limit** email sending
5. **Unsubscribe link** (for marketing emails)

## Troubleshooting

### Error: "Invalid API key"
- Check RESEND_API_KEY in .env
- Ensure no extra spaces
- Restart development server

### Emails not received:
- Check spam folder
- Verify email address in Resend dashboard (testing)
- Check Resend logs for errors
- For production: Verify domain DNS records

### Error: "Domain not verified"
- Check DNS records
- Wait 10-15 minutes for propagation
- Use `onboarding@resend.dev` for testing

## When to Enable Emails:

### Phase 1 (Now - Testing):
✅ Set up Resend account
✅ Get API key
✅ Test with your email only
❌ Don't uncomment email sending yet

### Phase 2 (Before Launch):
✅ Add custom domain
✅ Verify domain
✅ Uncomment welcome & receipt emails
✅ Test with real users

### Phase 3 (After Launch):
✅ Add subscription reminders
✅ Set up cron jobs
✅ Monitor email delivery

## Ready to Enable?

To enable emails, uncomment these lines:

### In `src/app/api/auth/signup/route.ts`:
```typescript
// Add import at top
import { sendWelcomeEmail } from '@/lib/resend';

// Uncomment after creating user
sendWelcomeEmail(email, name).catch(err => console.error('Welcome email error:', err));
```

### In `src/app/api/subscription/verify/route.ts`:
```typescript
// Add import at top
import { sendPaymentReceiptEmail } from '@/lib/resend';

// Uncomment after transaction created
sendPaymentReceiptEmail(user.email, user.name, 10, razorpay_payment_id, now)
  .catch(err => console.error('Receipt email error:', err));
```

## Support

- Resend Docs: https://resend.com/docs
- Dashboard: https://resend.com/dashboard
- Support: support@resend.com

## Email Examples

All emails are:
✅ Mobile-responsive
✅ Professional design
✅ Call-to-action buttons
✅ Branded with your marketplace

You can customize them in `src/lib/resend.ts`!