// src/app/api/products/[id]/details/route.ts
// Get single product details with user and category info

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, users, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get product with user and category data
    const [product] = await db
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
        pincode: products.pincode,
        createdAt: products.createdAt,
        user: {
          id: users.id,
          name: users.name,
          phone: users.phone,
          city: users.city,
          state: users.state,
        },
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(products)
      .leftJoin(users, eq(products.userId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, params.id))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Parse images from JSON string
    const productWithImages = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    };

    return NextResponse.json({ product: productWithImages });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}