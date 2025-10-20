// src/app/api/products/my-products/route.ts
// Get all products for logged-in user

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all products for this user
    const userProducts = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        images: products.images,
        status: products.status,
        views: products.views,
        phoneClicks: products.phoneClicks,
        city: products.city,
        state: products.state,
        createdAt: products.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.userId, currentUser.userId))
      .orderBy(desc(products.createdAt));

    // Parse images from JSON string
    const productsWithImages = userProducts.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
    }));

    return NextResponse.json({
      products: productsWithImages,
    });
  } catch (error) {
    console.error('Get my products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}