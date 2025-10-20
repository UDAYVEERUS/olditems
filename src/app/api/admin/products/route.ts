// src/app/api/admin/products/route.ts
// Get all products for admin

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, users, categories } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

const ADMIN_EMAILS = ['udayveerus348566@gmail.com'];

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, currentUser.userId))
      .limit(1);

    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all products with user and category info
    const allProducts = await db
      .select({
        id: products.id,
        title: products.title,
        price: products.price,
        images: products.images,
        status: products.status,
        views: products.views,
        phoneClicks: products.phoneClicks,
        createdAt: products.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        category: {
          name: categories.name,
        },
      })
      .from(products)
      .leftJoin(users, eq(products.userId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));

    // Parse images
    const productsWithImages = allProducts.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
    }));

    return NextResponse.json({ products: productsWithImages });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}