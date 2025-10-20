// src/app/api/categories/route.ts
// Get all categories with Drizzle ORM

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all parent categories
    const parentCategories = await db
      .select()
      .from(categories)
      .where(isNull(categories.parentId));

    // Get subcategories for each parent
    const categoriesWithSubs = await Promise.all(
      parentCategories.map(async (parent) => {
        const subCategories = await db
          .select()
          .from(categories)
          .where(eq(categories.parentId, parent.id));

        return {
          ...parent,
          subCategories,
        };
      })
    );

    return NextResponse.json({ categories: categoriesWithSubs });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST route to create categories
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug and ID
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.insert(categories).values({
      id: categoryId,
      name,
      slug,
      parentId: parentId || null,
    });

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId));

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}