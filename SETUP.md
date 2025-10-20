# Complete Project Setup

## 1. Install All Dependencies

```bash
npm install

# Core dependencies already in package.json:
# - drizzle-orm, mysql2 (database)
# - bcryptjs, jsonwebtoken (auth)
# - react-hot-toast (notifications)
# - lucide-react (icons)
# - razorpay (payments)
```

## 2. Setup MySQL Database

Choose one option:

### Option A: Local MySQL
```bash
mysql -u root -p
CREATE DATABASE marketplace;
```

### Option B: PlanetScale (Recommended - Free)
1. Go to https://planetscale.com
2. Create account
3. Create new database: "marketplace"
4. Copy connection string

### Option C: Railway
1. Go to https://railway.app
2. Create MySQL database
3. Copy connection string

## 3. Setup Razorpay

Follow **RAZORPAY_SETUP.md** for detailed steps:

1. Create Razorpay account
2. Get Test API Keys
3. Create Subscription Plan (₹10/month)
4. Setup webhook
5. Copy all credentials

## 4. Setup Cloudinary

Follow **CLOUDINARY_SETUP.md** for detailed steps:

1. Create Cloudinary account
2. Get Cloud Name, API Key, API Secret
3. Create upload preset named "marketplace"

## 5. Configure Environment Variables

```bash
# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Required variables:
```bash
DATABASE_URL="mysql://..."
JWT_SECRET="..." # Run: openssl rand -base64 32
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_PLAN_ID="plan_..."
RAZORPAY_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

## 6. Setup Database Schema

```bash
# Generate and push schema to database
npm run db:push

# Seed categories
npm run seed:categories
```

## 7. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 8. Test Complete Flow

### A. User Registration
1. Go to `/signup`
2. Fill form with:
   - Name, Email, Phone
   - Password
   - City, State, Pincode
3. Click "Sign Up"
4. Should redirect to homepage

### B. Subscription & Payment
1. Login with created account
2. Go to `/products/new`
3. Should see "Subscription Required" screen
4. Click "Subscribe Now - ₹10/month"
5. Razorpay checkout opens
6. Use test card: `4111 1111 1111 1111`
7. CVV: `123`, Expiry: Any future date
8. Payment success → Redirects to product creation

### C. Create Product
1. Fill product details:
   - Title, Description, Category, Price
2. Upload 1-3 images (max 5MB each)
3. Set location
4. Click "List Product"
5. Should redirect to dashboard (we'll build next)

## 9. Verify Everything Works

Check these:

✅ **Database:**
```bash
npm run db:studio
# Opens Drizzle Studio in browser
# Verify users, products, transactions tables
```

✅ **Subscription:**
- Check Razorpay Dashboard → Subscriptions
- Verify subscription is "Active"

✅ **Images:**
- Check Cloudinary Dashboard → Media Library
- Verify uploaded images appear

✅ **Webhooks (for auto-renewal testing):**
- Use ngrok for local testing
- Check Razorpay Dashboard → Webhooks logs

## 10. Common Issues & Solutions

### Issue: Database connection failed
```bash
# Check DATABASE_URL format
mysql://username:password@host:port/database

# Test connection
mysql -h host -u username -p database
```

### Issue: Razorpay checkout not opening
- Check browser console for errors
- Verify RAZORPAY_KEY_ID in .env
- Ensure Razorpay script loaded (check Network tab)

### Issue: Image upload fails
- Verify Cloudinary credentials
- Check upload preset is "Unsigned"
- Ensure preset name is exactly "marketplace"

### Issue: Payment success but subscription not activated
- Check `/api/subscription/verify` logs
- Verify signature validation
- Check transactions table in database

## Project Structure

```
marketplace/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Login, Signup, Logout
│   │   │   ├── categories/     # Get categories
│   │   │   ├── products/       # CRUD products
│   │   │   └── subscription/   # Payment, Webhook
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── subscription/       # Payment page
│   │   ├── products/new/       # Create product
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── Header.tsx          # Navigation
│   │   ├── ProductCard.tsx     # Product display
│   │   └── ImageUpload.tsx     # Image uploader
│   ├── context/
│   │   ├── AuthContext.tsx     # User state
│   │   └── SearchContext.tsx   # Search state
│   ├── db/
│   │   ├── schema.ts           # Database schema
│   │   └── index.ts            # DB connection
│   └── lib/
│       ├── auth.ts             # JWT, passwords
│       └── razorpay.ts         # Payment utils
├── scripts/
│   └── seed-categories.ts      # Seed data
├── drizzle.config.ts           # Drizzle config
└── .env                        # Environment variables
```

## What's Working Now

✅ User signup/login with JWT authentication
✅ MySQL database with Drizzle ORM
✅ Context API for state management
✅ 8 categories with 40+ subcategories
✅ Product listing with search and filters
✅ Subscription system with Razorpay
✅ ₹10/month recurring payment
✅ Auto-renewal with webhooks
✅ Image upload with Cloudinary
✅ Product creation with subscription check

## What to Build Next

Still missing:
- [ ] Seller Dashboard (manage products)
- [ ] Product Detail Page
- [ ] Edit/Delete products
- [ ] Mark product as sold
- [ ] Admin panel
- [ ] Analytics

Choose what to build next! 🚀