// src/app/api/products/[id]/edit/route.ts
// Get product for editing (must be owner)

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get product (only if user owns it)
    const [product] = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        images: products.images,
        categoryId: products.categoryId,
        city: products.city,
        state: products.state,
        pincode: products.pincode,
        latitude: products.latitude,
        longitude: products.longitude,
      })
      .from(products)
      .where(
        and(
          eq(products.id, id),
          eq(products.userId, currentUser.userId)
        )
      )
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    // Parse images
    const productWithImages = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    };

    return NextResponse.json({ product: productWithImages });
  } catch (error) {
    console.error('Get product for edit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}