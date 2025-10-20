# MSG91 Setup Guide

## Step 1: Create MSG91 Account

1. Go to https://msg91.com
2. Click "Sign Up" (free account)
3. Enter your details
4. Verify your email

## Step 2: Get Auth Key

1. Login to MSG91 Dashboard
2. Go to **Settings** → **API Keys**
3. Copy your **Auth Key**
4. Add to `.env`:
   ```
   MSG91_AUTH_KEY="your_auth_key_here"
   ```

## Step 3: Create SMS Template

1. Go to **SMS** → **Templates**
2. Click **Create Template**
3. Fill details:
   - **Template Name**: OTP Verification
   - **Template ID**: (auto-generated, copy this)
   - **Message**: `Your Marketplace verification code is ##OTP##. Valid for 5 minutes.`
   - **Template Type**: Transactional
   - **DLT Template ID**: (for India - you'll need to register)
4. Submit for approval
5. Copy **Template ID** to `.env`:
   ```
   MSG91_TEMPLATE_ID="your_template_id"
   ```

## Step 4: Add Sender ID (Optional)

1. Go to **Settings** → **Sender IDs**
2. Add a 6-character sender ID (e.g., "MARKET")
3. Wait for approval (1-2 days)
4. Use in code:
   ```typescript
   sender: 'MARKET'
   ```

## Step 5: DLT Registration (India Only - Required for Production)

### What is DLT?
- **Distributed Ledger Technology**
- Required by TRAI (India) for commercial SMS
- Prevents spam messages

### How to Register:
1. Visit your telecom operator's DLT portal:
   - **Airtel**: https://www.airtel.in/business/commercial-communication
   - **Jio**: https://trueconnect.jio.com
   - **Vodafone**: https://www.vilpower.in
   - **BSNL**: https://www.ucc-bsnl.co.in

2. Register as **Principal Entity** (your business)
3. Add your **SMS Template**
4. Add your **Sender ID**
5. Get **DLT Template ID** and **Sender ID**
6. Add to MSG91 template

### Note:
- **For Testing**: Skip DLT (works on your registered mobile)
- **For Production**: DLT is MANDATORY in India

## Step 6: Test in Development

### Test Mode (No DLT Required):
```typescript
// OTP will be sent to your registered mobile only
// Check console.log for OTP during development
```

### .env Setup:
```bash
MSG91_AUTH_KEY="your_auth_key"
MSG91_TEMPLATE_ID="template_id_from_msg91"
```

## Step 7: Pricing

### MSG91 Pricing (India):
- **Transactional SMS**: ₹0.20 per SMS
- **Promotional SMS**: ₹0.15 per SMS
- **OTP SMS**: ₹0.20 per SMS

### Free Credits:
- New accounts get ₹20 FREE credits
- 100 free OTPs to test!

### Monthly Cost Example:
- **100 users signup**: ₹20
- **500 users signup**: ₹100
- **1000 users signup**: ₹200

Very affordable! 💰

## Step 8: API Routes

MSG91 provides multiple APIs:

### Option 1: OTP API (Recommended)
```
POST https://control.msg91.com/api/v5/otp
```
- Automatic OTP generation
- Built-in retry logic
- Best for production

### Option 2: SMS API (We're using this)
```
GET https://api.msg91.com/api/v2/sendsms
```
- Manual OTP generation
- Full control
- Works without DLT for testing

## Troubleshooting

### Error: "Invalid Auth Key"
- Check MSG91_AUTH_KEY in .env
- Ensure no extra spaces
- Restart development server

### Error: "Template not found"
- Check MSG91_TEMPLATE_ID
- Ensure template is approved
- Use SMS API instead of OTP API for testing

### OTP not received:
- Check phone number format (10 digits)
- Verify phone is registered on MSG91 (for testing)
- Check MSG91 dashboard logs
- For production: Ensure DLT registration complete

### Error: "DLT Template ID required"
- This is for production in India
- For testing: Use registered mobile only
- For production: Complete DLT registration

## Alternative: Testing Without MSG91

For development, you can:
```typescript
// In development mode
if (process.env.NODE_ENV === 'development') {
  console.log(`OTP for ${phone}: ${otp}`);
  // Don't actually send SMS, just log
}
```

## Support

- MSG91 Docs: https://docs.msg91.com
- Support: support@msg91.com
- Dashboard: https://control.msg91.com

## Ready for Production Checklist

✅ MSG91 account created
✅ Auth key added to .env
✅ SMS template created & approved
✅ Sender ID registered & approved
✅ DLT registration complete (India)
✅ DLT Template ID added
✅ Test OTP sent successfully
✅ Production ready!