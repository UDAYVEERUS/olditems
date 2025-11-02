// src/app/api/products/create/route.ts
// Create product - FREE LISTING (subscription checks commented out)

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, price, categoryId, images, city, state, pincode, latitude, longitude } = body;

    // Validation
    if (!title || !description || !price || !categoryId || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    if (images.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 images allowed' },
        { status: 400 }
      );
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
.where(eq(users.id, currentUser.id))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ==================== SUBSCRIPTION CHECKS (COMMENTED OUT) ====================
    // Check if user has active subscription
    // const now = new Date();
    // const hasActiveSubscription = 
    //   user.subscriptionStatus === 'ACTIVE' && 
    //   user.subscriptionEndDate && 
    //   new Date(user.subscriptionEndDate) > now;

    // Must have active subscription to list
    // if (!hasActiveSubscription) {
    //   return NextResponse.json(
    //     { 
    //       error: 'Please subscribe to list products. Pay ₹10/month to start listing.', 
    //       needsPayment: true 
    //     },
    //     { status: 403 }
    //   );
    // }
    // ==================== END SUBSCRIPTION CHECKS ====================

    // Generate product ID
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create product - NOW FREE FOR ALL USERS
    await db.insert(products).values({
      id: productId,
      title,
      description,
      price: parseFloat(price),
      categoryId,
      userId: user.id.toString(),
      images: JSON.stringify(images),
      city,
      state,
      pincode,
      latitude: latitude || 0,
      longitude: longitude || 0,
      status: 'ACTIVE',
    });

    // Fetch created product
    const [newProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    return NextResponse.json({
      success: true,
      product: {
        ...newProduct,
        images: JSON.parse(newProduct.images),
      },
      message: 'Product listed successfully!',
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}