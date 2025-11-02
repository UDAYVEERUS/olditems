// src/app/api/products/route.ts
// Get products with filters using Drizzle ORM

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, users, categories } from '@/db/schema';
import { eq, and, gte, lte, ilike, or, desc, asc, count } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'latest'; // latest, price-low, price-high
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12'); // Changed to 12 for better grid display
    const offset = (page - 1) * limit;

    // Build where conditions - ALWAYS initialize with ACTIVE status check
    const conditions: any[] = [eq(products.status, 'ACTIVE')];

    // Search in title and description (case-insensitive)
    if (search && search.trim() !== '') {
      conditions.push(
        or(
          ilike(products.title, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      );
    }

    // Filter by category (support both categoryId and category name)
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    } else if (category) {
      conditions.push(eq(products.categoryId, category));
    }

    // Filter by location (case-insensitive)
    if (city && city !== '') {
      conditions.push(ilike(products.city, `%${city}%`));
    }
    
    if (state && state !== '') {
      conditions.push(ilike(products.state, `%${state}%`));
    }

    // Filter by price range
    if (minPrice) {
      conditions.push(gte(products.price, parseFloat(minPrice)));
    }
    if (maxPrice) {
      conditions.push(lte(products.price, parseFloat(maxPrice)));
    }

    // Build order by clause based on sortBy parameter
    let orderByClause;
    switch (sortBy) {
      case 'price-low':
        orderByClause = asc(products.price);
        break;
      case 'price-high':
        orderByClause = desc(products.price);
        break;
      case 'latest':
      default:
        orderByClause = desc(products.createdAt);
        break;
    }

    // Build WHERE clause - will always have at least ACTIVE status filter
    const whereClause = and(...conditions);
    
    const productsList = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        images: products.images,
        city: products.city,
        state: products.state,
        pincode: products.pincode,
        status: products.status,
        views: products.views,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        // User/Seller info
        seller: {
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          city: users.city,
          state: users.state,
        },
        // Category info
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(products)
      .leftJoin(users, eq(products.userId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    console.log(`Found ${productsList.length} products for page ${page}`);

    // Parse images from JSON string if needed
    const productsWithImages = productsList.map((p) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      // Make sure seller exists before returning
      seller: p.seller?.id ? p.seller : null,
      category: p.category?.id ? p.category : null,
    }));

    // Get total count for pagination
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(products)
      .where(whereClause);

    console.log(`Total products matching criteria: ${total}`);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      products: productsWithImages,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}