// src/app/api/products/route.ts
// Get products with filters using Drizzle ORM

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, users, categories } from '@/db/schema';
import { eq, and, gte, lte, like, or, desc, count } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [eq(products.status, 'ACTIVE')];

    // Search in title and description
    if (search) {
      conditions.push(
        or(
          like(products.title, `%${search}%`),
          like(products.description, `%${search}%`)
        )!
      );
    }

    // Filter by category
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }

    // Filter by price range
    if (minPrice) {
      conditions.push(gte(products.price, parseFloat(minPrice)));
    }
    if (maxPrice) {
      conditions.push(lte(products.price, parseFloat(maxPrice)));
    }

    // Get products with user and category data
    const productsList = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        images: products.images,
        city: products.city,
        state: products.state,
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
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    // Parse images from JSON string
    const productsWithImages = productsList.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
    }));

    // Get total count
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(products)
      .where(and(...conditions));

    return NextResponse.json({
      products: productsWithImages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}